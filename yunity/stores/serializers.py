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

    def validate_store(self, store_id):
        if not self.context['request'].user.groups.filter(store=store_id).all():
            raise serializers.ValidationError('You are not member of the store\'s group.')
        return store_id


class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoreModel
        fields = ['id', 'name', 'description', 'group', 'address', 'latitude', 'longitude']

    def validate_group(self, group_id):
        if group_id not in self.context['request'].user.groups.all():
            raise serializers.ValidationError('You are not member of the given group.')
        return group_id
