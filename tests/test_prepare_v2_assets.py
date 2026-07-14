import hashlib
import tempfile
import unittest
from pathlib import Path

from PIL import Image

from scripts.prepare_v2_assets import prepare_assets


class PrepareV2AssetsTest(unittest.TestCase):
    def test_generates_rgba_layers_without_modifying_sources(self):
        source = Path("public/assets/product")
        expression_source = source / "xiaoan-expressions.png"
        product_source = source / "xiaoan-dock.png"
        before_expression = hashlib.sha256(expression_source.read_bytes()).hexdigest()
        before_product = hashlib.sha256(product_source.read_bytes()).hexdigest()

        with tempfile.TemporaryDirectory() as temp_dir:
            output = Path(temp_dir)
            manifest = prepare_assets(source, output)

            care_path = output / "expression-care.png"
            foreground_path = output / "product-foreground.png"
            dock_path = output / "product-dock.png"
            self.assertTrue(care_path.exists())
            self.assertTrue(foreground_path.exists())
            self.assertTrue(dock_path.exists())
            with Image.open(care_path) as care_image:
                self.assertEqual(care_image.mode, "RGBA")
            self.assertEqual(manifest["expression_care"]["mode"], "RGBA")
            self.assertEqual(
                manifest["expression_care"]["crop"], [496, 90, 636, 168]
            )
            self.assertEqual(
                manifest["expression_care"].get("crop_normalized"),
                [0.665772, 0.157618, 0.853691, 0.294221],
            )
            self.assertEqual(
                manifest["product_foreground"]["strategy"], "safe_full_copy"
            )

        self.assertEqual(
            before_expression,
            hashlib.sha256(expression_source.read_bytes()).hexdigest(),
        )
        self.assertEqual(
            before_product,
            hashlib.sha256(product_source.read_bytes()).hexdigest(),
        )


if __name__ == "__main__":
    unittest.main()
