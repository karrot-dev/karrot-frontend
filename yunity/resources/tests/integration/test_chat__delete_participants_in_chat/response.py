from .initial_data import final_users

response = {
    "http_status": 200,  # OK
    "response": {
        "participants": [_.id for _ in final_users]
    }
}
