"""Brand files from Misty's own logo (the hot pink version Mike emailed on 2024-02-16).

The original is a 3016 x 1445 transparent PNG with black "IRRIGATION SERVICES" lettering
under the wordmark. Nothing is redrawn. Outputs, all in public/:
  brand/mark.png        the wordmark, arcs and daisy without the line under it (header)
  brand/logo-dark.png   the whole logo with the lower line turned white (footer, on ink)
  brand/logo.png        the whole logo as sent (schema, light grounds)
  favicon.ico, favicon-32.png, apple-touch-icon.png, icon-192.png, icon-512.png:
                        the daisy from the logo on a pink tile
Run: python3 scripts/brand.py
"""
from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "_source" / "media" / "gmail" / "18db35ff-Hot Pink.png"
PUB = ROOT / "public"
(PUB / "brand").mkdir(parents=True, exist_ok=True)

im = Image.open(SRC).convert("RGBA")
a = np.array(im)
H, W = a.shape[:2]

# the line under the wordmark starts below the letters' drop shadow
SPLIT = 1150
mark = im.crop((0, 0, W, SPLIT))
bbox = mark.getbbox()
mark = mark.crop(bbox)

dark = a.copy()
sub = dark[SPLIT:]
rgb = sub[..., :3].astype(np.int32)
is_ink = (sub[..., 3] > 0) & (rgb.max(axis=2) < 90)
sub[is_ink, 0] = 244
sub[is_ink, 1] = 246
sub[is_ink, 2] = 248
dark[SPLIT:] = sub
logo_dark = Image.fromarray(dark).crop(Image.fromarray(dark).getbbox())
logo = im.crop(im.getbbox())


def fit_w(img, w):
    h = round(img.height * w / img.width)
    return img.resize((w, h), Image.LANCZOS)


def fit_h(img, h):
    w = round(img.width * h / img.height)
    return img.resize((w, h), Image.LANCZOS)


# header mark: shown at 54px tall on desktop, so 2x is 108; 3x for phones with dense screens
m = fit_h(mark, 162)
m.save(PUB / "brand" / "mark.png", optimize=True)
print("mark", m.size)
fit_w(logo_dark, 720).save(PUB / "brand" / "logo-dark.png", optimize=True)
fit_w(logo, 720).save(PUB / "brand" / "logo.png", optimize=True)

# the daisy: find the yellow center, take a square around the flower head
yellow = (a[..., 0] > 200) & (a[..., 1] > 180) & (a[..., 2] < 140) & (a[..., 3] > 200)
ys, xs = np.where(yellow)
cy, cx = int(ys.mean()), int(xs.mean())
r = 175
box = (cx - r, cy - r + 10, cx + r, cy + r + 10)
crop = np.array(im.crop(box))
# keep only the flower: the connected shape that holds the yellow center (drops the
# arc tip and the S beside it), and nothing pink or blue
from skimage.measure import label
solid = crop[..., 3] > 40
c = crop[..., :3].astype(np.int32)
pinkish = (c[..., 0] > 180) & (c[..., 1] < 120) & (c[..., 2] > 90)
blueish = (c[..., 2] > 150) & (c[..., 0] < 140)
lab = label(solid & ~pinkish & ~blueish, connectivity=1)
keep = lab == lab[r - 10, r]
crop[~keep, 3] = 0
daisy = Image.fromarray(crop)
daisy = daisy.crop(daisy.getbbox())
side = max(daisy.size)
sq = Image.new("RGBA", (side, side), (0, 0, 0, 0))
sq.alpha_composite(daisy, ((side - daisy.width) // 2, (side - daisy.height) // 2))
daisy = sq
PINK = (232, 48, 144, 255)


def tile(size, pad=0.12, radius=0.22):
    t = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    from PIL import ImageDraw
    d = ImageDraw.Draw(t)
    d.rounded_rectangle((0, 0, size - 1, size - 1), radius=int(size * radius), fill=PINK)
    inner = int(size * (1 - 2 * pad))
    f = daisy.resize((inner, inner), Image.LANCZOS)
    t.alpha_composite(f, (int(size * pad), int(size * pad)))
    return t


for name, size in [("favicon-32.png", 32), ("apple-touch-icon.png", 180), ("icon-192.png", 192), ("icon-512.png", 512)]:
    t = tile(size)
    if name == "apple-touch-icon.png":
        bg = Image.new("RGBA", t.size, PINK)
        bg.alpha_composite(t)
        t = bg
    t.save(PUB / name, optimize=True)
tile(48).save(PUB / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
print("daisy center", cx, cy)

# web versions: the header mark at 2x its 54px height, the footer logo at 2x its 216px width
m2 = fit_h(mark, 108)
m2.save(PUB / "brand" / "mark.webp", quality=90, method=6)
l2 = fit_w(logo_dark, 432)
l2.save(PUB / "brand" / "logo-dark.webp", quality=88, method=6)
print("webp", m2.size, l2.size)
