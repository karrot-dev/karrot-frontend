from django.conf import settings
from django.db import transaction
from django.utils.translation import ugettext as _
from rest_framework import serializers

from foodsaving.history.models import History, HistoryTypus
from foodsaving.history.utils import get_changed_data
from foodsaving.stores.models import Store as StoreModel


class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoreModel
        fields = ['id', 'name', 'description', 'group',
                  'address', 'latitude', 'longitude',
                  'weeks_in_advance', 'upcoming_notification_hours', 'status']
        extra_kwargs = {
            'name': {
                'min_length': 3
            },
            'description': {
                'trim_whitespace': False,
                'max_length': settings.DESCRIPTION_MAX_LENGTH
            }
        }

    status = serializers.ChoiceField(choices=StoreModel.STATUSES,
                                     default=StoreModel.DEFAULT_STATUS)

    def create(self, validated_data):
        store = super().create(validated_data)
        History.objects.create(
            typus=HistoryTypus.STORE_CREATE,
            group=store.group,
            store=store,
            users=[self.context['request'].user, ],
            payload=self.initial_data,
        )
        return store

    def update(self, store, validated_data):
        changed_data = get_changed_data(store, validated_data)
        store = super().update(store, validated_data)

        if 'weeks_in_advance' in changed_data:
            with transaction.atomic():
                for series in store.series.all():
                    series.update_pickup_dates()

        if changed_data:
            History.objects.create(
                typus=HistoryTypus.STORE_MODIFY,
                group=store.group,
                store=store,
                users=[self.context['request'].user, ],
                payload=changed_data,
            )
        return store

    def validate_group(self, group):
        if not group.is_member(self.context['request'].user):
            raise serializers.ValidationError(_('You are not a member of this group.'))
        return group

    def validate_weeks_in_advance(self, w):
        if w < 1:
            raise serializers.ValidationError(_('Set at least one week in advance'))
        return w
