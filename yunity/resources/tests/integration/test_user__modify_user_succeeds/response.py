from .initial_data import request_user
from .request import request

response = {
    "http_status": 201,
    "response": {
        "id": request_user,
        "display_name": request['body']['display_name'],
    }
}
