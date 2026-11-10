"""The share image (public/og-image.jpg, 1200 x 630): the relit lakefront job, the
logo and one line, set in the site's own font. Run: python3 scripts/og.py
Needs fontTools with brotli (to read the woff2); see _source/gen/pylib."""
import io
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "_source" / "gen" / "pylib"))
from fontTools.ttLib import TTFont  # noqa: E402


def font(size, weight):
    f = TTFont(ROOT / "src" / "assets" / "fonts" / "MistyText.woff2")
    f.flavor = None
    from fontTools.varLib.instancer import instantiateVariableFont
    inst = instantiateVariableFont(f, {"wght": weight})
    buf = io.BytesIO()
    inst.save(buf)
    buf.seek(0)
    return ImageFont.truetype(buf, size)


W, H = 1200, 630
photo = Image.open(ROOT / "src" / "assets" / "photos" / "lake-sunrise.jpg").convert("RGB")
s = max(W / photo.width, H / photo.height)
photo = photo.resize((round(photo.width * s), round(photo.height * s)), Image.LANCZOS)
left = (photo.width - W) // 2
top = (photo.height - H) // 2
img = photo.crop((left, top, left + W, top + H)).convert("RGBA")

shade = Image.new("RGBA", (W, H), (0, 0, 0, 0))
d = ImageDraw.Draw(shade)
for x in range(W):
    a = max(0, min(235, int(235 * (1 - x / (W * 0.72)) ** 1.1))) if x < W * 0.72 else 0
    d.line([(x, 0), (x, H)], fill=(11, 18, 32, a))
img = Image.alpha_composite(img, shade)

logo = Image.open(ROOT / "public" / "brand" / "logo-dark.png").convert("RGBA")
lw = 360
logo = logo.resize((lw, round(logo.height * lw / logo.width)), Image.LANCZOS)
img.alpha_composite(logo, (64, 70))

draw = ImageDraw.Draw(img)
big = font(64, 760)
small = font(30, 560)
y = 70 + logo.height + 46
draw.text((66, y), "Sprinklers, handled.", font=big, fill=(243, 246, 250))
draw.text((66, y + 74), "Every season.", font=font(64, 700), fill=(255, 103, 178))
draw.text((68, y + 176), "Fenton, MI  ·  (810) 423-9513", font=small, fill=(214, 222, 234))
img.convert("RGB").save(ROOT / "public" / "og-image.jpg", quality=86, optimize=True, progressive=True)
print("og-image.jpg written")
