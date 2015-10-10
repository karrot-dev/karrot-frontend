from .initial_data import request_user

request = {
    "endpoint": "/api/user/{}".format(request_user),
    "method": "put",
    "user": request_user,
    "body": {
        "display_name": "My brand new name",
    }
}
