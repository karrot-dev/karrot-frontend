def get_changed_data(instance, validated_data):
    # detect which data actually changed
    changed_data = {}
    for key, value in validated_data.items():
        if value != getattr(instance, key):
            # validated_data has python objects which sometimes can't be serialized to JSON
            # Workaround: call str
            changed_data[key] = str(value)
    return changed_data
