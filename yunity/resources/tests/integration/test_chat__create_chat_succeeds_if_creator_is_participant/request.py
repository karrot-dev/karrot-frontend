from .initial_data import users

request = {
    "endpoint": "/api/chats",
    "method": "post",
    "user": users[0],
    "body": {
        "participants": [users[0].id, users[1].id],
        "message": {
            "content": "some message to get the conversation started",
        }
    }
}
