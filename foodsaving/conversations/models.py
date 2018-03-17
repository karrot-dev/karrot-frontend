import bleach
import markdown
import pymdownx.emoji
import pymdownx.superfences
from bleach_whitelist.bleach_whitelist import markdown_tags, markdown_attrs
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.db.models import ForeignKey, TextField, ManyToManyField, BooleanField, CharField
from django.utils.text import Truncator

from foodsaving.base.base_models import BaseModel, UpdatedAtMixin


class ConversationManager(models.Manager):
    @classmethod
    def get_for_target(self, target):
        return Conversation.objects.filter(target_id=target.id,
                                           target_type=ContentType.objects.get_for_model(target)).first()

    @classmethod
    def get_or_create_for_target(self, target):
        return Conversation.objects.get_for_target(target) or Conversation.objects.create(target=target)


class Conversation(BaseModel, UpdatedAtMixin):
    """A conversation between one or more users."""

    class Meta:
        unique_together = ('target_type', 'target_id')

    objects = ConversationManager()

    participants = ManyToManyField(settings.AUTH_USER_MODEL, through='ConversationParticipant')

    target_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True)
    target_id = models.PositiveIntegerField(null=True)
    target = GenericForeignKey('target_type', 'target_id')

    def join(self, user, **kwargs):
        if not self.conversationparticipant_set.filter(user=user).exists():
            ConversationParticipant.objects.create(user=user, conversation=self, **kwargs)

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


class ConversationParticipant(BaseModel, UpdatedAtMixin):
    """The join table between Conversation and User."""
    user = ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    conversation = ForeignKey(Conversation, on_delete=models.CASCADE)
    seen_up_to = ForeignKey('ConversationMessage', null=True, on_delete=models.SET_NULL)
    email_notifications = BooleanField(default=True)


class ConversationMessage(BaseModel):
    """A message in the conversation by a particular user."""
    author = ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    conversation = ForeignKey(Conversation, related_name='messages', on_delete=models.CASCADE)

    content = TextField()
    received_via = CharField(max_length=40, blank=True)

    def content_rendered(self, truncate_words=None):
        html = markdown.markdown(self.content, extensions=[
            pymdownx.emoji.EmojiExtension(emoji_index=pymdownx.emoji.twemoji),
            'pymdownx.superfences',
            'pymdownx.magiclink',
            'markdown.extensions.nl2br',
        ])
        markdown_attrs['img'].append('class')
        markdown_tags.append('pre')
        clean_html = bleach.clean(html, markdown_tags, markdown_attrs)

        if truncate_words:
            clean_html = Truncator(clean_html).words(num=truncate_words, html=True)

        return clean_html


class ConversationMixin(object):
    # TODO: including this should automatically wireup a signal to create/destroy with target

    @property
    def conversation(self):
        return Conversation.objects.get_or_create_for_target(self)


class ConversationMessageReaction(BaseModel):
    """Emoji reactions to messages."""
    # User who gave the reaction
    user = ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    message = ForeignKey(ConversationMessage, related_name='reactions', on_delete=models.CASCADE)
    # Name of the emoji
    name = CharField(max_length=100)

    class Meta:
        unique_together = ['user', 'name', 'message']
