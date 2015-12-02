from .initial_data import chat, add_users

request = {
    "endpoint": "/api/chats/{}/participants".format(chat.id),
    "method": "post",
    "body": {
        "users": [_.id for _ in add_users],
    }
}
