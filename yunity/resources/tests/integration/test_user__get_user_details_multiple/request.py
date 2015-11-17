from .initial_data import users

request = {
    "endpoint": "/api/users/{},{}".format(users[0].id, users[1].id),
    "method": "get"
}
