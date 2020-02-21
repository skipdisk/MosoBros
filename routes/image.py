from PIL import Image
import sys

# def changeBrightness():
#     img = Image.open("/Users/thien/Desktop/download.jpg") 
#     pixels = img.load() # create the pixel map

#     for i in range(img.size[0]):    # for every col:
#             for j in range(img.size[1]):
#                 (x, y, z) = pixels[i,j]    # For every row
#                 pixels[i,j] = (x+100, y+100, z+100) # set the colour accordingly

#     img.show()
#     img.save("/Users/thien/Desktop/MosBros/MosBros/services/modified/test.jpg")
#     return img

def changeContrast(imagePath):
    img = Image.open(f'{imagePath}')
    pixels = img.load() # create the pixel map


    imin = 255
    imax = 1

    # Find minimum and maximum luminosity
    for x in range(img.size[0]):
        for y in range(img.size[1]):
            r, g, b = pixels[x, y]
            i = (r + g + b) / 3
            imin = min(imin, i)
            imax = max(imax, i)

    # Generate image
    for x in range(img.size[0]):
        for y in range(img.size[1]):
            r, g, b = pixels[x, y]
            # Current luminosity
            i = (r + g + b) / 3
            # New luminosity
            ip = 255 * (i - imin) / (imax - imin)
            r = int(r * ip / (i or 1))
            g = int(g * ip / (i or 1))
            b = int(b * ip / (i or 1))
            pixels[x,y] = (r, g, b)


    img.show()
    img.save(f'{imagePath}')

    return img

if __name__ =='__main__' : 
    # var = changeBrightness()
    var = changeContrast(sys.argv[1])
    # print(var)