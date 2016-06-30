from django.contrib.auth import get_user_model
from django.db.models import ForeignKey, TextField, ManyToManyField
from django_enumfield import enum

from yunity.base.base_models import BaseModel

class ConversationType(enum.Enum):
    ONE_ON_ONE = 0
    MULTICHAT = 1


class Conversation(BaseModel):
    participants = ManyToManyField(get_user_model())
    type = enum.EnumField(ConversationType, default=ConversationType.ONE_ON_ONE)

    topic = TextField(null=True)


class ConversationMessage(BaseModel):
    author = ForeignKey(get_user_model())
    in_conversation = ForeignKey(Conversation, related_name='messages')

    content = TextField()
