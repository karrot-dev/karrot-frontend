from .initial_data import user

request = {
    "endpoint": "/api/user/{},12345".format(user.id),
    "method": "get"
}
