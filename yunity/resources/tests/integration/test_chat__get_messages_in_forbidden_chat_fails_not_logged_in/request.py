from .initial_data import chatid

request = {
    "endpoint": "/api/conversation/{}/messages".format(chatid),
    "method": "get",
}
