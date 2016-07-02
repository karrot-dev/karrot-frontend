from django.db.models import Max
from rest_framework import status
from rest_framework.decorators import detail_route
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from yunity.conversations.services import get_or_create_user_conversation, add_to_conversation
from yunity.conversations.serializers import ConversationSerializer, MessageSerializer, ConversationByUserSerializer
from yunity.conversations.models import Conversation as ConversationModel, ConversationType
from yunity.conversations.models import ConversationMessage as MessageModel
from rest_framework import viewsets, mixins


class ChatViewSet(mixins.CreateModelMixin,
                  mixins.ListModelMixin,
                  mixins.RetrieveModelMixin,
                  mixins.UpdateModelMixin,
                  viewsets.GenericViewSet):

    queryset = ConversationModel.objects
    serializer_class = ConversationSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return self.queryset.filter(participants__id__in=[self.request.user.id]) \
            .annotate(latest_message_time=Max('messages__created_at')) \
            .order_by('-latest_message_time')


class ChatMessageViewSet(mixins.CreateModelMixin,
                         mixins.ListModelMixin,
                         viewsets.GenericViewSet):
    queryset = MessageModel.objects
    serializer_class = MessageSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        chat_id = self.kwargs['conversations_pk']
        return self.queryset.filter(in_conversation=chat_id)

    def create(self, request, *args, **kwargs):
        "chat_pk isn't available in the serializer, so insert it here"
        request.data['in_conversation_id'] = kwargs.pop('conversations_pk')
        return super().create(request, *args, **kwargs)


class UserChatViewSet(mixins.RetrieveModelMixin,
                      viewsets.GenericViewSet):
    serializer_class = ConversationByUserSerializer
    queryset = ConversationModel.objects
    lookup_field = 'participants__id'

    def get_queryset(self):
        return self.queryset.filter(type=ConversationType.ONE_ON_ONE).filter(participants__id=self.request.user.id)

    @detail_route(methods=['post'], url_path='messages')
    def post_message(self, request, participants__id):
        participants = [request.user.id, participants__id]
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        conversation = get_or_create_user_conversation(participants)
        add_to_conversation(conversation.id, request.user.id, serializer.validated_data)
        return Response(self.get_serializer(conversation).data, status=status.HTTP_201_CREATED)
