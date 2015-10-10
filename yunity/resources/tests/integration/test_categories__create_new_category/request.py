from .initial_data import parent_category

request = {
    "endpoint": "/api/categories/",
    "method": "post",
    "body": {
        "name": "my new category",
        "parent": parent_category.id,
    }
}
