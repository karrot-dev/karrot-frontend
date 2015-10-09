from .initial_data import users, request_user
from yunity.utils.tests.comparison import DeepMatcher

response = {
    "http_status": 201,
    "response": {
        "content": "Hello Matthias!",
        "sender": request_user,
        "created_at": DeepMatcher.DATETIME_AROUND_NOW,
        "id": "AnyInt",
        "type": "TEXT"
    }
}
