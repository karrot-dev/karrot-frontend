from .initial_data import request_user, chatid

request = {
    "endpoint": "/api/chats/{}/messages".format(chatid),
    "method": "post",
    "user": request_user,
    "body": {
        "content": "Hello Matthias!",
        "type": "TEXT"
    }
}
