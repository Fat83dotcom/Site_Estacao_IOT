from PIL import Image
from django.conf import settings
from pathlib import Path


def resizeImage(image, newWidth, optmize=True, quality=60):
    imagePath = Path(settings.MEDIA_ROOT / image.name).resolve()
    imagePillow = Image.open(imagePath)
    originalWidth, originalHeight = imagePillow.size

    if originalWidth <= newWidth:
        imagePillow.close()
        return imagePillow

    newHeight = round(newWidth * originalHeight / originalWidth)

    newImage = imagePillow.resize(
        (newWidth, newHeight), Image.LANCZOS
    )
    newImage.save(
        imagePath,
        optimize=optmize,
        quality=quality
    )
    return newImage
