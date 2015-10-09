from .initial_data import request_user, chatid

request = {
    "endpoint": "/api/chats/{}".format(chatid),
    "method": "put",
    "user": request_user,
    "body": {
        "name": "New funny name"
    }
}
