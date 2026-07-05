import re
import base64
from PIL import Image, ImageChops
from io import BytesIO

with open(r'd:\Others\Site\Office_Name_Plate.docx.md', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'data:image/png;base64,([a-zA-Z0-9+/=]+)', content)
if match:
    b64_data = match.group(1)
    img = Image.open(BytesIO(base64.b64decode(b64_data))).convert("RGBA")
    
    # Try cropping based on white background
    bg = Image.new("RGBA", img.size, (255, 255, 255, 255))
    diff = ImageChops.difference(img, bg)
    bbox = diff.getbbox()
    
    # If no diff from white, maybe it's transparent background
    if not bbox:
        bg = Image.new("RGBA", img.size, (0, 0, 0, 0))
        diff = ImageChops.difference(img, bg)
        bbox = diff.getbbox()
        
    if bbox:
        print(f"Original size: {img.size}, Bounding box: {bbox}")
        img_cropped = img.crop(bbox)
        img_cropped.save(r'd:\Others\Site\images\logo.png')
        
        # getcolors
        colors = img_cropped.getcolors(maxcolors=1000000)
        colors.sort(reverse=True, key=lambda x: x[0])
        print("Top colors:")
        for count, color in colors[:20]:
            print(f"{count}: {color}")
    else:
        print("Still no bounding box. Image might be solid color.")
        img.save(r'd:\Others\Site\images\logo.png')
else:
    print("Base64 string not found.")
