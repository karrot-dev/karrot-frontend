from .initial_data import request_user

request = {
    "endpoint": "/api/groups",
    "method": "post",
    "body": {
        "name": "test group name",
        "description": "test group description",
    },
    "user": request_user,
}
