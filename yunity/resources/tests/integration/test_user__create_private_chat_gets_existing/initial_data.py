from yunity.conversations.models import ConversationType
from yunity.utils.tests.mock import MockUser, MockConversation

users = [
    MockUser.create(email="testuser1@mail.com", display_name="Testuser1"),
    MockUser.create(email="testuser2@mail.com", display_name="Testuser2"),
]

chat = MockConversation.create(participants=users, type=ConversationType.ONE_ON_ONE)
