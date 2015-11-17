from yunity.utils.tests.comparison import ANY_INT
from .initial_data import request_user

response = {
    "http_status": 201,
    "response": {
        "id": ANY_INT,
        "name": "test group name",
        "description": "test group description",
    }
}
