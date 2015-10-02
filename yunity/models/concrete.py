from django.contrib.auth.models import AbstractBaseUser
from django.db.models import TextField, ForeignKey, DateTimeField, OneToOneField, ManyToManyField, EmailField, BooleanField
from django.utils import timezone
from yunity.models.abstract import MapItem, Conversation, Request
from yunity.models.utils import BaseModel, MaxLengthCharField, UserManager


class User(AbstractBaseUser, MapItem):
    email = EmailField(max_length=64, unique=True)
    is_active = BooleanField(default=True)
    is_staff = BooleanField(default=False)
    date_joined = DateTimeField(default=timezone.now)
    display_name = TextField()

    objects = UserManager()

    USERNAME_FIELD = 'email'

    def to_es(self):
        return super().to_es()

    def get_full_name(self):
        return self.name

    def get_short_name(self):
        return self.name


class Valuable(MapItem):
    def to_es(self):
        return super().to_es()


class Opportunity(MapItem):
    def to_es(self):
        return super().to_es()


class Category(BaseModel):
    parent = ForeignKey('self', null=True, related_name='children')

    name = MaxLengthCharField()


class Message(BaseModel):
    sent_by = ForeignKey('yunity.User')
    reply_to = ForeignKey('self', null=True, related_name='replies')
    in_conversation = ForeignKey('yunity.Conversation', related_name='messages')

    created_at = DateTimeField(auto_now=True)
    type = MaxLengthCharField()
    content = TextField()


class Interaction(BaseModel):
    created_at = DateTimeField(auto_now=True)
    type = MaxLengthCharField()
    payload = TextField()

    caused_by = ForeignKey('yunity.User', related_name='interation_caused')
    changed = OneToOneField('yunity.VersionTrait')


class Feedback(BaseModel):
    about = OneToOneField('yunity.FeedbackTrait')
    provided_by = OneToOneField('yunity.User', related_name='feedback_provider')
    arbitrated_by = ManyToManyField('yunity.User', related_name='feedback_arbitrators')

    status = MaxLengthCharField()
    type = MaxLengthCharField()


class Chat(Conversation):
    participants = ManyToManyField('yunity.User')


class Wall(Conversation):
    target = OneToOneField('yunity.MapItem')


class ArbitrationLog(Conversation):
    target = OneToOneField('yunity.Feedback')


class Participate(Request):
    target = ForeignKey('yunity.Opportunity')

    type = MaxLengthCharField()


class Take(Request):
    target = ForeignKey('yunity.Valuable')
