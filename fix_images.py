from PIL import Image, ImageEnhance, ImageFilter, ImageDraw
from pathlib import Path

base = Path(r'd:\iniversidade crescente\Iniversidade crescente\image')

# 1) Process crestimag.jpg
img = Image.open(base / 'crestimag.jpg').convert('RGB')
# Crop text-heavy top/bottom bands while keeping the people and structure
crop = img.crop((30, 90, img.width - 30, img.height - 70))
processed = crop.resize((1600, 960), Image.Resampling.LANCZOS)
processed = ImageEnhance.Color(processed).enhance(1.1)
processed = ImageEnhance.Contrast(processed).enhance(1.25)
processed = ImageEnhance.Sharpness(processed).enhance(1.9)
processed = processed.filter(ImageFilter.UnsharpMask(radius=1.5, percent=180, threshold=3))
canvas = processed.copy()
draw = ImageDraw.Draw(canvas)
# Fill top banner and lower info strip with nearby background tones to hide text overlays
bg_top = canvas.getpixel((450, 130))
bg_bottom = canvas.getpixel((650, 760))
draw.rectangle((0, 0, canvas.width, 170), fill=bg_top)
draw.rectangle((0, canvas.height - 220, canvas.width, canvas.height), fill=bg_bottom)
canvas = canvas.filter(ImageFilter.GaussianBlur(radius=0.25))
canvas.save(base / 'crestimag.jpg', quality=95)

# 2) Process imagcres.webp
img2 = Image.open(base / 'imagcres.webp').convert('RGB')
processed2 = img2.resize((1800, 1050), Image.Resampling.LANCZOS)
processed2 = ImageEnhance.Color(processed2).enhance(1.08)
processed2 = ImageEnhance.Contrast(processed2).enhance(1.18)
processed2 = ImageEnhance.Sharpness(processed2).enhance(1.7)
processed2 = processed2.filter(ImageFilter.UnsharpMask(radius=1.8, percent=200, threshold=2))
canvas2 = processed2.copy()
draw2 = ImageDraw.Draw(canvas2)
# Hide the lower-center signboard wall text by blending with nearby facade color
sign_color = canvas2.getpixel((820, 820))
draw2.rectangle((430, 760, 1360, 915), fill=sign_color)
canvas2 = canvas2.filter(ImageFilter.GaussianBlur(radius=0.4))
canvas2.save(base / 'imagcres.webp', quality=95)

print('OK: gallery images cleaned and enhanced')
