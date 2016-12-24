from datetime import timedelta

from django.utils import timezone
from rest_framework import serializers

from config import settings
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

    def validate_date(self, date):
        if not date > timezone.now() + timedelta(minutes=10):
            raise serializers.ValidationError('The date should be in the future.')
        return date

    def validate_max_collectors(self, val):
        if not val > 0:
            raise serializers.ValidationError('The number of collectors should be greater than 0.')
        return val


class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoreModel
        fields = ['id', 'name', 'description', 'group', 'address', 'latitude', 'longitude']
        extra_kwargs = {'description': {'trim_whitespace': False,
                                        'max_length': settings.DESCRIPTION_MAX_LENGTH}}

    def validate(self, data):
        if 'description' not in data:
            data['description'] = ''
        return data

    def validate_group(self, group_id):
        if group_id not in self.context['request'].user.groups.all():
            raise serializers.ValidationError('You are not member of the given group.')
        return group_id
