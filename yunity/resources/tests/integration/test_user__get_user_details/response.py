from .initial_data import users

response = {
    "http_status": 200,
    "response": {
        "users": [
            {"display_name": users[0].display_name, "id": users[0].id},
            {"display_name": users[1].display_name, "id": users[1].id}
        ]
    }
}
