from django.contrib.auth import get_user_model
from django.db.models import Count
from rest_framework import viewsets
from rest_framework.response import Response
from yunity.api.serializers import UserSerializer, ConversationSerializer
from yunity.conversations.models import Conversation as ConversationModel, ConversationType


class UsersViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer


class UserChatViewSet(viewsets.GenericViewSet):
    serializer_class = ConversationSerializer

    def list(self, request, user_pk=None):
        """ Gets an existing 1:1 conversation between the logged in user and the given user.
        If there is no existing conversation, none is returned. It can be created using the /chat/ endpoint."""
        participants = [request.user.id, user_pk]
        queryset = ConversationModel.objects.filter(type=ConversationType.ONE_ON_ONE).filter(
            participants__id__in=participants).annotate(c=Count('participants')).filter(c=2).first()
        serializer = self.get_serializer(queryset)
        return Response(serializer.data)
