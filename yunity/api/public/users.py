from django.contrib.auth import get_user_model
from django.db.models import Count
from rest_framework import viewsets
from rest_framework.response import Response
from yunity.api.serializers import UserSerializer, ConversationSerializer
from yunity.conversations.models import Conversation as ConversationModel, ConversationType


class UsersViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer


class UserChatViewSet(viewsets.ViewSet):
    serializer_class = ConversationSerializer

    def list(self, request, user_pk=None):
        participants = [request.user.id, user_pk]
        queryset = ConversationModel.objects.filter(type=ConversationType.ONE_ON_ONE).filter(
            participants__id__in=participants).annotate(c=Count('participants')).filter(c=2).first()
        serializer = ConversationSerializer(queryset)
        return Response(serializer.data)
