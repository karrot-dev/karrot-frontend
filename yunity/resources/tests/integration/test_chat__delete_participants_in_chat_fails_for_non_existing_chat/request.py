from .initial_data import request_user, user_to_delete

request = {
    "endpoint": "/api/conversation/123456/participants",
    "method": "delete",
    "user": request_user,
    "body": {
        "participants": [user_to_delete.id]
    }
}
