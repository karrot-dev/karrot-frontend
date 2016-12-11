from rest_framework import serializers

from config import settings
from yunity.groups.models import Group as GroupModel


class GroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = GroupModel
        fields = ['id', 'name', 'description', 'members', 'address', 'latitude', 'longitude']
        extra_kwargs = {
            'members': {'read_only': True},
            'description': {'trim_whitespace': False,
                            'max_length': settings.DESCRIPTION_MAX_LENGTH}
        }

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
