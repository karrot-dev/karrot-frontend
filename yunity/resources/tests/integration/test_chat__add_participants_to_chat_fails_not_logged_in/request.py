from .initial_data import chat, add_users

request = {
    "endpoint": "/api/conversation/{}/participants".format(chat.id),
    "method": "post",
    "body": {
        "participants": [_.id for _ in add_users],
    }
}
