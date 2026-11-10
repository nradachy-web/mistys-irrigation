"""Build the site's photo sources from the originals in _source (not committed).

Three kinds of picture, kept apart on purpose (see src/data/photos.ts):
  real    Misty's own photos, from their Google listing.
  relit   a real job photo relit with an image model. Same lawn, same lake, same sprinklers.
  ai      made from a prompt for a service with no job photo yet. Always captioned "Illustration".

Output: src/assets/photos/<id>.jpg, EXIF-rotated, cropped where noted, long side capped.
Real photos get photokit.grade(): light and color only. Astro makes AVIF and WebP at build time.
Crops are fractions (left, top, right, bottom) of the rotated original.
Run: python3 scripts/photos.py
"""
from pathlib import Path
from PIL import Image, ImageOps
from photokit import grade

ROOT = Path(__file__).resolve().parent.parent
S = ROOT / "_source"
OUT = ROOT / "src" / "assets" / "photos"
OUT.mkdir(parents=True, exist_ok=True)
MAX = 2000

REAL = {
    "lake-lawn": ("media/p3.jpg", None, 0.8),
    "estate-clouds": ("media/p5.jpg", None, 0.8),
    "garden-misters": ("media/p7.jpg", None, 0.7),
    "pine-lawn": ("media/p10.jpg", None, 0.8),
    "flagstone-pond": ("media/p11.jpg", None, 0.8),
    "colonial-mist": ("media/p12.jpg", None, 0.7),
    "trencher-dog": ("media/p14.jpg", None, 0.6),
    "wrap-car-dog": ("media/p15.jpg", None, 0.5),
    "street-sprinklers": ("media/p16.jpg", None, 0.8),
}
RELIT = {
    "lake-sunrise": ("gen/out/hero-relit-1.png", None),
}
AI = {
    n: (f"gen/out/{n}.png", None)
    for n in [
        "ai-spray-macro", "ai-valve-box", "ai-controller", "ai-blowout", "ai-pvb",
        "ai-lake-pump", "ai-drip", "ai-startup", "ai-rust-clean", "ai-rust-stained",
    ]
}


def load(rel, crop):
    im = ImageOps.exif_transpose(Image.open(S / rel)).convert("RGB")
    if crop:
        w, h = im.size
        l, t, r, b = crop
        im = im.crop((round(l * w), round(t * h), round(r * w), round(b * h)))
    if max(im.size) > MAX:
        im.thumbnail((MAX, MAX), Image.LANCZOS)
    return im


def save(im, pid):
    im.save(OUT / f"{pid}.jpg", quality=90, optimize=True, progressive=True)


done, missing = 0, []
for pid, (rel, crop, s) in REAL.items():
    if not (S / rel).exists():
        missing.append(pid); continue
    save(grade(load(rel, crop), s), pid); done += 1
for group in (RELIT, AI):
    for pid, (rel, crop) in group.items():
        if not (S / rel).exists():
            missing.append(pid); continue
        save(load(rel, crop), pid); done += 1
print(f"photos: wrote {done}", f"missing {missing}" if missing else "")
