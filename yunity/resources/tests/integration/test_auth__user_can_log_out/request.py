from .initial_data import request_user

request = {
    "endpoint": "/api/auth/logout",
    "method": "post",
    "user": request_user,
    "body": {},
}
