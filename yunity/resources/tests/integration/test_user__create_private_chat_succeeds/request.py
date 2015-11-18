from .initial_data import users

request = {
    "endpoint": "/api/users/{}/chat".format(users[0].id),
    "user": users[1],
    "method": "post"
}
