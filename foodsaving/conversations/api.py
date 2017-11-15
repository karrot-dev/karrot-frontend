from django.utils.translation import ugettext_lazy as _
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import mixins
from rest_framework.decorators import detail_route
from rest_framework.pagination import CursorPagination
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from foodsaving.conversations.models import (
    Conversation,
    ConversationMessage
)
from foodsaving.conversations.serializers import (
    ConversationSerializer,
    ConversationMessageSerializer,
    ConversationMarkSerializer
)


class MessagePagination(CursorPagination):
    # TODO: create an index on 'created_at' for increased speed
    page_size = 50
    ordering = '-created_at'


class IsConversationParticipant(BasePermission):
    message = _('You are not in this conversation')

    def has_permission(self, request, view):
        conversation_id = request.GET.get('conversation', None)

        # if they specify a conversation, check they are in it
        if conversation_id:
            conversation = Conversation.objects.filter(pk=conversation_id).first()  # Conversation or None
            if not conversation:
                return False
            return request.user in conversation.participants.all()

        # otherwise it is fine (messages will be filtered for the users conversations)
        return True


class ConversationViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    GenericViewSet
):
    """
    Conversations
    """

    queryset = Conversation.objects
    serializer_class = ConversationSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return self.queryset.filter(participants=self.request.user)

    @detail_route(
        methods=['POST'],
        serializer_class=ConversationMarkSerializer
    )
    def mark(self, request, pk=None):
        conversation = self.get_object()
        participant = conversation.conversationparticipant_set.get(user=request.user)
        serializer = self.get_serializer(participant, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


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
    permission_classes = (IsAuthenticated, IsConversationParticipant)
    filter_backends = (DjangoFilterBackend,)
    filter_fields = ('conversation',)
    pagination_class = MessagePagination

    def get_queryset(self):
        return self.queryset.filter(conversation__participants=self.request.user)


class RetrieveConversationMixin(object):
    """Retrieve a conversation instance."""

    def retrieve_conversation(self, request, *args, **kwargs):
        target = self.get_object()
        conversation = Conversation.objects.get_or_create_for_target(target)
        serializer = ConversationSerializer(conversation, context={'request': request})
        return Response(serializer.data)
