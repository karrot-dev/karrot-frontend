from rest_framework import mixins
from rest_framework.viewsets import GenericViewSet

from foodsaving.conversations.models import Conversation, ConversationMessage
from foodsaving.conversations.serializers import ConversationSerializer, ConversationMessageSerializer, \
    CreateConversationMessageSerializer


class ConversationViewSet(
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    GenericViewSet
):
    """
    Conversations
    """

    queryset = Conversation.objects
    serializer_class = ConversationSerializer

    def get_queryset(self):
        return self.queryset.filter(participants=self.request.user)


class ConversationMessageViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    GenericViewSet
):
    """
    ConversationMessages
    """

    queryset = ConversationMessage.objects
    serializer_class = ConversationMessageSerializer

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateConversationMessageSerializer
        return self.serializer_class

    def get_queryset(self):
        return self.queryset.filter(conversation__participants=self.request.user)
