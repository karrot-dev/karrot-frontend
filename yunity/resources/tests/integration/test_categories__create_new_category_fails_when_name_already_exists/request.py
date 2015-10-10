from .initial_data import parent_category, existing_category

request = {
    "endpoint": "/api/categories/",
    "method": "post",
    "body": {
        "name": existing_category.name,
        "parent": parent_category.id,
    }
}
