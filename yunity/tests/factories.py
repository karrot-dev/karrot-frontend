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
    locations = {[]}

class ChatFactory(Factory):
    class Meta:
        model = "yunity.Chat"
        strategy = factory.CREATE_STRATEGY

    administrated_by = factory.SubFactory(UserFactory)

    @factory.post_generation
    def participants(self, create, extracted, **kwargs):
        if not create:
            return
        if extracted:
            # A list of groups were passed in, use them
            for participant in extracted:
                self.participants.add(participant)

class MessageFactory(Factory):
    class Meta:
        model = "yunity.Message"
        strategy = factory.CREATE_STRATEGY

    sent_by = None #ForeignKey('yunity.User')
    reply_to = None #ForeignKey('self', null=True, related_name='replies')
    in_conversation = None #ForeignKey('yunity.Conversation', related_name='messages')
    created_at = None #DateTimeField(auto_now=True)
    type = None #MaxLengthCharField()
    content = None #TextField()