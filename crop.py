from PIL import Image

img = Image.open(r'd:\Others\Site\images\logo_original.png')
pixels = img.load()
width, height = img.size
min_x, min_y = width, height
max_x, max_y = 0, 0

for y in range(height):
    for x in range(width):
        p = pixels[x, y]
        # Check if not pure white and not fully transparent
        if not (p[0] > 250 and p[1] > 250 and p[2] > 250) and p[3] > 0:
            if x < min_x: min_x = x
            if x > max_x: max_x = x
            if y < min_y: min_y = y
            if y > max_y: max_y = y

if max_x >= min_x and max_y >= min_y:
    bbox = (min_x, min_y, max_x + 1, max_y + 1)
    print(f"Calculated tight bbox: {bbox}")
    img_cropped = img.crop(bbox)
    
    # Make white background transparent
    img_cropped = img_cropped.convert("RGBA")
    datas = img_cropped.getdata()
    newData = []
    for item in datas:
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
    img_cropped.putdata(newData)
    
    img_cropped.save(r'd:\Others\Site\images\logo.png')
    print("Saved logo.png with tight crop and transparent bg.")
else:
    print("Could not find any non-white pixels.")
