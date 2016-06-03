from yunity.utils.tests.comparison import ANY_INT, DATETIME_AROUND_NOW
from .initial_data import chat_responder
from .request import request

response = {
    "http_status": 201,
    "response": {
        "content": request["body"]["content"],
        "author": chat_responder.id,
        "time": DATETIME_AROUND_NOW,
        "id": ANY_INT,
    }
}
