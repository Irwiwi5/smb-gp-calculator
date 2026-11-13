from PIL import Image, ImageDraw, ImageFont

NAVY = (31, 58, 95, 255)
NAVY_DARK = (22, 42, 71, 255)
GOLD = (184, 138, 46, 255)
GOLD_LIGHT = (231, 200, 119, 255)
WHITE = (255, 255, 255, 255)

FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

def rounded_square(size, radius_pct=0.22, bg=NAVY, bleed=False):
    img = Image.new("RGBA", (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    radius = 0 if bleed else int(size * radius_pct)
    d.rounded_rectangle([0,0,size-1,size-1], radius=radius, fill=bg)
    return img, d

def draw_monogram(size, safe_scale=0.62, bleed=False):
    img, d = rounded_square(size, bleed=bleed)
    # subtle gradient-ish accent bar
    bar_h = int(size*0.085)
    d.rectangle([0, size-bar_h, size, size], fill=GOLD)
    # $ monogram
    font_size = int(size*safe_scale)
    font = ImageFont.truetype(FONT_BOLD, font_size)
    text = "$"
    bbox = d.textbbox((0,0), text, font=font)
    tw, th = bbox[2]-bbox[0], bbox[3]-bbox[1]
    pos = ((size-tw)/2 - bbox[0], (size-th)/2 - bbox[1] - size*0.03)
    d.text(pos, text, font=font, fill=GOLD_LIGHT)
    # thin ring
    ring_pad = int(size*0.045)
    d.rounded_rectangle([ring_pad,ring_pad,size-1-ring_pad,size-1-ring_pad], radius=int(size*0.18), outline=GOLD, width=max(2,int(size*0.012)))
    return img

for size, name, bleed, scale in [
    (192, "icon-192.png", False, 0.56),
    (512, "icon-512.png", False, 0.56),
    (512, "icon-maskable-512.png", True, 0.40),
    (180, "apple-touch-icon.png", False, 0.56),
    (32, "favicon-32.png", False, 0.6),
]:
    img = draw_monogram(size, safe_scale=scale, bleed=bleed)
    img.save(f"/home/claude/pwa/icons/{name}")
    print("wrote", name)
