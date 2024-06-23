import json
import os
import tomllib

from jsonschema import validate

with open("../schema/prebuilt.json") as f:
    schema = json.load(f)

ret = 0

for filename in os.listdir("."):
    if not filename.endswith(".toml"):
        continue

    with open(filename, "rb") as f:
        instance = tomllib.load(f)

        try:
            validate(instance, schema)
        except Exception as e:
            print(f"Error validating {filename}: {e}")
            ret = 1  # Set return code to 1 if any errors are found

exit(ret)
