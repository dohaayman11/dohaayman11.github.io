import hashlib

def calculate_hash(file_path):
    # Create a hash object (MD5 used for simplicity, choose a stronger hash function for security)
    hash_object = hashlib.md5()

    # Open the file and read it in chunks to efficiently handle large files
    with open(file_path, 'rb') as f:
        for chunk in iter(lambda: f.read(4096), b''):
            hash_object.update(chunk)

    # Return the hexadecimal representation of the hash
    return hash_object.hexdigest()

# Example usage:
file_path = 'assets/assets/imgs/jw.png'
print("sddddddddddd")
hash_value = calculate_hash(file_path)
print(f'The hash value of {file_path} is: {hash_value}')



