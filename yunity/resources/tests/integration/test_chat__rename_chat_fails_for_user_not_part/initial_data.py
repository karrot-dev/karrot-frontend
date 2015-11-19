from yunity.utils.tests.mock import MockUser, MockConversation

users = MockUser.create_batch(3)
request_user = MockUser.create()
chat = MockConversation.create(participants=users)
chat_id = chat.id
