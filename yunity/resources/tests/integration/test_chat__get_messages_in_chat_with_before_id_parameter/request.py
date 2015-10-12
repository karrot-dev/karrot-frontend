from .initial_data import request_user, chatid, the_message

request = {
    "endpoint": "/api/chats/{}/messages?before_id={}".format(chatid, the_message.id),
    "method": "get",
    "user": request_user
}
