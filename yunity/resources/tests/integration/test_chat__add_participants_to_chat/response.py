from .initial_data import initial_users, add_users

all_user_ids = [_.id for _ in initial_users] + [_.id for _ in add_users]

response = {
    "http_status": 201,
    "response": {
        "participants": all_user_ids
    }
}
