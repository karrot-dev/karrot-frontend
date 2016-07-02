from rest_framework import serializers
from yunity.groups.models import Group
from yunity.stores.models import Store as StoreModel
from yunity.stores.models import PickupDate as PickupDateModel


class StoreDetailSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField()
    description = serializers.CharField()
    group = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all())

    def create(self, validated_data):
        return StoreModel.objects.create(**validated_data)


class PickupDateSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    date = serializers.DateTimeField()
    collector_ids = serializers.PrimaryKeyRelatedField(source='collectors',
                                                       many=True,
                                                       read_only=True)
    max_collectors = serializers.IntegerField()
    store = serializers.PrimaryKeyRelatedField(  # source='stores.store',
        queryset=StoreModel.objects.all())

    def create(self, validated_data):
        return PickupDateModel.objects.create(**validated_data)

    def update(self, pickupdate, validated_data):
        pickupdate.date = validated_data.get('date', pickupdate.date)
        pickupdate.max_collectors = validated_data.get('max_collectors', pickupdate.max_collectors)
        pickupdate.save()
        return pickupdate


class StoreSummarySerializer(StoreDetailSerializer):
    pickups = PickupDateSerializer(source='pickupdates', read_only=True, many=True)
