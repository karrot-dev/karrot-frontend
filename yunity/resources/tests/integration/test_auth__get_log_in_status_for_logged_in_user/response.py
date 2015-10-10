from .initial_data import request_user

response = {
    "http_status": 200,
    "response": {
        "user": {
            "display_name": request_user.display_name,
            "id": request_user.id,
        },
    },
}
