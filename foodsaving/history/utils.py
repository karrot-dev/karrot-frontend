def get_changed_data(instance, validated_data):
    # detect which data actually changed
    changed_data = {}
    for key, value in validated_data.items():
        if value != getattr(instance, key):
            # validated_data has python objects which sometimes can't be serialized to JSON
            # Workaround: call str
            changed_data[key] = str(value)
    return changed_data


def without_keys(d, keys):
    """
    Return a new dict with a list of keys stripped from it

    :param d: input dict
    :param keys: list of keys to strip
    :return: new dict
    """
    return {x: d[x] for x in d if x not in keys}
