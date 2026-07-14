from __future__ import annotations

import importlib.util
import json
import tempfile
import unittest
import zipfile
from pathlib import Path

from PIL import Image


SCRIPT_PATH = Path(__file__).parents[1] / "scripts" / "extract-ppt-assets.py"


def load_script():
    spec = importlib.util.spec_from_file_location("extract_ppt_assets", SCRIPT_PATH)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Unable to load {SCRIPT_PATH}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def make_png(path: Path, size: tuple[int, int], color: tuple[int, int, int]) -> None:
    Image.new("RGB", size, color).save(path)


class ExtractPptAssetsTest(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)

    def tearDown(self) -> None:
        self.tmp.cleanup()

    def make_fixture(self) -> Path:
        image_path = self.root / "product.png"
        make_png(image_path, (640, 480), (20, 40, 60))
        pptx_path = self.root / "fixture.pptx"
        slide_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
       xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
       xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld><p:spTree>
    <p:sp><p:txBody><a:p><a:r><a:t>小安机器人外观展示</a:t></a:r></a:p></p:txBody></p:sp>
    <p:pic><p:blipFill><a:blip r:embed="rId2"/></p:blipFill></p:pic>
  </p:spTree></p:cSld>
</p:sld>"""
        rels_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId2"
    Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image"
    Target="../media/image1.png"/>
</Relationships>"""
        with zipfile.ZipFile(pptx_path, "w") as archive:
            archive.write(image_path, "ppt/media/image1.png")
            archive.writestr("ppt/slides/slide1.xml", slide_xml)
            archive.writestr("ppt/slides/_rels/slide1.xml.rels", rels_xml)
            archive.writestr("docProps/ignored.txt", "not media")
        return pptx_path

    def test_extracts_media_and_maps_slide_context(self) -> None:
        module = load_script()
        pptx_path = self.make_fixture()
        output_dir = self.root / "output"

        records = module.extract_ppt_assets(pptx_path, output_dir)

        self.assertEqual(len(records), 1)
        record = records[0]
        self.assertEqual(record["filename"], "image1.png")
        self.assertEqual(record["width"], 640)
        self.assertEqual(record["height"], 480)
        self.assertEqual(record["slides"], [1])
        self.assertIn("小安机器人外观展示", record["context"])
        self.assertIn("product", record["categories"])
        self.assertTrue((output_dir / "originals" / "image1.png").exists())

    def test_writes_inventory_contact_sheet_and_selected_copy(self) -> None:
        module = load_script()
        pptx_path = self.make_fixture()
        output_dir = self.root / "output"
        public_dir = self.root / "public"

        result = module.run_extraction(pptx_path, output_dir, public_dir)

        inventory = json.loads((output_dir / "asset-inventory.json").read_text(encoding="utf-8"))
        self.assertEqual(inventory[0]["filename"], "image1.png")
        self.assertTrue((output_dir / "contact-sheet.jpg").exists())
        self.assertTrue((public_dir / "image1.png").exists())
        self.assertEqual(result["asset_count"], 1)
        self.assertEqual(result["selected_count"], 1)

    def test_console_summary_is_safe_on_legacy_windows_code_pages(self) -> None:
        module = load_script()

        summary = module.dumps_console_safe({"source": "结题(3).pptx"})

        summary.encode("cp950")
        self.assertIn("\\u7ed3", summary)


if __name__ == "__main__":
    unittest.main()
