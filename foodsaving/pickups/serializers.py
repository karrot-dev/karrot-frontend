from datetime import timedelta

import dateutil.rrule
from django.utils import timezone
from django.utils.translation import ugettext as _
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from foodsaving.history.models import History, HistoryTypus
from foodsaving.history.utils import get_changed_data
from foodsaving.pickups.models import (
    PickupDate as PickupDateModel,
    Feedback as FeedbackModel,
    PickupDateSeries as PickupDateSeriesModel,
)


class PickupDateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PickupDateModel
        fields = ['id', 'date', 'series', 'store', 'max_collectors', 'collector_ids', 'description']
        update_fields = ['date', 'max_collectors', 'description']
        extra_kwargs = {
            'series': {'read_only': True},
        }

    collector_ids = serializers.PrimaryKeyRelatedField(
        source='collectors',
        many=True,
        read_only=True
    )

    def validate_store(self, store):
        if not self.context['request'].user.groups.filter(store=store).exists():
            raise serializers.ValidationError(_('You are not member of the store\'s group.'))
        return store

    def create(self, validated_data):
        pickupdate = super().create(validated_data)
        History.objects.create(
            typus=HistoryTypus.PICKUP_CREATE,
            group=pickupdate.store.group,
            store=pickupdate.store,
            users=[self.context['request'].user, ],
            payload=self.initial_data,
        )
        return pickupdate

    def update(self, pickupdate, validated_data):
        selected_validated_data = {}
        for attr in self.Meta.update_fields:
            if attr in validated_data:
                selected_validated_data[attr] = validated_data[attr]
        changed_data = get_changed_data(pickupdate, selected_validated_data)

        if pickupdate.series:
            if 'max_collectors' in changed_data:
                selected_validated_data['is_max_collectors_changed'] = True
                if not pickupdate.is_max_collectors_changed:
                    changed_data['is_max_collectors_changed'] = True
            if 'date' in changed_data:
                selected_validated_data['is_date_changed'] = True
                if not pickupdate.is_date_changed:
                    changed_data['is_date_changed'] = True
            if 'description' in changed_data:
                selected_validated_data['is_description_changed'] = True
                if not pickupdate.is_description_changed:
                    changed_data['is_description_changed'] = True

        super().update(pickupdate, selected_validated_data)

        if changed_data:
            History.objects.create(
                typus=HistoryTypus.PICKUP_MODIFY,
                group=pickupdate.store.group,
                store=pickupdate.store,
                users=[self.context['request'].user, ],
                payload=changed_data,
            )
        return pickupdate

    def validate_date(self, date):
        if not date > timezone.now() + timedelta(minutes=10):
            raise serializers.ValidationError(_('The date should be in the future.'))
        return date


class PickupDateJoinSerializer(serializers.ModelSerializer):
    class Meta:
        model = PickupDateModel
        fields = []

    def update(self, pickupdate, validated_data):
        user = self.context['request'].user
        pickupdate.collectors.add(user)

        History.objects.create(
            typus=HistoryTypus.PICKUP_JOIN,
            group=pickupdate.store.group,
            store=pickupdate.store,
            users=[user, ],
            payload=PickupDateSerializer(instance=pickupdate).data,
        )
        return pickupdate


class PickupDateLeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = PickupDateModel
        fields = []

    def update(self, pickupdate, validated_data):
        user = self.context['request'].user
        pickupdate.collectors.remove(user)

        History.objects.create(
            typus=HistoryTypus.PICKUP_LEAVE,
            group=pickupdate.store.group,
            store=pickupdate.store,
            users=[user, ],
            payload=PickupDateSerializer(instance=pickupdate).data,
        )
        return pickupdate


class PickupDateSeriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = PickupDateSeriesModel
        fields = ['id', 'max_collectors', 'store', 'rule', 'start_date', 'description']
        update_fields = ('max_collectors', 'start_date', 'rule', 'description')

    def create(self, validated_data):
        series = super().create(validated_data)
        series.update_pickup_dates()

        History.objects.create(
            typus=HistoryTypus.SERIES_CREATE,
            group=series.store.group,
            store=series.store,
            users=[self.context['request'].user, ],
            payload=self.initial_data,
        )
        return series

    def update(self, series, validated_data):
        selected_validated_data = {}
        for attr in self.Meta.update_fields:
            if attr in validated_data:
                selected_validated_data[attr] = validated_data[attr]

        changed_data = get_changed_data(series, selected_validated_data)
        super().update(series, selected_validated_data)
        series.update_pickup_dates()

        if changed_data:
            History.objects.create(
                typus=HistoryTypus.SERIES_MODIFY,
                group=series.store.group,
                store=series.store,
                users=[self.context['request'].user, ],
                payload=changed_data,
            )
        return series

    def validate_store(self, store):
        if not store.group.is_member(self.context['request'].user):
            raise serializers.ValidationError(_('You are not member of the store\'s group.'))
        return store

    def validate_start_date(self, date):
        date = date.replace(second=0, microsecond=0)
        return date

    def validate_rule(self, rule_string):
        rrule = dateutil.rrule.rrulestr(rule_string)
        if not isinstance(rrule, dateutil.rrule.rrule):
            raise serializers.ValidationError(_('Only single recurrence rules are allowed.'))
        return rule_string


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackModel
        fields = ['id', 'weight', 'comment', 'about', 'given_by']
        read_only_fields = ['given_by', ]
        extra_kwargs = {'given_by': {'default': serializers.CurrentUserDefault()}}
        validators = [
            UniqueTogetherValidator(
                queryset=FeedbackModel.objects.all(),
                fields=FeedbackModel._meta.unique_together[0]
            )
        ]

    def validate_about(self, about):
        user = self.context['request'].user
        group = about.store.group
        if not group.is_member(user):
            raise serializers.ValidationError(_('You are not member of the store\'s group.'))
        if about.is_upcoming():
            raise serializers.ValidationError(_('The pickup is not done yet'))
        if not about.is_collector(user):
            raise serializers.ValidationError(_('You aren\'t assigned to the pickup.'))
        if not about.is_recent():
            raise serializers.ValidationError(_('You can\'t give feedback for pickups more than 30 days ago.'))
        return about

    def validate(self, data):
        if data.get('comment') is None and data.get('weight') is None:
            raise serializers.ValidationError("Both comment and weight cannot be blank.")
        return data
