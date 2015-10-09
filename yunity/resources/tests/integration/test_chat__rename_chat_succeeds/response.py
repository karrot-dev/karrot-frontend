from .initial_data import users
from yunity.utils.tests.comparison import DeepMatcher

response = {
    "http_status": 201,
    "response": {
           "participants": [users[0].id, users[1].id, users[2].id],
           "name": "New funny name",
           "message": {
               "content": "Hello user 1",
               "sender": users[0].id,
               "created_at": DeepMatcher.DATETIME_AROUND_NOW,
               "id": "AnyInt",
               "type": "TEXT"
           },
           "id": "AnyInt"
    }
}
