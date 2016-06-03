from .initial_data import request_user, chatid

request = {
    "endpoint": "/api/conversation/{}/messages".format(chatid),
    "method": "get",
    "user": request_user
}
