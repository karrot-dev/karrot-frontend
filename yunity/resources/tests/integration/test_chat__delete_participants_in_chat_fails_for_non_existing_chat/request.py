from .initial_data import request_user, user_to_delete

request = {
    "endpoint": "/api/chats/123456/participants/{}".format(user_to_delete.id),
    "method": "delete",
    "user": request_user
}
