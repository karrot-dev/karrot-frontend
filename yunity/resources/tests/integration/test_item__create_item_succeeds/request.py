from .initial_data import request_user

request = {
    "endpoint": "/api/items",
    "method": "post",
    "body": {
        "description": "my lovely test item"
    },
    "user": request_user,
}
