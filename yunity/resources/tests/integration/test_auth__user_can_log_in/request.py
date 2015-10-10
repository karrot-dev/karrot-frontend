from .initial_data import user

request = {
    "endpoint": "/api/auth/login",
    "method": "post",
    "body": {
        "user": {
            "email": user.email,
            "password": user.password,
        },
    },
}
