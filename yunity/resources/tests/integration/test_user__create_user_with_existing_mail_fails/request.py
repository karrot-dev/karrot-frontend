from .initial_data import users

request = {
    "endpoint": "/api/user",
    "method": "post",
    "body": {
        "email": users[0].email,
        "password": "testpwd",
        "display_name": "I try to register an existing mail",
        "first_name": "doesn't",
        "last_name": "matter"
    }
}
