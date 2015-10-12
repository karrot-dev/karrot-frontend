from .initial_data import users
from yunity.utils.tests.comparison import ANY_INT, DATETIME_AROUND_NOW

response = {
    "http_status": 200,
    "response": {
        "messages": [
            {
                "content": "Hi Tilmann! How are you?",
                "sender": users[1].id,
                "created_at": DATETIME_AROUND_NOW,
                "id": ANY_INT,
                "type": "TEXT"
            },
        ]
    }
}
