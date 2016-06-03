from .initial_data import request_user

request = {
    "endpoint": "/api/conversation/12345",
    "method": "put",
    "user": request_user,
    "body": {
        "topic": "New funny name"
    }
}
