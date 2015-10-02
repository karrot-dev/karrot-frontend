from rest_framework import viewsets, status
from rest_framework.response import Response
from yunity.models import Chat


class ChatViewSet(viewsets.ViewSet):
    """
    Viewset to create & modify chats and post chat messages
    """
    queryset = Chat.objects.all()

    def create(self, request):
        return Response(status=status.HTTP_201_CREATED)

    def list(self, request):
        return Response(status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        return Response(status=status.HTTP_200_OK)

    def update(self, request, pk=None):
        return Response(status=status.HTTP_200_OK)

    def destroy(self, request, pk=None):
        return Response(status=status.HTTP_204_NO_CONTENT)
