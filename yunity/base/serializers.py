from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField
from yunity.users.models import User as UserModel


class UserIDSerializer(serializers.Serializer):
    id = PrimaryKeyRelatedField(write_only=True, queryset=UserModel.objects.all())
    pass