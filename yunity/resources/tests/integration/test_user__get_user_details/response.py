from .initial_data import users

response = {
    "http_status": 200,
    "response": {
        "users": [
            {"display_name": "Testuser1", "id": users[0].id},
            {"display_name": "Testuser2", "id": users[1].id}
        ]
    }
}
