from .initial_data import request_user

request = {
    "endpoint": "/api/chats/12345/messages",
    "method": "post",
    "user": request_user,
    "body": {
        "content": "Hello Matthias!",
        "type": "TEXT"
    }
}
