from __future__ import annotations

from pathlib import Path

from PIL import Image


def crop_to_alpha(img: Image.Image, margin_ratio: float = 0.03) -> Image.Image:
    rgba = img.convert("RGBA")
    alpha = rgba.split()[-1]
    bbox = alpha.getbbox()
    if not bbox:
        return rgba

    l, t, r, b = bbox
    margin = int(max(rgba.size) * margin_ratio)
    l = max(0, l - margin)
    t = max(0, t - margin)
    r = min(rgba.size[0], r + margin)
    b = min(rgba.size[1], b + margin)
    return rgba.crop((l, t, r, b))


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    src = root / "static" / "assets" / "images" / "lb_book.webp"
    if not src.exists():
        raise SystemExit(f"Source not found: {src}")

    img = Image.open(src)
    cropped = crop_to_alpha(img, margin_ratio=0.03)

    out_png = root / "static" / "assets" / "images" / "lb_book_favicon.png"
    out_png.parent.mkdir(parents=True, exist_ok=True)
    cropped.save(out_png)

    print(f"src={src}")
    print(f"src_size={img.size}")
    print(f"out={out_png}")
    print(f"out_size={cropped.size}")


if __name__ == "__main__":
    main()

