from django.utils.datetime_safe import datetime
import factory
from yunity.models import Category


class Factory(factory.DjangoModelFactory):
    class Meta:
        strategy = factory.CREATE_STRATEGY
        model = None
        abstract = True

class UserFactory(Factory):
    class Meta:
        model = "yunity.User"
        strategy = factory.CREATE_STRATEGY

    type = Category.objects.get(name="user.default")
    display_name = factory.Sequence(lambda n: "user{}".format(n))
    email = factory.LazyAttribute(lambda obj: '%s@email.com' % obj.display_name)
    is_active = True
    is_staff = False
    date_joined = datetime.now()
    password = factory.PostGeneration(lambda obj, *args, **kwargs: obj.set_password(obj.display_name))
    last_login = datetime.now()
    locations = {}

class ChatFactory(Factory):
    class Meta:
        model = "yunity.Chat"
        strategy = factory.CREATE_STRATEGY

    administrated_by = factory.SubFactory(UserFactory)

    @factory.post_generation
    def participants(self, create, extracted, **kwargs):
        if not create:
            # Simple build, do nothing.
            return

        if extracted:
            # A list of groups were passed in, use them
            for participant in extracted:
                self.participants.add(participant)