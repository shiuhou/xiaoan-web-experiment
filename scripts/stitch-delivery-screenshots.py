from __future__ import annotations

import shutil
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "artifacts" / "screenshots"
SCENES = (
    "awakening",
    "breaking",
    "perception",
    "edge",
    "understanding",
    "presence",
    "system",
    "closing",
)


def stitch(paths: list[Path], destination: Path) -> None:
    images = [Image.open(path).convert("RGB") for path in paths]
    width = max(image.width for image in images)
    height = sum(image.height for image in images)
    canvas = Image.new("RGB", (width, height), "#020507")
    y = 0
    for image in images:
        canvas.paste(image, ((width - image.width) // 2, y))
        y += image.height
    canvas.save(destination, optimize=True, quality=92)
    for image in images:
        image.close()


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    desktop_dir = ROOT / "artifacts" / "qa" / "final-desktop"
    mobile_dir = ROOT / "artifacts" / "qa" / "final-mobile"

    desktop_paths = [OUTPUT / "hero-1440x900.png"] + [
        desktop_dir / f"{scene}.png" for scene in SCENES[1:]
    ]
    mobile_paths = [mobile_dir / f"{scene}.png" for scene in SCENES]

    stitch(desktop_paths, OUTPUT / "desktop-full-narrative.png")
    stitch(mobile_paths, OUTPUT / "mobile-full-narrative.png")
    shutil.copy2(mobile_dir / "awakening.png", OUTPUT / "mobile-hero-390x844.png")


if __name__ == "__main__":
    main()
