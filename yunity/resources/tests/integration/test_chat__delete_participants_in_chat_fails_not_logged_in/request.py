from .initial_data import user_to_delete, chat

request = {
    "endpoint": "/api/chats/{}/participants/{}".format(chat.id, user_to_delete.id),
    "method": "delete",
}
