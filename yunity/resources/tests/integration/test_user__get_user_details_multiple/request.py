from .initial_data import users

request = {
    "endpoint": "/api/user/{},{}".format(users[0].id, users[1].id),
    "method": "get"
}
