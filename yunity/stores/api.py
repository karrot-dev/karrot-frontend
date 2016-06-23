from rest_framework import viewsets, mixins, generics
from yunity.stores.serializers import StoreDetailSerializer, StoreSummarySerializer
from yunity.stores.models import Store as StoreModel


class StoreList(generics.ListCreateAPIView):
    serializer_class = StoreDetailSerializer
    queryset = StoreModel.objects


class StoreSummary(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = StoreSummarySerializer
    queryset = StoreModel.objects
