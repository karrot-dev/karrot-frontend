from .initial_data import chat_responder
from .request import request

response = {
    "http_status": 201,
    "response": {
        "content": request["body"]["content"],
        "sender": chat_responder.id,
        "created_at": "DatetimeAroundNow",
        "id": "AnyInt",
        "type": request["body"]["type"]
    }
}
