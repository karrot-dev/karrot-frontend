from yunity.utils.tests.comparison import ANY_INT, DATETIME_AROUND_NOW
from .initial_data import users

response = {
    "http_status": 200,
    "response": {
        "messages": [
            {
                "content": "Hi Tilmann! How are you?",
                "author": users[1].id,
                "time": DATETIME_AROUND_NOW,
                "id": ANY_INT,
            },
            {
                "content": "Hello Matthias!",
                "author": users[0].id,
                "time": DATETIME_AROUND_NOW,
                "id": ANY_INT,
            },
        ]
    }
}
