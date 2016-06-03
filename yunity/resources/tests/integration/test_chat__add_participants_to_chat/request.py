from .initial_data import request_user, chat, add_users

request = {
    "endpoint": "/api/conversation/{}/participants".format(chat.id),
    "method": "post",
    "user": request_user,
    "body": {
        "participants": [_.id for _ in add_users],
    }
}
