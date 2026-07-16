from __future__ import annotations

import argparse
import hashlib
import json
import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
V2_ROOT = ROOT / "artifacts" / "v2"


def copy_tree(source: Path, target: Path) -> None:
    if target.exists():
        shutil.rmtree(target)
    shutil.copytree(source, target)


def load_font(size: int, semibold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    name = "seguisb.ttf" if semibold else "segoeui.ttf"
    candidate = Path("C:/Windows/Fonts") / name
    if candidate.exists():
        return ImageFont.truetype(str(candidate), size=size)
    return ImageFont.load_default()


def fit_panel(source: Path, size: tuple[int, int]) -> Image.Image:
    with Image.open(source) as image:
        return ImageOps.fit(
            image.convert("RGB"),
            size,
            method=Image.Resampling.LANCZOS,
            centering=(0.5, 0.5),
        )


def comparison_board(title: str, before: Path, after: Path, output: Path) -> None:
    canvas = Image.new("RGB", (2200, 780), "#050708")
    draw = ImageDraw.Draw(canvas)
    title_font = load_font(30, semibold=True)
    label_font = load_font(18, semibold=True)
    note_font = load_font(15)
    draw.text((48, 30), title, fill="#edf4f1", font=title_font)
    draw.text(
        (2152, 39),
        "XIAO-AN / VISUAL OVERHAUL V2",
        fill="#668188",
        font=note_font,
        anchor="ra",
    )

    panel_size = (1024, 640)
    for x, source, label, accent in [
        (48, before, "V1 / PREVIOUS", "#60767b"),
        (1128, after, "V2 / FRACTURE INTO FORM", "#5ee7ff"),
    ]:
        panel = fit_panel(source, panel_size)
        canvas.paste(panel, (x, 100))
        draw.rectangle((x, 100, x + panel_size[0], 740), outline="#1b292d", width=1)
        draw.rectangle((x, 100, x + 286, 136), fill="#050708")
        draw.line((x, 136, x + 286, 136), fill=accent, width=2)
        draw.text((x + 16, 111), label, fill=accent, font=label_font)

    output.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(output, format="PNG", optimize=True)


def file_record(path: Path) -> dict[str, object]:
    data = path.read_bytes()
    return {
        "file": path.relative_to(ROOT).as_posix(),
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Assemble final Xiao-An V2 review artifacts")
    parser.add_argument("--pass-name", default="final-delivery")
    args = parser.parse_args()

    capture_root = V2_ROOT / "qa" / "captures"
    sources = {
        "desktop": capture_root / f"{args.pass_name}-desktop",
        "mobile": capture_root / f"{args.pass_name}-mobile",
        "reduced-motion": capture_root / f"{args.pass_name}-desktop-reduced",
    }
    missing = [str(path) for path in sources.values() if not path.exists()]
    if missing:
        raise FileNotFoundError(f"Missing final capture directories: {missing}")

    for name, source in sources.items():
        copy_tree(source, V2_ROOT / name)

    responsive_source = V2_ROOT / "qa" / "responsive"
    if responsive_source.exists():
        copy_tree(responsive_source, V2_ROOT / "desktop" / "responsive")

    v1_root = ROOT / "artifacts" / "qa" / "review-polish-desktop"
    comparisons = V2_ROOT / "comparisons"
    if comparisons.exists():
        shutil.rmtree(comparisons)
    comparisons.mkdir(parents=True)
    pairs = [
        ("HERO / V1 TO V2", "awakening.png", "wake.png", "hero-v1-v2.png"),
        ("BREAKING / V1 TO V2", "breaking.png", "break.png", "breaking-v1-v2.png"),
        ("PRESENCE / V1 TO V2", "presence.png", "presence.png", "presence-v1-v2.png"),
    ]
    for title, before_name, after_name, output_name in pairs:
        comparison_board(
            title,
            v1_root / before_name,
            sources["desktop"] / after_name,
            comparisons / output_name,
        )

    deliverable_roots = [
        V2_ROOT / "desktop",
        V2_ROOT / "mobile",
        V2_ROOT / "reduced-motion",
        comparisons,
        V2_ROOT / "signature-moments",
        V2_ROOT / "recordings",
    ]
    files = sorted(
        path
        for root in deliverable_roots
        for path in root.rglob("*")
        if path.is_file()
    )
    manifest = {
        "capturePass": args.pass_name,
        "files": [file_record(path) for path in files],
    }
    (V2_ROOT / "DELIVERY_MANIFEST.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
