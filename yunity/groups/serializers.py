from rest_framework import serializers

from config import settings
from yunity.groups.models import Group as GroupModel


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
            'address',
            'latitude',
            'longitude',
            'password',
            'timezone'
        ]
        extra_kwargs = {
            'members': {
                'read_only': True
            },
            'description': {
                'trim_whitespace': False,
                'max_length': settings.DESCRIPTION_MAX_LENGTH
            },
            'password': {
                'trim_whitespace': False,
                'max_length': 255
            }
        }
    timezone = serializers.CharField(default='Europe/Berlin')

    def validate(self, data):
        if 'description' not in data:
            data['description'] = ''
        return data

    def create(self, validated_data):
        member_ids = [self.context['request'].user.id, ]

        group = GroupModel.objects.create(**validated_data)
        group.members = member_ids
        group.save()

        return group


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
