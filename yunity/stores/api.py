from rest_framework import filters
from rest_framework import viewsets, status
from rest_framework.decorators import detail_route
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from yunity.stores.filters import PickupDatesFilter
from yunity.stores.serializers import StoreSerializer, PickupDateSerializer
from yunity.stores.models import Store as StoreModel, PickupDate as PickupDateModel


class StoreViewSet(viewsets.ModelViewSet):
    """
    Stores

    # Query parameters
    - `?group` - filter by store group id
    - `?search` - search in name and description
    """
    serializer_class = StoreSerializer
    queryset = StoreModel.objects
    filter_fields = ('group',)
    filter_backends = (filters.SearchFilter, filters.DjangoFilterBackend)
    search_fields = ('name', 'description')
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return self.queryset.filter(group__members=self.request.user)


class PickupDatesViewSet(viewsets.ModelViewSet):
    """
    Pickup Dates

    # Query parameters
    - `?store` - filter by store id
    - `?group` - filter by group id
    - `?date_0=<from_date>&date_1=<to_date>` - filter by date, can also either give date_0 or date_1
    """
    serializer_class = PickupDateSerializer
    queryset = PickupDateModel.objects
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = PickupDatesFilter
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return self.queryset.filter(store__group__members=self.request.user)

    @detail_route(methods=['POST', 'GET'])
    def add(self, request, pk=None):
        pickupdate = self.get_object()
        if pickupdate.collectors.count() >= pickupdate.max_collectors:
            return Response("Pickup already full",
                            status=status.HTTP_400_BAD_REQUEST)
        pickupdate.collectors.add(request.user)
        s = self.get_serializer_class()
        return Response(s(pickupdate).data,
                        status=status.HTTP_200_OK)

    @detail_route(methods=['POST', 'GET'])
    def remove(self, request, pk=None):
        pickupdate = self.get_object()
        if not pickupdate.collectors.filter(id=request.user.id).exists():
            return Response("User not in pickup date",
                            status=status.HTTP_400_BAD_REQUEST)
        pickupdate.collectors.remove(request.user)
        s = self.get_serializer_class()
        return Response(s(pickupdate).data,
                        status=status.HTTP_200_OK)
