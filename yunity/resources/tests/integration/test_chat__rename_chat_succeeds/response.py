from .initial_data import users
from yunity.utils.tests.comparison import ANY_INT, DATETIME_AROUND_NOW

response = {
    "http_status": 200,
    "response": {
           "participants": [users[0].id, users[1].id, users[2].id],
           "name": "New funny name",
           "message": {
               "content": "Hello user 1",
               "sender": users[0].id,
               "created_at": DATETIME_AROUND_NOW,
               "id": ANY_INT,
               "type": "TEXT"
           },
           "id": ANY_INT,
    }
}
