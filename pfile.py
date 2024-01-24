import hashlib
import json

def calculate_json_hash(file_path):
    # Open the JSON file
    with open(file_path, "r") as file:
        # Load JSON content
        json_content = json.load(file)

        # Convert the JSON content to a string
        json_string = json.dumps(json_content, sort_keys=True)

        # Calculate the MD5 hash
        hash_object = hashlib.md5()
        hash_object.update(json_string.encode("utf-8"))
        hash_code = hash_object.hexdigest()

    return hash_code

# Example usage:
json_file_path = "assets\AssetManifest.json"
hash_code = calculate_json_hash(json_file_path)
print("Hash code:", hash_code)
# from PIL import Image

# # Specify the file path
# image_path = "assets/assets/imgs/D1.jpeg"

# # Open the image file
# img = Image.open(image_path)

# # Get the size of the image
# width, height = img.size

# print(f"Width: {width}, Height: {height}")
