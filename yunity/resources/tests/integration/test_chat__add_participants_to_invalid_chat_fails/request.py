from .initial_data import request_user, add_users

request = {
    "endpoint": "/api/chats/666666/participants",
    "method": "post",
    "user": request_user,
    "body": {
        "users": [add_users[0].id]
    }
}
