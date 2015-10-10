from .initial_data import user

request = {
    "endpoint": "/api/user/{}".format(user.id),
    "method": "put",
    "user": user,
    "body": {
        "display_name": "My brand new name",
    }
}
