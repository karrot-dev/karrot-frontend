from django.db.models import Max
from rest_framework.permissions import IsAuthenticated
from yunity.conversations.serializers import ConversationSerializer, MessageSerializer, ConversationUpdateSerializer
from yunity.conversations.models import Conversation as ConversationModel
from yunity.conversations.models import ConversationMessage as MessageModel
from rest_framework import viewsets, mixins


class ChatViewSet(mixins.CreateModelMixin,
                  mixins.ListModelMixin,
                  mixins.RetrieveModelMixin,
                  mixins.UpdateModelMixin,
                  viewsets.GenericViewSet):
    """
    Conversations

    # Query parameters
    - `?participants` - filter by participant user id
    """
    queryset = ConversationModel.objects
    serializer_class = ConversationSerializer
    permission_classes = (IsAuthenticated,)
    filter_fields = ('participants',)

    def get_queryset(self):
        return self.queryset.filter(participants__id__in=[self.request.user.id]) \
            .annotate(latest_message_time=Max('messages__created_at')) \
            .order_by('-latest_message_time')

    def get_serializer_class(self):
        serializer_class = self.serializer_class
        if self.action in ('update', 'partial_update'):
            serializer_class = ConversationUpdateSerializer
        return serializer_class


class ChatMessageViewSet(mixins.CreateModelMixin,
                         mixins.ListModelMixin,
                         viewsets.GenericViewSet):
    """
    Conversation Message
    """
    queryset = MessageModel.objects
    serializer_class = MessageSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        chat_id = self.kwargs['conversations_pk']
        return self.queryset.filter(in_conversation=chat_id)

    def create(self, request, *args, **kwargs):
        # chat_pk isn't available in the serializer, so insert it here
        request.data['in_conversation_id'] = kwargs.pop('conversations_pk')
        return super().create(request, *args, **kwargs)
