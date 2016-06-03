from .initial_data import request_user, chatid, user_to_delete

request = {
    "endpoint": "/api/conversation/{}/participants".format(chatid),
    "method": "delete",
    "user": request_user,
    "body": {
        "participants": [user_to_delete.id]
    }
}
