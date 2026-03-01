import requests

BASE_URL = "http://localhost:8000"

def test_upload():
    # Create a dummy image file
    with open("test_image.txt", "w") as f:
        f.write("dummy image content")
        
    url = f"{BASE_URL}/upload/"
    files = {'file': ('test_image.txt', open('test_image.txt', 'rb'))}
    
    try:
        print(f"POST {url}")
        r = requests.post(url, files=files)
        print(f"Status: {r.status_code}")
        if r.status_code == 200:
            print("Response:", r.json())
        else:
            print("Error:", r.text)
    except Exception as e:
        print("Upload Failed:", e)

if __name__ == "__main__":
    test_upload()
