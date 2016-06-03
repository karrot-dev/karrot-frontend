from .initial_data import chat_responder, chat

request = {
    "endpoint": "/api/conversation/{}/messages".format(chat.id),
    "method": "post",
    "user": chat_responder,
    "body": {
        "content": "Hello Matthias!",
    }
}
