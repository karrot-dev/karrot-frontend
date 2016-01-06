from .initial_data import request_user

request = {
    "endpoint": "/api/items",
    "method": "post",
    "body": {
        "description": "my lovely test item",
        "latitude": -666,
        "longitude": 666
    },
    "user": request_user,
}
