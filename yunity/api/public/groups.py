from rest_framework import status, viewsets
from rest_framework.decorators import detail_route
from rest_framework.response import Response
from yunity.api.serializers import GroupSerializer
from yunity.groups.models import Group as GroupModel


class JoinableHubMixin:
    @detail_route(methods=['POST'])
    def join(self, request, pk=None):
        hub = self.get_object().hub
        hub.hubmembership_set.create(user=request.user)
        return Response(status=status.HTTP_200_OK)


class GroupsViewSet(JoinableHubMixin, viewsets.ModelViewSet):
    queryset = GroupModel.objects.all()
    serializer_class = GroupSerializer
