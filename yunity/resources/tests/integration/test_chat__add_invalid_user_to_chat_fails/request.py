from .initial_data import request_user, chatid

request = {
    "endpoint": "/api/chats/{}/participants".format(chatid),
    "method": "post",
    "user": request_user,
    "body": {
        "users": [666666, 22]
    }
}
