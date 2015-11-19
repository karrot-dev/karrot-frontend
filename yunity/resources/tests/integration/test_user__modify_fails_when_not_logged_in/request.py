from .initial_data import users

request = {
    "endpoint": "/api/users/{}".format(users[0].id),
    "method": "put",
    "body": {
        "display_name": "My brand new name",
    }
}
