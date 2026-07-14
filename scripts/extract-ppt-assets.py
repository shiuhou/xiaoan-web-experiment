#!/usr/bin/env python3
"""Extract, inventory, classify, and curate image assets from a PPTX file."""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import math
import posixpath
import re
import shutil
import zipfile
from collections import defaultdict
from pathlib import Path
from xml.etree import ElementTree as ET

from PIL import Image, ImageDraw, ImageFont, ImageOps, UnidentifiedImageError


DRAWING_NS = "http://schemas.openxmlformats.org/drawingml/2006/main"
REL_DOC_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
REL_PACKAGE_NS = "http://schemas.openxmlformats.org/package/2006/relationships"


def _slide_number(name: str) -> int:
    match = re.search(r"slide(\d+)\.xml$", name)
    if not match:
        raise ValueError(f"Not a slide XML path: {name}")
    return int(match.group(1))


def _slide_asset_context(archive: zipfile.ZipFile) -> dict[str, dict[str, object]]:
    usage: dict[str, dict[str, object]] = defaultdict(
        lambda: {"slides": [], "contexts": []}
    )
    slide_names = sorted(
        (
            name
            for name in archive.namelist()
            if re.fullmatch(r"ppt/slides/slide\d+\.xml", name)
        ),
        key=_slide_number,
    )

    for slide_name in slide_names:
        slide_no = _slide_number(slide_name)
        slide_root = ET.fromstring(archive.read(slide_name))
        context = " ".join(
            text.text.strip()
            for text in slide_root.findall(f".//{{{DRAWING_NS}}}t")
            if text.text and text.text.strip()
        )
        relationship_ids = {
            node.attrib.get(f"{{{REL_DOC_NS}}}embed")
            for node in slide_root.findall(f".//{{{DRAWING_NS}}}blip")
        }
        relationship_ids.discard(None)

        rels_name = (
            f"ppt/slides/_rels/{Path(slide_name).name}.rels"
        )
        if rels_name not in archive.namelist():
            continue
        rels_root = ET.fromstring(archive.read(rels_name))
        for relationship in rels_root.findall(f"{{{REL_PACKAGE_NS}}}Relationship"):
            if relationship.attrib.get("Id") not in relationship_ids:
                continue
            if not relationship.attrib.get("Type", "").endswith("/image"):
                continue
            target = relationship.attrib.get("Target", "")
            resolved = posixpath.normpath(
                posixpath.join(posixpath.dirname(slide_name), target)
            )
            if not resolved.startswith("ppt/media/"):
                continue
            filename = posixpath.basename(resolved)
            usage[filename]["slides"].append(slide_no)
            if context and context not in usage[filename]["contexts"]:
                usage[filename]["contexts"].append(context)
    return usage


def classify_asset(
    filename: str,
    width: int | None,
    height: int | None,
    slides: list[int],
    context: str,
) -> list[str]:
    text = f"{filename} {context}".lower()
    slide_set = set(slides)
    categories: set[str] = set()

    if slide_set & {1, 5, 6, 14} or any(
        token in text
        for token in ("小安", "机器人外观", "成品", "部件组成", "xiao-an", "xiao an")
    ):
        categories.add("product")
    if slide_set & {7, 8, 9, 10} or any(
        token in text for token in ("架构", "通信流程", "端边", "openclaw", "闭环")
    ):
        categories.add("architecture")
    if slide_set & {6, 9} or any(
        token in text
        for token in ("硬件", "内部结构", "接线", "dk-2500", "intel", "开发板", "基站")
    ):
        categories.add("hardware")
    if any(token in text for token in ("dashboard", "控制台", "界面", "屏幕状态")):
        categories.add("dashboard")
    if any(token in text for token in ("表情", "emotion", "expression")):
        categories.add("expression")
    if "logo" in text or (
        width is not None
        and height is not None
        and width <= 640
        and height <= 320
        and max(width, height) >= 160
    ):
        categories.add("logo_or_icon")
    if not categories:
        categories.add("supporting")
    return sorted(categories)


def _inspect_image(path: Path) -> tuple[int | None, int | None, str, str]:
    try:
        with Image.open(path) as image:
            return image.width, image.height, image.format or path.suffix[1:].upper(), image.mode
    except (UnidentifiedImageError, OSError):
        return None, None, path.suffix[1:].upper() or "UNKNOWN", "unknown"


def _is_selected(record: dict[str, object]) -> bool:
    width = record.get("width")
    height = record.get("height")
    if not isinstance(width, int) or not isinstance(height, int):
        return False
    if width * height < 120_000 or max(width, height) < 480:
        return False
    categories = set(record.get("categories", []))
    return bool(
        categories
        & {"product", "architecture", "hardware", "dashboard", "expression"}
    )


def extract_ppt_assets(pptx_path: Path | str, output_dir: Path | str) -> list[dict[str, object]]:
    pptx_path = Path(pptx_path)
    output_dir = Path(output_dir)
    originals_dir = output_dir / "originals"
    originals_dir.mkdir(parents=True, exist_ok=True)

    records: list[dict[str, object]] = []
    with zipfile.ZipFile(pptx_path) as archive:
        usage = _slide_asset_context(archive)
        media_names = sorted(
            name
            for name in archive.namelist()
            if name.startswith("ppt/media/") and not name.endswith("/")
        )
        for media_name in media_names:
            filename = posixpath.basename(media_name)
            destination = originals_dir / filename
            payload = archive.read(media_name)
            destination.write_bytes(payload)
            width, height, image_format, mode = _inspect_image(destination)
            entry_usage = usage.get(filename, {"slides": [], "contexts": []})
            slides = sorted(set(entry_usage["slides"]))
            context = " | ".join(entry_usage["contexts"])
            categories = classify_asset(filename, width, height, slides, context)
            records.append(
                {
                    "filename": filename,
                    "source_path": media_name,
                    "width": width,
                    "height": height,
                    "format": image_format,
                    "mode": mode,
                    "bytes": len(payload),
                    "sha256": hashlib.sha256(payload).hexdigest(),
                    "slides": slides,
                    "context": context,
                    "categories": categories,
                    "selected": False,
                }
            )
    return records


def create_contact_sheet(
    records: list[dict[str, object]], originals_dir: Path, output_path: Path
) -> None:
    raster_records = [
        record
        for record in records
        if isinstance(record.get("width"), int) and isinstance(record.get("height"), int)
    ]
    columns = 4
    tile_width, tile_height = 360, 270
    rows = max(1, math.ceil(len(raster_records) / columns))
    sheet = Image.new("RGB", (columns * tile_width, rows * tile_height), "#071018")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()

    for index, record in enumerate(raster_records):
        row, column = divmod(index, columns)
        x, y = column * tile_width, row * tile_height
        image_path = originals_dir / str(record["filename"])
        try:
            with Image.open(image_path) as source:
                preview = ImageOps.contain(source.convert("RGB"), (332, 196))
        except (UnidentifiedImageError, OSError):
            continue
        image_x = x + (tile_width - preview.width) // 2
        image_y = y + 12 + (196 - preview.height) // 2
        sheet.paste(preview, (image_x, image_y))
        draw.rectangle((x, y, x + tile_width - 1, y + tile_height - 1), outline="#193342")
        slides = ",".join(str(value) for value in record["slides"]) or "-"
        categories = ", ".join(record["categories"])
        labels = [
            str(record["filename"]),
            f"{record['width']}x{record['height']}  slides:{slides}",
            categories[:54],
        ]
        for offset, label in enumerate(labels):
            draw.text((x + 14, y + 214 + offset * 15), label, fill="#d8edf4", font=font)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output_path, quality=90, optimize=True)


def _write_csv(records: list[dict[str, object]], output_path: Path) -> None:
    fieldnames = [
        "filename",
        "source_path",
        "width",
        "height",
        "format",
        "mode",
        "bytes",
        "sha256",
        "slides",
        "categories",
        "selected",
        "context",
    ]
    with output_path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        for record in records:
            row = dict(record)
            row["slides"] = ",".join(str(value) for value in record["slides"])
            row["categories"] = ",".join(record["categories"])
            writer.writerow(row)


def run_extraction(
    pptx_path: Path | str,
    output_dir: Path | str,
    public_dir: Path | str,
) -> dict[str, object]:
    pptx_path = Path(pptx_path)
    output_dir = Path(output_dir)
    public_dir = Path(public_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    public_dir.mkdir(parents=True, exist_ok=True)

    records = extract_ppt_assets(pptx_path, output_dir)
    selected = [record for record in records if _is_selected(record)]
    if not selected:
        selected = sorted(
            (
                record
                for record in records
                if isinstance(record.get("width"), int)
                and isinstance(record.get("height"), int)
            ),
            key=lambda record: int(record["width"]) * int(record["height"]),
            reverse=True,
        )[:8]
    selected_names = {str(record["filename"]) for record in selected}
    for record in records:
        record["selected"] = str(record["filename"]) in selected_names
        if record["selected"]:
            shutil.copy2(
                output_dir / "originals" / str(record["filename"]),
                public_dir / str(record["filename"]),
            )

    (output_dir / "asset-inventory.json").write_text(
        json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    _write_csv(records, output_dir / "asset-inventory.csv")
    create_contact_sheet(records, output_dir / "originals", output_dir / "contact-sheet.jpg")
    (output_dir / "selected-assets.json").write_text(
        json.dumps(sorted(selected_names), ensure_ascii=False, indent=2), encoding="utf-8"
    )
    return {
        "source": str(pptx_path),
        "asset_count": len(records),
        "selected_count": len(selected_names),
        "output_dir": str(output_dir),
        "public_dir": str(public_dir),
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", required=True, type=Path, help="Source PPTX file")
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path("work/ppt-assets"),
        help="Extraction output with originals, inventory, and contact sheet",
    )
    parser.add_argument(
        "--public-dir",
        type=Path,
        default=Path("public/assets/ppt"),
        help="Curated assets copied for the website",
    )
    return parser.parse_args()


def dumps_console_safe(value: object) -> str:
    """Return JSON that remains printable on legacy Windows console encodings."""
    return json.dumps(value, ensure_ascii=True, indent=2)


def main() -> None:
    args = parse_args()
    result = run_extraction(args.input, args.output_dir, args.public_dir)
    print(dumps_console_safe(result))


if __name__ == "__main__":
    main()
