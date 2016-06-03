from .initial_data import request_user, chat

request = {
    "endpoint": "/api/conversation/{}/participants".format(chat.id),
    "method": "post",
    "user": request_user,
    "body": {
        "participants": [666666, 22]
    }
}
