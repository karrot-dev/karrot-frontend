from rest_framework import filters
from rest_framework import mixins
from rest_framework import viewsets, status
from rest_framework.decorators import detail_route
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.response import Response

from yunity.stores.filters import PickupDatesFilter, PickupDateSeriesFilter
from yunity.stores.permissions import IsUpcoming
from yunity.stores.serializers import StoreSerializer, PickupDateSerializer, PickupDateSeriesSerializer
from yunity.stores.models import Store as StoreModel, PickupDate as PickupDateModel, \
    PickupDateSeries as PickupDateSeriesModel


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


class PickupDateSeriesViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet
):
    """
    Pickup Date Series

    # Query parameters
    - `?store` - filter by store id
    """
    serializer_class = PickupDateSeriesSerializer
    queryset = PickupDateSeriesModel.objects
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = PickupDateSeriesFilter
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return self.queryset.filter(store__group__members=self.request.user)


class DeleteModelMixin(object):
    """
    Deletes a model instance by setting the "deleted" field
    """
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_delete(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_delete(self, instance):
        instance.deleted = True
        instance.save()


class IsEmptyPickupDate(BasePermission):
    message = 'You can only delete empty pickup dates.'

    def has_object_permission(self, request, view, obj):
        return obj.collectors.count() == 0


class PickupDateViewSet(
    DeleteModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    """
    Pickup Dates

    # Query parameters
    - `?series` - filter by pickup date series id
    - `?store` - filter by store id
    - `?group` - filter by group id
    - `?date_0=<from_date>`&`date_1=<to_date>` - filter by date, can also either give date_0 or date_1
    """
    serializer_class = PickupDateSerializer
    queryset = PickupDateModel.objects
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = PickupDatesFilter
    permission_classes = (IsAuthenticated, IsUpcoming)

    def get_permissions(self):
        if self.action == 'destroy':
            self.permission_classes = (IsAuthenticated, IsUpcoming, IsEmptyPickupDate,)

        return super().get_permissions()

    def get_queryset(self):
        return self.queryset.filter(store__group__members=self.request.user).filter(deleted=False)

    @detail_route(methods=['POST'])
    def add(self, request, pk=None):
        pickupdate = self.get_object()
        if pickupdate.collectors.count() >= pickupdate.max_collectors:
            return Response("Pickup already full",
                            status=status.HTTP_400_BAD_REQUEST)
        pickupdate.collectors.add(request.user)
        s = self.get_serializer_class()
        return Response(s(pickupdate).data,
                        status=status.HTTP_200_OK)

    @detail_route(methods=['POST'])
    def remove(self, request, pk=None):
        pickupdate = self.get_object()
        if not pickupdate.collectors.filter(id=request.user.id).exists():
            return Response("User not in pickup date",
                            status=status.HTTP_400_BAD_REQUEST)
        pickupdate.collectors.remove(request.user)
        s = self.get_serializer_class()
        return Response(s(pickupdate).data,
                        status=status.HTTP_200_OK)
