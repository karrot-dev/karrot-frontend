from .initial_data import request_user, chat

request = {
    "endpoint": "/api/chats/{}/participants".format(chat.id),
    "method": "post",
    "user": request_user,
    "body": {
        "users": [666666, 22]
    }
}
