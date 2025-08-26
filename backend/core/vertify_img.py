import pytesseract
from PIL import Image
import cv2

def extract_text(img_path, lang="eng"):
    """Extract text from an image using pytesseract."""
    # Open image
    img = Image.open(img_path)
    # OCR
    text = pytesseract.image_to_string(img, lang=lang)
    return text

# Example usage
if __name__ == "_main_":
    img_path1 = '/content/devimgjpn.jpg'
    result = extract_text(img_path1)
    print(result)