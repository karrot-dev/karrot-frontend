from .initial_data import request_user, chat_id

request = {
    "endpoint": "/api/chats/{}".format(chat_id),
    "method": "put",
    "user": request_user,
    "body": {
        "name": "New funny name"
    }
}
