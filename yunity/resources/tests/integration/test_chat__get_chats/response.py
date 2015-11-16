from .initial_data import users
from yunity.utils.tests.comparison import ANY_INT, DATETIME_AROUND_NOW

response = {
    "http_status": 200,
    "response": {
        "chats": [
            {
                "participants": [users[0].id, users[1].id],
                "message": {
                    "content": "Hello user 1",
                    "sender": users[0].id,
                    "created_at": DATETIME_AROUND_NOW,
                    "id": ANY_INT,
                },
                "id": ANY_INT,
            },
            {
                "name": "My little group chat",
                "participants": [users[0].id, users[1].id, users[2].id],
                "message": {
                    "content": "Thanks, how are you two?",
                    "sender": users[1].id,
                    "created_at": DATETIME_AROUND_NOW,
                    "id": ANY_INT,
                },
                "id": ANY_INT,
            },

        ]
    }
}
