from rest_framework import status, viewsets
from rest_framework.decorators import detail_route
from rest_framework.response import Response
from yunity.groups.serializers import GroupSerializer
from yunity.groups.models import Group as GroupModel


class GroupViewSet(viewsets.ModelViewSet):
    queryset = GroupModel.objects.all()
    serializer_class = GroupSerializer

    @detail_route(methods=['POST', 'GET'])
    def join(self, request, pk=None):
        group = self.get_object()
        group.members.add(request.user)
        return Response(status=status.HTTP_200_OK)

    @detail_route(methods=['POST', 'GET'])
    def leave(self, request, pk=None):
        group = self.get_object()
        if not group.members.filter(id=request.user.id).exists():
            return Response("User not member of group",
                            status=status.HTTP_400_BAD_REQUEST)
        group.members.remove(request.user)
        return Response(status=status.HTTP_200_OK)
