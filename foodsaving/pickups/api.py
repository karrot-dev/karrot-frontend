from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import mixins
from rest_framework import viewsets
from rest_framework.decorators import detail_route
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import GenericViewSet

from foodsaving.history.models import History, HistoryTypus
from foodsaving.pickups.filters import (
    PickupDatesFilter, PickupDateSeriesFilter, FeedbackFilter
)
from foodsaving.pickups.models import (
    PickupDate as PickupDateModel,
    PickupDateSeries as PickupDateSeriesModel,
    Feedback as FeedbackModel
)
from foodsaving.pickups.permissions import (
    IsUpcoming, HasNotJoinedPickupDate, HasJoinedPickupDate, IsEmptyPickupDate,
    IsNotFull, IsSameCollector)
from foodsaving.pickups.serializers import (
    PickupDateSerializer, PickupDateSeriesSerializer,
    PickupDateJoinSerializer, PickupDateLeaveSerializer, FeedbackSerializer)
from foodsaving.utils.mixins import PartialUpdateModelMixin


class FeedbackViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    PartialUpdateModelMixin,
    mixins.ListModelMixin,
    GenericViewSet
):
    """
    Feedback

    # Query parameters
    - `?given_by` - filter by user id
    - `?about` - filter by pickup id
    - `?store` - filter by store id
    """
    serializer_class = FeedbackSerializer
    queryset = FeedbackModel.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filter_class = FeedbackFilter
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return self.queryset.filter(about__store__group__members=self.request.user)

    def get_permissions(self):
        if self.action == 'partial_update':
            self.permission_classes = (IsAuthenticated, IsSameCollector,)

        return super().get_permissions()


class PickupDateSeriesViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    PartialUpdateModelMixin,
    mixins.ListModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet
):

    serializer_class = PickupDateSeriesSerializer
    queryset = PickupDateSeriesModel.objects
    filter_backends = (DjangoFilterBackend,)
    filter_class = PickupDateSeriesFilter
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return self.queryset.filter(store__group__members=self.request.user)

    def perform_destroy(self, series):
        History.objects.create(
            typus=HistoryTypus.SERIES_DELETE,
            group=series.store.group,
            store=series.store,
            users=[self.request.user, ],
        )
        super().perform_destroy(series)


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
    queryset = PickupDateModel.objects.filter(deleted=False)
    filter_backends = (DjangoFilterBackend,)
    filter_class = PickupDatesFilter
    permission_classes = (IsAuthenticated, IsUpcoming)

    def get_permissions(self):
        if self.action == 'destroy':
            self.permission_classes = (IsAuthenticated, IsUpcoming, IsEmptyPickupDate,)

        return super().get_permissions()

    def get_queryset(self):
        return self.queryset.filter(store__group__members=self.request.user)

    def perform_destroy(self, pickup):
        # set deleted flag to make the pickup date invisible
        pickup.deleted = True

        History.objects.create(
            typus=HistoryTypus.PICKUP_DELETE,
            group=pickup.store.group,
            store=pickup.store,
            users=[self.request.user, ]
        )
        pickup.save()

    @detail_route(
        methods=['POST'],
        permission_classes=(IsAuthenticated, IsUpcoming, HasNotJoinedPickupDate, IsNotFull),
        serializer_class=PickupDateJoinSerializer
    )
    def add(self, request, pk=None):
        return self.partial_update(request)

    @detail_route(
        methods=['POST'],
        permission_classes=(IsAuthenticated, IsUpcoming, HasJoinedPickupDate),
        serializer_class=PickupDateLeaveSerializer
    )
    def remove(self, request, pk=None):
        return self.partial_update(request)
