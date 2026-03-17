from PIL import Image, ImageDraw
import os

# Design: dark navy background + white minimalist padlock
BG = (13, 27, 42)        # #0D1B2A — deep navy
FG = (255, 255, 255)     # white icon

SIZES = {
    'mipmap-mdpi':    48,
    'mipmap-hdpi':    72,
    'mipmap-xhdpi':   96,
    'mipmap-xxhdpi':  144,
    'mipmap-xxxhdpi': 192,
}

def create_icon(size):
    s = size
    img = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Rounded square background
    r = int(s * 0.22)
    draw.rounded_rectangle([(0, 0), (s - 1, s - 1)], radius=r, fill=BG)

    # --- Padlock proportions ---
    lw = max(2, int(s * 0.065))   # line/stroke width

    # Body: centered, lower half
    bw = int(s * 0.52)
    bh = int(s * 0.40)
    bx = (s - bw) // 2
    by = int(s * 0.50)
    br = int(s * 0.07)
    draw.rounded_rectangle([(bx, by), (bx + bw, by + bh)], radius=br, fill=FG)

    # Shackle: U-shape above body
    sh_cx   = s / 2
    sh_or   = s * 0.215   # outer radius
    sh_top  = int(s * 0.17)
    sh_bot  = by + lw     # shackle legs enter the body

    # Arc (top half of shackle)
    arc_box = [
        sh_cx - sh_or, sh_top,
        sh_cx + sh_or, sh_top + sh_or * 2
    ]
    draw.arc(arc_box, start=180, end=0, fill=FG, width=lw)

    # Left vertical leg
    lx = int(sh_cx - sh_or)
    draw.rectangle([(lx - lw // 2, sh_top + int(sh_or)), (lx + lw // 2, sh_bot)], fill=FG)

    # Right vertical leg
    rx = int(sh_cx + sh_or)
    draw.rectangle([(rx - lw // 2, sh_top + int(sh_or)), (rx + lw // 2, sh_bot)], fill=FG)

    # Keyhole in body center
    kh_cx = s // 2
    kh_cy = int(by + bh * 0.42)
    kh_r  = int(s * 0.055)
    draw.ellipse([(kh_cx - kh_r, kh_cy - kh_r), (kh_cx + kh_r, kh_cy + kh_r)], fill=BG)

    kh_rw = int(kh_r * 0.75)
    kh_rh = int(kh_r * 1.1)
    draw.rectangle(
        [(kh_cx - kh_rw, kh_cy), (kh_cx + kh_rw, kh_cy + kh_rh)],
        fill=BG
    )

    return img

RES_DIR = r"e:\github\secugram_kh\secugram-rn\android\app\src\main\res"

for folder, size in SIZES.items():
    icon = create_icon(size)
    # Convert RGBA → RGB with BG fill for PNG with no transparency needed,
    # but keep RGBA so Android can use transparency on adaptive icons
    out_dir = os.path.join(RES_DIR, folder)
    for fname in ['ic_launcher.png', 'ic_launcher_round.png']:
        icon.save(os.path.join(out_dir, fname))
    print(f"  {folder}: {size}x{size} OK")

print("Done.")
