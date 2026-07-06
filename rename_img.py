import os

# Folder path
folder_path = r"Images\Fire"

# Supported extensions
image_extensions = ('.jpg', '.jpeg', '.png', '.bmp', '.gif', '.webp')

# Check folder exists
if not os.path.exists(folder_path):
    print(f"Folder not found: {folder_path}")
    exit()

# Get images
image_files = [
    f for f in os.listdir(folder_path)
    if f.lower().endswith(image_extensions)
]

image_files.sort()

# Step 1: Rename to temporary names
temp_files = []

for i, filename in enumerate(image_files):
    old_path = os.path.join(folder_path, filename)

    extension = os.path.splitext(filename)[1].lower()
    temp_name = f"temp_{i}{extension}"
    temp_path = os.path.join(folder_path, temp_name)

    os.rename(old_path, temp_path)
    temp_files.append(temp_name)

# Step 2: Rename temp files to final names
for index, temp_name in enumerate(temp_files, start=1):
    extension = os.path.splitext(temp_name)[1].lower()

    old_path = os.path.join(folder_path, temp_name)
    new_path = os.path.join(folder_path, f"{index}{extension}")

    os.rename(old_path, new_path)
    print(f"Renamed -> {index}{extension}")

print("Done!")