from django.utils.translation import ugettext_lazy as _
from rest_framework import mixins
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from foodsaving.conversations.models import Conversation, ConversationMessage
from foodsaving.conversations.serializers import ConversationSerializer, ConversationMessageSerializer, \
    CreateConversationMessageSerializer


class IsConversationParticipant(BasePermission):
    message = _('You are not in this conversation')

    def has_permission(self, request, view):
        conversation_id = request.GET.get('conversation', None)

        # if they specify a conversation, check they are in it
        if conversation_id:
            conversation = Conversation.objects.filter(pk=conversation_id).first() # Conversation or None
            if not conversation:
                return False
            return request.user in conversation.participants.all()

        # otherwise it is fine (messages will be filtered for the users conversations)
        return True


class ConversationMessageViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    GenericViewSet
):
    """
    ConversationMessages
    """

    # TODO: sort by newest first (reverse id)
    # TODO: limit to 50 or so
    # TODO: to load older messages add "before" that does a "where id < before"

    queryset = ConversationMessage.objects
    serializer_class = ConversationMessageSerializer
    permission_classes = (IsAuthenticated, IsConversationParticipant)
    filter_fields = ('conversation',)

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateConversationMessageSerializer
        return self.serializer_class

    def get_queryset(self):
        return self.queryset.filter(conversation__participants=self.request.user)


class RetrieveConversationMixin(object):
    """Retrieve a conversation instance."""

    def retrieve_conversation(self, request, *args, **kwargs):
        target = self.get_object()
        conversation = Conversation.objects.get_or_create_for_target(target)
        serializer = ConversationSerializer(conversation)
        return Response(serializer.data)
