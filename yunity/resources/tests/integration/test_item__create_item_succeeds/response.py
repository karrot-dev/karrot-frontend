from yunity.utils.tests.comparison import ANY_INT
from .initial_data import request_user

response = {
    "http_status": 201,
    "response": {
        "id": ANY_INT,
        "user_id": request_user.id,
        "description": "my lovely test item",
        "latitude": 50.827845,
        "longitude": 12.921370
    }
}
