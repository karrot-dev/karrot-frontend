from .initial_data import users
from yunity.utils.tests.comparison import DeepMatcher

response = {
    "http_status": 200,
    "response": {
        "chats": [
            {
                "participants": [users[0].id, users[1].id],
                "message": {
                    "content": "Hello user 1",
                    "sender": users[0].id,
                    "created_at": DeepMatcher.DATETIME_AROUND_NOW,
                    "id": "AnyInt",
                    "type": "TEXT"
                },
                "id": "AnyInt"
            },
            {
                "name": "My little group chat",
                "participants": [users[0].id, users[1].id, users[2].id],
                "message": {
                    "content": "Thanks, how are you two?",
                    "sender": users[1].id,
                    "created_at": DeepMatcher.DATETIME_AROUND_NOW,
                    "id": "AnyInt",
                    "type": "TEXT"
                },
                "id": "AnyInt"
            },

        ]
    }
}
