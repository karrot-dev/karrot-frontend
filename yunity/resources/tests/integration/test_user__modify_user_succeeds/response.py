from .initial_data import user
from .request import request

response = {
    "http_status": 201,
    "response": {
        "id": user.id,
        "display_name": request['body']['display_name'],
    }
}
