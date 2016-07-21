from rest_framework import serializers
from yunity.stores.models import Store as StoreModel
from yunity.stores.models import PickupDate as PickupDateModel


class PickupDateSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    date = serializers.DateTimeField()
    collector_ids = serializers.PrimaryKeyRelatedField(source='collectors',
                                                       many=True,
                                                       read_only=True)
    max_collectors = serializers.IntegerField()
    store = serializers.PrimaryKeyRelatedField(queryset=StoreModel.objects.all())

    def create(self, validated_data):
        return PickupDateModel.objects.create(**validated_data)

    def update(self, pickupdate, validated_data):
        pickupdate.date = validated_data.get('date', pickupdate.date)
        pickupdate.max_collectors = validated_data.get('max_collectors', pickupdate.max_collectors)
        pickupdate.save()
        return pickupdate


class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoreModel
        fields = ['id', 'name', 'description', 'group']
