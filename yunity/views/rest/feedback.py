from rest_framework import viewsets, status
from rest_framework.response import Response


class FeedbackViewSet(viewsets.ViewSet):
    """
    Viewset to create feedback about Mapitem, view & modify it
    """
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
