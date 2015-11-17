from .initial_data import user

request = {
    "endpoint": "/api/users/{},12345".format(user.id),
    "method": "get"
}
