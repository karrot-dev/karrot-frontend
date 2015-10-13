from .initial_data import request_user, add_users

request = {
    "endpoint": "/api/chats/12345/participants",
    "method": "post",
    "user": request_user,
    "body": {
        "users": [_.id for _ in add_users],
    }
}
