from rest_framework import viewsets, mixins
from yunity.stores.serializers import StoreDetailSerializer
from yunity.stores.models import Store as StoreModel


class StoreViewSet(viewsets.GenericViewSet,
                   mixins.ListModelMixin,
                   mixins.CreateModelMixin):
    serializer_class = StoreDetailSerializer
    queryset = StoreModel.objects


