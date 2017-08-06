from rest_framework import mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from foodsaving.conversations.models import Conversation, ConversationMessage
from foodsaving.conversations.serializers import ConversationSerializer, ConversationMessageSerializer, \
    CreateConversationMessageSerializer


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
    permission_classes = (IsAuthenticated,)
    filter_fields = ('conversation',)

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateConversationMessageSerializer
        return self.serializer_class

    def get_queryset(self):
        # TODO: should return an error if the user is not in the conversation, not just filter messages
        return self.queryset.filter(conversation__participants=self.request.user)


class RetrieveConversationMixin(object):
    """Retrieve a conversation instance."""

    def retrieve_conversation(self, request, *args, **kwargs):
        target = self.get_object()
        conversation = Conversation.objects.get_or_create_for_target(target)
        serializer = ConversationSerializer(conversation)
        return Response(serializer.data)
