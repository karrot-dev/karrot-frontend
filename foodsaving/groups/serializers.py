import pytz
from django.conf import settings
from django.utils.translation import ugettext as _
from rest_framework import serializers
from rest_framework.exceptions import ValidationError, PermissionDenied

from foodsaving.groups.models import Group as GroupModel, GroupMembership, Agreement, UserAgreement
from foodsaving.history.models import History, HistoryTypus
from foodsaving.history.utils import get_changed_data
from . import roles


class TimezoneField(serializers.Field):
    def to_representation(self, obj):
        return str(obj)

    def to_internal_value(self, data):
        try:
            return pytz.timezone(str(data))
        except pytz.exceptions.UnknownTimeZoneError:
            raise ValidationError(_('Unknown timezone'))


class GroupMembershipInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupMembership
        fields = ('created_at', 'roles')
        extra_kwargs = {
            'created_at': {
                'read_only': True
            },
            'roles': {
                'read_only': True
            },
        }


class GroupDetailSerializer(serializers.ModelSerializer):
    "use this also for creating and updating a group"

    class Meta:
        model = GroupModel
        fields = [
            'id',
            'name',
            'description',
            'public_description',
            'members',
            'memberships',
            'address',
            'latitude',
            'longitude',
            'password',
            'timezone',
            'slack_webhook',
            'active_agreement',
        ]
        extra_kwargs = {
            'name': {
                'min_length': 5
            },
            'members': {
                'read_only': True
            },
            'memberships': {
                'read_only': True
            },
            'description': {
                'trim_whitespace': False,
                'max_length': settings.DESCRIPTION_MAX_LENGTH
            },
            'password': {
                'trim_whitespace': False,
                'max_length': 255
            },
        }

    memberships = serializers.SerializerMethodField()

    def validate_active_agreement(self, active_agreement):
        user = self.context['request'].user
        group = self.instance
        membership = GroupMembership.objects.filter(user=user, group=group).first()
        if roles.GROUP_AGREEMENT_MANAGER not in membership.roles:
            raise PermissionDenied(_('You cannot manage agreements'))
        if active_agreement.group != group:
            raise ValidationError(_('Agreement is not for this group'))
        return active_agreement

    def get_memberships(self, group):
        return {m.user_id: GroupMembershipInfoSerializer(m).data for m in group.groupmembership_set.all()}

    timezone = TimezoneField()

    def update(self, group, validated_data):
        changed_data = get_changed_data(group, validated_data)
        group = super().update(group, validated_data)

        if changed_data:
            user = self.context['request'].user
            History.objects.create(
                typus=HistoryTypus.GROUP_MODIFY,
                group=group,
                users=[user, ],
                payload=changed_data
            )
        return group

    def create(self, validated_data):
        user = self.context['request'].user
        group = GroupModel.objects.create(**validated_data)
        GroupMembership.objects.create(group=group, user=user)
        History.objects.create(
            typus=HistoryTypus.GROUP_CREATE,
            group=group,
            users=[user, ],
            payload=self.initial_data
        )
        return group


class AgreementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agreement
        fields = [
            'id',
            'title',
            'content',
            'group',
            'agreed'
        ]
        extra_kwargs = {
            'agreed': {
                'read_only': True
            },
        }

    agreed = serializers.SerializerMethodField()

    def get_agreed(self, agreement):
        return UserAgreement.objects.filter(user=self.context['request'].user, agreement=agreement).exists()

    def validate_group(self, group):
        membership = GroupMembership.objects.filter(user=self.context['request'].user, group=group).first()
        if not membership:
            raise PermissionDenied(_('You are not in this group'))
        if roles.GROUP_AGREEMENT_MANAGER not in membership.roles:
            raise PermissionDenied(_('You cannot manage agreements'))
        return group


class AgreementAgreeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agreement
        fields = [
            'id',
            'title',
            'content',
            'group',
            'agreed',
        ]
        extra_kwargs = {
            'agreed': {
                'read_only': True
            },
        }

    agreed = serializers.SerializerMethodField()

    def get_agreed(self, agreement):
        return UserAgreement.objects.filter(user=self.context['request'].user, agreement=agreement).exists()

    def update(self, instance, validated_data):
        user = self.context['request'].user
        if not UserAgreement.objects.filter(user=user, agreement=instance).exists():
            UserAgreement.objects.create(user=user, agreement=instance)
        return instance


class GroupPreviewSerializer(serializers.ModelSerializer):
    """
    Public information for all visitors
    should be readonly
    """

    class Meta:
        model = GroupModel
        fields = [
            'id',
            'name',
            'public_description',
            'address',
            'latitude',
            'longitude',
            'members',
            'protected'
        ]

    protected = serializers.SerializerMethodField()

    def get_protected(self, group):
        return group.password != ''


class GroupJoinSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupModel
        fields = ['password']

    def validate(self, attrs):
        if self.instance.password != '' and self.instance.password != attrs.get('password'):
            raise ValidationError(_('Group password is wrong'))
        return attrs

    def update(self, instance, validated_data):
        user = self.context['request'].user
        instance.add_member(user)
        return instance


class GroupLeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupModel
        fields = []

    def update(self, instance, validated_data):
        user = self.context['request'].user
        instance.remove_member(user)
        return instance


class TimezonesSerializer(serializers.Serializer):
    all_timezones = serializers.ListField(
        child=serializers.CharField(),
        read_only=True
    )


class EmptySerializer(serializers.Serializer):
    pass


class GroupMembershipAddRoleSerializer(serializers.Serializer):
    role_name = serializers.ChoiceField(
        choices=(roles.GROUP_MEMBERSHIP_MANAGER,),
        required=True,
        write_only=True
    )

    def update(self, instance, validated_data):
        role = validated_data['role_name']
        instance.add_roles([role])
        instance.save()
        return instance


class GroupMembershipRemoveRoleSerializer(serializers.Serializer):
    role_name = serializers.CharField(
        required=True,
        write_only=True
    )

    def update(self, instance, validated_data):
        role = validated_data['role_name']
        instance.remove_roles([role])
        instance.save()
        return instance
