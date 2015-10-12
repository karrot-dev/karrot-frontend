from .initial_data import chat_responder
from .request import request
from yunity.utils.tests.comparison import ANY_INT, DATETIME_AROUND_NOW

response = {
    "http_status": 201,
    "response": {
        "content": request["body"]["content"],
        "sender": chat_responder.id,
        "created_at": DATETIME_AROUND_NOW,
        "id": ANY_INT,
        "type": request["body"]["type"]
    }
}
