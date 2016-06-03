from .initial_data import request_user, add_users

request = {
    "endpoint": "/api/conversation/12345/participants",
    "method": "post",
    "user": request_user,
    "body": {
        "participants": [_.id for _ in add_users],
    }
}
