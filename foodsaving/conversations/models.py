from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.db.models import ForeignKey, TextField, ManyToManyField

from config import settings
from foodsaving.base.base_models import BaseModel


class ConversationManager(models.Manager):
    @classmethod
    def get_for_target(self, target):
        return Conversation.objects.filter(target_id=target.id,
                                           target_type=ContentType.objects.get_for_model(target)).first()

    @classmethod
    def get_or_create_for_target(self, target):
        return Conversation.objects.get_for_target(target) or Conversation.objects.create(target=target)


class Conversation(BaseModel):
    """A conversation between one or more users."""

    class Meta:
        unique_together = ('target_type', 'target_id')

    objects = ConversationManager()

    participants = ManyToManyField(settings.AUTH_USER_MODEL, through='ConversationParticipant')

    target_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True)
    target_id = models.PositiveIntegerField(null=True)
    target = GenericForeignKey('target_type', 'target_id')

    def join(self, user):
        if not self.conversationparticipant_set.filter(user=user).exists():
            ConversationParticipant.objects.create(user=user, conversation=self)

    def leave(self, user):
        self.conversationparticipant_set.filter(user=user).delete()

    def sync_users(self, desired_users):
        """Pass in a set of users and we ensure the Conversation will end up with the right participants."""
        existing_users = self.participants.all()
        for user in desired_users:
            if user not in existing_users:
                self.join(user)
        for user in existing_users:
            if user not in desired_users:
                self.leave(user)


class ConversationParticipant(BaseModel):
    """The join table between Conversation and User."""
    user = ForeignKey(settings.AUTH_USER_MODEL)
    conversation = ForeignKey(Conversation)


class ConversationMessage(BaseModel):
    """A message in the conversation by a particular user."""
    author = ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    conversation = ForeignKey(Conversation, related_name='messages', on_delete=models.CASCADE)

    content = TextField()


class ConversationMixin(object):
    # TODO: including this should automatically wireup a signal to create/destroy with target

    @property
    def conversation(self):
        return Conversation.objects.get_or_create_for_target(self)
