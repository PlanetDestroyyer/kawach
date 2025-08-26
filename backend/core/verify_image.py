import pytesseract
from PIL import Image
import cv2
import base64
import io
import re

def extract_text_from_base64(base64_image):
    """Extract text from a base64 encoded image using pytesseract."""
    try:
        # Decode base64 image
        image_data = base64.b64decode(base64_image.split(',')[1] if ',' in base64_image else base64_image)
        image = Image.open(io.BytesIO(image_data))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # OCR
        text = pytesseract.image_to_string(image, lang='eng')
        return text
    except Exception as e:
        print(f"Error extracting text: {str(e)}")
        return ""

def verify_female_in_aadhar(base64_image):
    """Verify that the word 'female' is present in the extracted text."""
    try:
        # Extract text from image
        extracted_text = extract_text_from_base64(base64_image)
        
        # Convert to lowercase for case-insensitive search
        text_lower = extracted_text.lower()
        
        # Check if "female" is present in the text
        if "female" in text_lower:
            return True, extracted_text
        else:
            return False, extracted_text
    except Exception as e:
        print(f"Error during verification: {str(e)}")
        return False, str(e)

# Example usage
if __name__ == "__main__":
    # This section is for testing purposes
    pass
    