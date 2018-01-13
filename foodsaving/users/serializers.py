from django.contrib.auth import get_user_model
from rest_framework import serializers
from versatileimagefield.serializers import VersatileImageFieldSerializer


class UserSerializer(serializers.ModelSerializer):

    photo_urls = VersatileImageFieldSerializer(
        sizes='user_profile',
        source='photo'
    )

    class Meta:
        model = get_user_model()
        fields = ['id', 'display_name', 'email', 'address', 'latitude', 'longitude', 'description', 'photo_urls']
