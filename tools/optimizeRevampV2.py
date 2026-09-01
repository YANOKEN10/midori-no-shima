from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "assets" / "revamp-v2"
TARGETS = {
    "terrain-source.png": (768, 768),
    "hero-source.png": (512, 512),
    "objects-source.png": (768, 768),
}

for name, size in TARGETS.items():
    path = ROOT / name
    with Image.open(path) as source:
        image = source.convert("RGB").resize(size, Image.Resampling.LANCZOS)
        image.save(path, format="PNG", optimize=True)
    print(name, path.stat().st_size)
