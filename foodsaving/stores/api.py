from django.dispatch import Signal
from rest_framework import filters
from rest_framework import mixins
from rest_framework import viewsets, status
from rest_framework.decorators import detail_route
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from foodsaving.stores.filters import PickupDatesFilter, PickupDateSeriesFilter
from foodsaving.stores.permissions import IsUpcoming
from foodsaving.stores.serializers import StoreSerializer, PickupDateSerializer, PickupDateSeriesSerializer
from foodsaving.stores.models import Store as StoreModel, PickupDate as PickupDateModel, \
    PickupDateSeries as PickupDateSeriesModel
from foodsaving.utils.mixins import PartialUpdateModelMixin

pre_pickup_delete = Signal()
pre_series_delete = Signal()
post_store_delete = Signal()
post_pickup_join = Signal()
post_pickup_leave = Signal()


class StoreViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    PartialUpdateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    GenericViewSet
):
    """
    Stores

    # Query parameters
    - `?group` - filter by store group id
    - `?search` - search in name and description
    """
    serializer_class = StoreSerializer
    queryset = StoreModel.objects.filter(deleted=False)
    filter_fields = ('group',)
    filter_backends = (filters.SearchFilter, filters.DjangoFilterBackend)
    search_fields = ('name', 'description')
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return self.queryset.filter(group__members=self.request.user)

    def perform_destroy(self, store):
        store.deleted = True
        store.save()
        post_store_delete.send(
            sender=self.__class__,
            group=store.group,
            store=store,
            user=self.request.user,
        )
        # implicit action: delete all pickups and series, but don't send out signals for them
        PickupDateModel.objects.filter(store=store).delete()
        PickupDateSeriesModel.objects.filter(store=store).delete()


class PickupDateSeriesViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    PartialUpdateModelMixin,
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

    def perform_destroy(self, series):
        pre_series_delete.send(
            sender=self.__class__,
            group=series.store.group,
            store=series.store,
            user=self.request.user,
        )
        super().perform_destroy(series)


class IsEmptyPickupDate(BasePermission):
    message = 'You can only delete empty pickup dates.'

    def has_object_permission(self, request, view, obj):
        return obj.collectors.count() == 0


class PickupDateViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    PartialUpdateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    GenericViewSet
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

    def perform_destroy(self, pickup):
        # set deleted flag to make the pickup date invisible
        pickup.deleted = True

        pre_pickup_delete.send(
            sender=self.__class__,
            group=pickup.store.group,
            store=pickup.store,
            user=self.request.user
        )
        pickup.save()

    @detail_route(methods=['POST'])
    def add(self, request, pk=None):
        pickupdate = self.get_object()
        if pickupdate.max_collectors and pickupdate.collectors.count() >= pickupdate.max_collectors:
            return Response("Pickup already full",
                            status=status.HTTP_400_BAD_REQUEST)
        pickupdate.collectors.add(request.user)
        s = self.get_serializer_class()
        post_pickup_join.send(
            sender=self.__class__,
            group=pickupdate.store.group,
            store=pickupdate.store,
            user=self.request.user
        )
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
        post_pickup_leave.send(
            sender=self.__class__,
            group=pickupdate.store.group,
            store=pickupdate.store,
            user=self.request.user
        )
        return Response(s(pickupdate).data,
                        status=status.HTTP_200_OK)
