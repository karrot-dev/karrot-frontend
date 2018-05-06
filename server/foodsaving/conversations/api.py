from django.utils.translation import ugettext_lazy as _
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import mixins
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.decorators import detail_route
from rest_framework.pagination import CursorPagination
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from foodsaving.conversations.models import (
    Conversation,
    ConversationMessage,
    ConversationMessageReaction
)
from foodsaving.conversations.serializers import (
    ConversationSerializer,
    ConversationMessageSerializer,
    ConversationMessageReactionSerializer,
    ConversationMarkSerializer,
    ConversationEmailNotificationsSerializer,
    EmojiField)


class MessagePagination(CursorPagination):
    # TODO: create an index on 'created_at' for increased speed
    page_size = 10
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


class IsMessageConversationParticipant(BasePermission):
    """Is the specified message in a conversation which user participates in?"""

    message = _('You are not in this conversation')

    def has_object_permission(self, request, view, message):
        return message.conversation.participants.filter(id=request.user.id).exists()


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

    @detail_route(
        methods=['POST'],
        serializer_class=ConversationEmailNotificationsSerializer
    )
    def email_notifications(self, request, pk=None):
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

    @detail_route(
        methods=('POST',),
        filter_fields=('name',),
        permission_classes=(IsAuthenticated, IsMessageConversationParticipant)
    )
    def reactions(self, request, pk):
        """route for POST /messages/{id}/reactions/ with body {"name":"emoji_name"}"""

        message = get_object_or_404(ConversationMessage, id=pk)

        # object permissions check has to be triggered manually
        self.check_object_permissions(self.request, message)

        data = {
            'message': pk,
            'name': request.data.get('name'),
            'user': request.user.id,
        }

        serializer = ConversationMessageReactionSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @detail_route(
        methods=('DELETE',),
        url_path='reactions/(?P<name>[a-z0-9_+-]+)',
        url_name='remove_reaction',
        permission_classes=(IsAuthenticated, IsMessageConversationParticipant)
    )
    def remove_reaction(self, request, pk, name):
        """route for DELETE /messages/{id}/reactions/{name}/"""

        name = EmojiField.to_internal_value(None, name)

        message = get_object_or_404(ConversationMessage, id=pk)

        # object permissions check has to be triggered manually
        self.check_object_permissions(self.request, message)

        reaction = get_object_or_404(ConversationMessageReaction, name=name, message=message,
                                     user=request.user)

        reaction.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class RetrieveConversationMixin(object):
    """Retrieve a conversation instance."""

    def retrieve_conversation(self, request, *args, **kwargs):
        target = self.get_object()
        conversation = Conversation.objects.get_or_create_for_target(target)
        serializer = ConversationSerializer(conversation, context={'request': request})
        return Response(serializer.data)
