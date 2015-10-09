from .initial_data import users
from yunity.utils.tests.comparison import DeepMatcher

response = {
    "http_status": 200,
    "response": {
        "messages": [
            {
                "content": "Hi Tilmann! How are you?",
                "sender": users[1].id,
                "created_at": DeepMatcher.DATETIME_AROUND_NOW,
                "id": "AnyInt",
                "type": "TEXT"
            },
            {
                "content": "Hello Matthias!",
                "sender": users[0].id,
                "created_at": DeepMatcher.DATETIME_AROUND_NOW,
                "id": "AnyInt",
                "type": "TEXT"
            },
        ]
    }
}
