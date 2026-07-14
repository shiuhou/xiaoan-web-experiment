from __future__ import annotations

import argparse
import hashlib
import json
import shutil
from pathlib import Path
from typing import Any

from PIL import Image


CARE_CROP = (496, 90, 636, 168)


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def image_metadata(path: Path) -> dict[str, Any]:
    with Image.open(path) as image:
        return {
            "dimensions": [image.width, image.height],
            "mode": image.mode,
        }


def prepare_assets(source_root: Path, output_root: Path) -> dict[str, Any]:
    expression_source = source_root / "xiaoan-expressions.png"
    product_source = source_root / "xiaoan-dock.png"
    output_root.mkdir(parents=True, exist_ok=True)

    expression_output = output_root / "expression-care.png"
    foreground_output = output_root / "product-foreground.png"
    dock_output = output_root / "product-dock.png"

    with Image.open(expression_source) as source_image:
        source_width, source_height = source_image.size
        care_expression = source_image.convert("RGBA").crop(CARE_CROP)
        care_expression.save(expression_output, format="PNG", optimize=True)

    crop_normalized = [
        round(CARE_CROP[0] / source_width, 6),
        round(CARE_CROP[1] / source_height, 6),
        round(CARE_CROP[2] / source_width, 6),
        round(CARE_CROP[3] / source_height, 6),
    ]

    # The source product is already a clean transparent composite. V2 keeps
    # exact safe copies and performs conservative clipping in CSS so that no
    # invented robot edge or destructive inpainting enters the deliverable.
    shutil.copy2(product_source, foreground_output)
    shutil.copy2(product_source, dock_output)

    manifest = {
        "expression_care": {
            "source": expression_source.as_posix(),
            "source_sha256": sha256(expression_source),
            "output": expression_output.name,
            "crop": list(CARE_CROP),
            "crop_normalized": crop_normalized,
            "note": "Authentic worried cyan expression from the top-right source panel.",
            **image_metadata(expression_output),
        },
        "product_foreground": {
            "source": product_source.as_posix(),
            "source_sha256": sha256(product_source),
            "output": foreground_output.name,
            "strategy": "safe_full_copy",
            "note": "Full transparent source retained; CSS mask supplies conservative foreground clipping.",
            **image_metadata(foreground_output),
        },
        "product_dock": {
            "source": product_source.as_posix(),
            "source_sha256": sha256(product_source),
            "output": dock_output.name,
            "strategy": "safe_full_copy",
            "note": "Full transparent source retained to avoid destructive object removal.",
            **image_metadata(dock_output),
        },
    }
    (output_root / "asset-manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    return manifest


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Prepare non-destructive Xiao-An V2 assets.")
    parser.add_argument(
        "--source-root",
        type=Path,
        default=Path("public/assets/product"),
    )
    parser.add_argument(
        "--output-root",
        type=Path,
        default=Path("public/assets/v2"),
    )
    return parser.parse_args()


if __name__ == "__main__":
    arguments = parse_args()
    prepare_assets(arguments.source_root, arguments.output_root)
