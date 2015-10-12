from .initial_data import users, chat, initial_message
from .request import request

response = {
    "http_status": 200,
    "response": {
           "participants": [users[0].id, users[1].id, users[2].id],
           "name": request['body']['name'],
           "message": {
               "content": initial_message.content,
               "sender": initial_message.sent_by.id,
               "created_at": initial_message.created_at.isoformat(),
               "id": initial_message.id,
               "type": initial_message.type,
           },
           "id": chat.id,
    }
}
