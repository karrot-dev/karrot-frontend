from .initial_data import request_user, chatid

request = {
    "endpoint": "/api/chats/{}/participants/12345".format(chatid),
    "method": "delete",
    "user": request_user
}
