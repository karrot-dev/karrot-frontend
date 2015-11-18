from yunity.utils.tests.comparison import NotEqualsMatcher
from .initial_data import chat

response = {
    "http_status": 201,
    "response": {
        "chat":
            {"id": NotEqualsMatcher(chat.id) }
    }
}
