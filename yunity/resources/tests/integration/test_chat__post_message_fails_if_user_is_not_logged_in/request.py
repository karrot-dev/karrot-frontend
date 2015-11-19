from .initial_data import chat

request = {
    "endpoint": "/api/chats/{}/messages".format(chat.id),
    "method": "post",
    "body": {
        "content": "Hello Matthias!",
    }
}
