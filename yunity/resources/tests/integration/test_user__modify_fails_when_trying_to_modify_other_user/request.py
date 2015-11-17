from .initial_data import users

request = {
    "endpoint": "/api/users/{}".format(users[1].id),
    "method": "put",
    "user": users[0],
    "body": {
        "display_name": "My brand new name",
    }
}
