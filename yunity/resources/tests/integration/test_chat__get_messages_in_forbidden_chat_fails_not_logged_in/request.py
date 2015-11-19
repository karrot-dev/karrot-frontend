from .initial_data import chatid

request = {
    "endpoint": "/api/chats/{}/messages".format(chatid),
    "method": "get",
}
