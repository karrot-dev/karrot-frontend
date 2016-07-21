from django.db.models import ForeignKey, TextField, ManyToManyField
from django_enumfield import enum
from config import settings
from yunity.base.base_models import BaseModel
from django.db import models

class ConversationType(enum.Enum):
    ONE_ON_ONE = 0
    MULTICHAT = 1


class Conversation(BaseModel):
    participants = ManyToManyField(settings.AUTH_USER_MODEL)
    type = enum.EnumField(ConversationType, default=ConversationType.ONE_ON_ONE)

    topic = TextField(null=True)


class ConversationMessage(BaseModel):
    author = ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    in_conversation = ForeignKey(Conversation, related_name='messages', on_delete=models.CASCADE)

    content = TextField()
