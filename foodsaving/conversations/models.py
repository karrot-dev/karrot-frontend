from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db.models import ForeignKey, TextField, ManyToManyField, DateTimeField, Model
from django.utils import timezone

from config import settings
from foodsaving.base.base_models import BaseModel
from django.db import models


class Conversation(BaseModel):
    """A conversation between one or more users."""

    participants = ManyToManyField(settings.AUTH_USER_MODEL, through='ConversationParticipant')

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True)
    object_id = models.PositiveIntegerField(null=True)
    content_object = GenericForeignKey('content_type', 'object_id')

    def join(self, user):
        if not self.conversationparticipant_set.filter(user=user).exists():
            ConversationParticipant.objects.create(user=user, conversation=self)

    def leave(self, user):
        self.conversationparticipant_set.filter(user=user).delete()

    def sync_users(self, desired_users):
        """Pass in a set of users and we ensure the Conversation will end up with the right participants."""
        existing_users = self.participants.all()
        for user in desired_users:
            if not user in existing_users:
                self.join(user)
        for user in existing_users:
            if not user in desired_users:
                self.leave(user)


class ConversationParticipant(BaseModel):
    """The join table between Conversation and User."""
    user = ForeignKey(settings.AUTH_USER_MODEL)
    conversation = ForeignKey(Conversation)


class ConversationMessage(BaseModel):
    """A messae in the conversation by a particular user."""
    author = ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    conversation = ForeignKey(Conversation, related_name='messages', on_delete=models.CASCADE)

    content = TextField()


class ConversationReplyChannel(BaseModel):
    """Each channels connection has a reply channel that lets us send messages to it, we store them in the DB."""
    user = ForeignKey(settings.AUTH_USER_MODEL)
    reply_channel = TextField()
    lastseen_at = DateTimeField(default=timezone.now, null=True)


class HasConversationModel(Model):
    """Inherit a model from this if you want it to have conversations associated with it."""
    class Meta:
        abstract = True

    conversation = ForeignKey('conversations.Conversation', null=True)
