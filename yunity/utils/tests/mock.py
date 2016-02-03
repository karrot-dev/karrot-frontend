from django.contrib.auth import get_user_model
from factory import DjangoModelFactory, CREATE_STRATEGY, LazyAttribute, post_generation, PostGeneration, SubFactory

from yunity.conversations.models import Conversation
from yunity.utils.tests.fake import faker
from yunity.walls.models import Wall


class Mock(DjangoModelFactory):
    class Meta:
        strategy = CREATE_STRATEGY
        model = None
        abstract = True


class MockWall(Mock):
    class Meta:
        model = Wall


class MockUser(Mock):
    class Meta:
        model = get_user_model()
        strategy = CREATE_STRATEGY

    is_active = True
    is_staff = False
    display_name = LazyAttribute(lambda _: faker.name())
    first_name = LazyAttribute(lambda _: faker.name())
    last_name = LazyAttribute(lambda _: faker.name())
    email = LazyAttribute(lambda _: faker.email())
    password = PostGeneration(lambda obj, *args, **kwargs: obj.set_password(obj.display_name))

    wall = SubFactory(MockWall)


class MockConversation(Mock):
    class Meta:
        model = Conversation
        strategy = CREATE_STRATEGY

    @post_generation
    def participants(self, created, participants, **kwargs):
        if not created:
            return
        if participants:
            for participant in participants:
                self.participants.add(participant)
