from .initial_data import request_user, chatid

request = {
    "endpoint": "/api/conversation/{}/participants".format(chatid),
    "method": "delete",
    "user": request_user,
    "body": {
        "participants": [12345]
    }
}
