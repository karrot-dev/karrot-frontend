from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField

class UserIDSerializer(serializers.Serializer):
    id = PrimaryKeyRelatedField(write_only=True, queryset=get_user_model().objects.all())
    pass