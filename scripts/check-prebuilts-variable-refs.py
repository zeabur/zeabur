import os
import re
import tomllib
from typing import Any, Iterator


def get_variables_of_item(base: set[str], marketplace_item: dict[str, Any]) -> set[str]:
    vset = base.copy()

    for key in marketplace_item.get("env", {}).keys():
        vset.add(key)

    for port in marketplace_item.get("ports", []):
        id = str(port["id"]).upper()

        vset.add(f"{id}_PORT_FORWARDED_PORT")
        vset.add(f"{id}_PORT")
        vset.add(f"ZEABUR_{id}_URL")
        vset.add(f"ZEABUR_{id}_DOMAIN")

    return vset


def get_special_variables_base() -> set[str]:
    common_special_variables_key = {
        "PORT_FORWARDED_HOSTNAME",
        "CONTAINER_HOSTNAME",
        "ZEABUR_SERVICE_ID",
        "ZEABUR_PROJECT_ID",
        "ZEABUR_ENVIRONMENT_ID",
        "ZEABUR_USER_ID",
        "PASSWORD",
    }

    # exposed variables
    for item in get_marketplace_items():
        for key, properties in item.get("env", {}).items():
            if properties.get("expose", False):
                common_special_variables_key.add(key)

    return common_special_variables_key.union(set(get_all_marketplace_items_id()))


def get_all_marketplace_items_id() -> Iterator[str]:
    return (filename[:-5] for filename in os.listdir(".") if filename.endswith(".toml"))


def get_marketplace_items() -> Iterator[dict[str, Any]]:
    for id in get_all_marketplace_items_id():
        with open(f"{id}.toml", "rb") as f:
            yield tomllib.load(f)


def find_all_variable_refs(toml: dict[str, Any]) -> set[str]:
    # make toml as string
    toml_str = str(toml)

    # find all ${REF} in toml
    ref_regex = re.compile(r"\$\{([A-Za-z0-9_]+)}")
    return set(ref_regex.findall(toml_str))


def lint_variable_refs() -> None:
    base_sv = get_special_variables_base()
    undefined_variables_set_map: dict[str, set[str]] = {}

    for marketplace_item in get_marketplace_items():
        defined_variables = get_variables_of_item(base_sv, marketplace_item)
        referenced_variables = find_all_variable_refs(marketplace_item)

        diff = referenced_variables - defined_variables
        for item in diff:
            print(f"Error: {marketplace_item['id']}: {item} is undefined.")

        if len(diff) > 0:
            undefined_variables_set_map[marketplace_item["id"]] = diff

    if len(undefined_variables_set_map) > 0:
        raise Exception(f"Undefined variables found: {undefined_variables_set_map}")


if __name__ == "__main__":
    lint_variable_refs()
