from .initial_data import user

request = {
    "endpoint": "/api/auth/login",
    "method": "post",
    "body": {
        "email": user.email,
        "password": 'wrong password',
    },
}
