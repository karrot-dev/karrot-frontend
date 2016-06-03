from .initial_data import request_user, chatid

request = {
    "endpoint": "/api/conversation/{}".format(chatid),
    "method": "put",
    "user": request_user,
    "body": {
        "topic": "New funny name"
    }
}
