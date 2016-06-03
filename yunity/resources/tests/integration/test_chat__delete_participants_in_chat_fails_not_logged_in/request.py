from .initial_data import user_to_delete, chat

request = {
    "endpoint": "/api/conversation/{}/participants".format(chat.id),
    "method": "delete",
    "body": {
        "participants": [user_to_delete.id]
    }
}
