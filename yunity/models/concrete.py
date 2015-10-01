from django.contrib.auth.models import AbstractBaseUser
from django.db.models import TextField, ForeignKey, FloatField, DateTimeField, OneToOneField, ManyToManyField, EmailField, BooleanField
from django.utils import timezone
from yunity.models.abstract import MapItem, Conversation, Request
from yunity.models.utils import BaseModel, MaxLengthCharField, UserManager


class User(AbstractBaseUser, MapItem):
    email = EmailField(max_length=64, unique=True)
    is_active = BooleanField(default=True)
    is_staff = BooleanField(default=False)
    date_joined = DateTimeField(default=timezone.now)
    displayName = TextField()

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


class Contact(BaseModel):
    mapItem = ForeignKey('yunity.MapItem', related_name='contacts')

    type = MaxLengthCharField()
    value = TextField()


class Location(BaseModel):
    mapItem = ForeignKey('yunity.MapItem', related_name='locations')

    latitude = FloatField()
    longitude = FloatField()
    startTime = DateTimeField(null=True)
    endTime = DateTimeField(null=True)
    description = TextField(null=True)


class Message(BaseModel):
    sentBy = ForeignKey('yunity.User')
    replyTo = ForeignKey('self', null=True, related_name='replies')
    conversation = ForeignKey('yunity.Conversation', related_name='messages')

    createdAt = DateTimeField(auto_now=True)
    type = MaxLengthCharField()
    content = TextField()


class Interaction(BaseModel):
    createdAt = DateTimeField(auto_now=True)
    type = MaxLengthCharField()
    payload = TextField()

    causedBy = ForeignKey('yunity.User', related_name='interationCaused')
    changed = OneToOneField('yunity.VersionTrait')


class Feedback(BaseModel):
    about = OneToOneField('yunity.FeedbackTrait')
    providedBy = OneToOneField('yunity.User', related_name='feedbackProvider')
    arbitratedBy = ManyToManyField('yunity.User', related_name='feedbackArbitrators')


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
