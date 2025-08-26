import sys
import os

# Add the core directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'core'))

# Import the OCR verification function
from verify_image import verify_female_in_aadhar

def test_ocr():
    # This is a test function - in real usage, you would pass a base64 image
    print("OCR verification module loaded successfully")
    print("The verify_female_in_aadhar function is ready to use")

if __name__ == "__main__":
    test_ocr()