from .initial_data import chat_responder, chat

request = {
    "endpoint": "/api/chats/{}/messages".format(chat.id),
    "method": "post",
    "user": chat_responder,
    "body": {
        "content": "Hello Matthias!",
        "type": "TEXT"
    }
}
