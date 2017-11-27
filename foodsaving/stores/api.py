from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import mixins
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import GenericViewSet

from foodsaving.history.models import History, HistoryTypus
from foodsaving.stores.models import Store as StoreModel
from foodsaving.pickups.models import (
    PickupDate as PickupDateModel,
    PickupDateSeries as PickupDateSeriesModel
)
from foodsaving.stores.serializers import StoreSerializer
from foodsaving.utils.mixins import PartialUpdateModelMixin


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
    filter_fields = ('group', 'name')
    filter_backends = (SearchFilter, DjangoFilterBackend)
    search_fields = ('name', 'description')
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return self.queryset.filter(group__members=self.request.user)

    def perform_destroy(self, store):
        store.deleted = True
        store.save()
        History.objects.create(
            typus=HistoryTypus.STORE_DELETE,
            group=store.group,
            store=store,
            users=[self.request.user, ],
        )
        # implicit action: delete all pickups and series, but don't send out signals for them
        PickupDateModel.objects.filter(store=store).delete()
        PickupDateSeriesModel.objects.filter(store=store).delete()
