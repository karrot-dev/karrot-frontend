from .initial_data import request_user

request = {
    "endpoint": "/api/chats/12345",
    "method": "put",
    "user": request_user,
    "body": {
        "name": "New funny name"
    }
}
