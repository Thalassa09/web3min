#!/usr/bin/env python3
"""Generate ikon brand web3min (favicon + PWA) dari maskot resmi public/blobi.png.

Kenapa ada: Google menampilkan globe abu-abu untuk web3min.com karena
`/favicon.ico` 404 dan ikon yang ada berlatar transparan. Ikon yang baik:
kotak OPAQUE (bukan transparan), maskot mengisi ~80% kanvas, dan tetap
terbaca di 16px.

Jalankan: python3 scripts/generate-brand-icons.py
"""
from PIL import Image, ImageDraw

SRC = "public/blobi.png"
CREAM = (255, 246, 238, 255)   # --color-cream #FFF6EE
PINK = (255, 212, 222, 255)    # favicon.svg latar #FFD4DE
OUTLINE = (59, 34, 24, 255)    # choco-900 #3B2218


def blobi_content() -> Image.Image:
    im = Image.open(SRC).convert("RGBA")
    return im.crop(im.getchannel("A").getbbox())


def make_icon(size: int, bg=CREAM, pad_ratio=0.10, radius_ratio=0.22,
              outline_px: int = 0) -> Image.Image:
    """Ikon kotak opaque: latar membulat + maskot di tengah.

    pad_ratio sengaja kecil (10%) supaya maskot TERBACA di 16px — ikon yang
    isinya cuma 50% kanvas akan jadi bintik tak dikenal di tab browser.
    """
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(canvas)
    r = int(size * radius_ratio)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=r, fill=bg,
                        outline=OUTLINE if outline_px else None,
                        width=outline_px)

    content = blobi_content()
    inner = size * (1 - 2 * pad_ratio)
    scale = min(inner / content.width, inner / content.height)
    w, h = max(1, round(content.width * scale)), max(1, round(content.height * scale))
    sprite = content.resize((w, h), Image.NEAREST)
    canvas.alpha_composite(sprite, ((size - w) // 2, (size - h) // 2))
    return canvas


def make_favicon_ico() -> None:
    """favicon.ico multi-ukuran — jalur PERTAMA yang dicek Google/browser.

    Dulu 404, dan itu sebab utama Google menampilkan globe generik.
    """
    sizes = [16, 32, 48, 64]
    icons = [make_icon(s, radius_ratio=0.18) for s in sizes]
    icons[-1].save("public/favicon.ico", format="ICO",
                   sizes=[(s, s) for s in sizes], append_images=icons[:-1])


if __name__ == "__main__":
    # 1. favicon.ico — jalur fallback klasik (dulu 404).
    make_favicon_ico()

    # 2. PWA + tab browser: OPAQUE, tanpa transparan (Google & iOS suka kotak).
    make_icon(192, radius_ratio=0.22).convert("RGB").save("public/icon-192.png")
    make_icon(512, radius_ratio=0.22).convert("RGB").save("public/icon-512.png")

    # 3. apple-touch-icon: iOS memakai sudut penuh sendiri, jadi TANPA radius
    #    membulat (kalau tidak, sudut terlihat terpotong dobel).
    #    Ini juga menambal icon-180.png yang isinya ikon "magic edit" sisa template.
    apple = make_icon(180, radius_ratio=0.0)
    apple.convert("RGB").save("public/icon-180.png")

    # 4. Versi maskable: safe zone 40% (mask Android memotong sampai lingkaran),
    #    jadi maskot dibuat lebih kecil & latar penuh warna.
    make_icon(192, bg=PINK, pad_ratio=0.22, radius_ratio=0.0).convert("RGB").save(
        "public/icon-maskable-192.png")
    make_icon(512, bg=PINK, pad_ratio=0.22, radius_ratio=0.0).convert("RGB").save(
        "public/icon-maskable-512.png")

    print("Selesai: favicon.ico, icon-192/512/180, icon-maskable-192/512")
