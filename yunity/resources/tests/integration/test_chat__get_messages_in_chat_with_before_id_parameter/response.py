from .initial_data import before_messages
from yunity.utils.tests.comparison import ANY_INT, DATETIME_AROUND_NOW

response = {
    "http_status": 200,
    "response": {
        "messages": [
            {
                "content": _.content,
                "sender": _.sent_by.id,
                "created_at": DATETIME_AROUND_NOW,
                "id": ANY_INT,
                "type": "TEXT"
            } for _ in reversed(before_messages)
        ]
    }
}
