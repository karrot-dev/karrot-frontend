from yunity.utils.tests.comparison import ANY_INT, ANY_STRING, DATETIME_AROUND_NOW
from .initial_data import users

response = {
    "http_status": 200,
    "response": {
        "chats": [
            {
                "participants": [{"id": users[0].id, "name": ANY_STRING},
                                 {"id": users[1].id, "name": ANY_STRING}],
                "type": "ONE_ON_ONE",
                "messages": [{
                    "content": "Hello user 1",
                    "author": users[0].id,
                    "time": DATETIME_AROUND_NOW,
                    "id": ANY_INT,
                }],
                "id": ANY_INT,
            },
            {
                "topic": "My little group chat",
                "participants": [{"id": users[0].id, "name": ANY_STRING},
                                 {"id": users[1].id, "name": ANY_STRING},
                                 {"id": users[2].id, "name": ANY_STRING}],
                "type": "USER_MULTICHAT",
                "messages": [{
                    "content": "Thanks, how are you two?",
                    "author": users[1].id,
                    "time": DATETIME_AROUND_NOW,
                    "id": ANY_INT,
                    },
                    {
                    "content": "Hey, I created a group chat",
                    "author": users[0].id,
                    "time": DATETIME_AROUND_NOW,
                    "id": ANY_INT,
                    }],
                "id": ANY_INT,
            },

        ]
    }
}
