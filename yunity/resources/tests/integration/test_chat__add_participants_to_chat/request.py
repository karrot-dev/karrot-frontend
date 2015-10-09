from .initial_data import request_user, chatid, add_users

request = {
    "endpoint": "/api/chats/{}/participants".format(chatid),
    "method": "post",
    "user": request_user,
    "body": {
        "users": [add_users[0].id, add_users[1].id]
    }
}
