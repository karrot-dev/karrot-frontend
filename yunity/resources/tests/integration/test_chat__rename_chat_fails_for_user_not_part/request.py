from .initial_data import request_user, chat_id

request = {
    "endpoint": "/api/conversation/{}".format(chat_id),
    "method": "put",
    "user": request_user,
    "body": {
        "topic": "New funny name"
    }
}
