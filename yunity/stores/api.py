from rest_framework import mixins, viewsets, generics, status
from rest_framework.decorators import detail_route
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
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


class PickupDatesViewSet(mixins.CreateModelMixin,
                         mixins.ListModelMixin,
                         mixins.RetrieveModelMixin,
                         mixins.UpdateModelMixin,
                         mixins.DestroyModelMixin,
                         viewsets.GenericViewSet):
    serializer_class = PickupDateSerializer
    queryset = PickupDateModel.objects
    permission_classes = (IsAuthenticated,)

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

