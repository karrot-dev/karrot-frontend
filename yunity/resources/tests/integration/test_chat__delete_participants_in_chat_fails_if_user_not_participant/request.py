from .initial_data import request_user, chatid, user_to_delete

request = {
    "endpoint": "/api/chats/{}/participants/{}".format(chatid, user_to_delete),
    "method": "delete",
    "user": request_user
}
