from rest_framework import viewsets, status
from rest_framework.decorators import detail_route
from rest_framework.response import Response
from yunity.models import MapItem


class AuthViewSet(viewsets.ViewSet):
    """
    """
    queryset = MapItem.objects.all()

    def create(self, request):
        """
        """
        return Response(status=status.HTTP_201_CREATED)

    def list(self):
        """
        """
        return Response(status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        """
        """
        return Response(status=status.HTTP_200_OK)

    def update(self, request, pk=None):
        """
        """
        return Response(status=status.HTTP_200_OK)

    def destroy(self, request, pk=None):
        """
        """
        return Response(status=status.HTTP_204_NO_CONTENT)

    @detail_route(methods=["POST"])
    def arbitrationlog(self, request, pk=None):
        """
        """
        return Response(status=status.HTTP_201_CREATED)