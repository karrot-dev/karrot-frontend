from .initial_data import request_user, chatid

request = {
    "endpoint": "/api/chats/{}/messages?take=1".format(chatid),
    "method": "get",
    "user": request_user
}
