from .initial_data import request_user, chatid

request = {
    "endpoint": "/api/chats/{}/messages".format(chatid),
    "method": "get",
    "user": request_user
}
