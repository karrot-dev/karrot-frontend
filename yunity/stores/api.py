from rest_framework import viewsets, mixins, generics
from yunity.stores.serializers import StoreDetailSerializer, StoreSummarySerializer, PickupDateSerializer
from yunity.stores.models import Store as StoreModel, PickupDate as PickupDateModel


class StoreList(generics.ListCreateAPIView):
    serializer_class = StoreDetailSerializer
    queryset = StoreModel.objects


class StoreSummary(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = StoreSummarySerializer
    queryset = StoreModel.objects


class StorePickupDateCreate(generics.CreateAPIView):
    serializer_class = PickupDateSerializer

""" POST adds user, DELETE <date_id>/<user_id> removes user"""
class PickupDatesViewSet(viewsets.GenericViewSet):
    serializer_class = PickupDateSerializer
    queryset = PickupDateModel.objects

