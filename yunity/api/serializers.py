from django.contrib.auth import get_user_model, authenticate, login
from rest_framework import serializers
from rest_framework.fields import SerializerMethodField
from yunity.groups.models import Group as GroupModel


def category(model):
    return {
        'id': model.id,
        'name': model.name,
        'parent': model.parent_id,
    }


def item(model):
    return {
        'id': model.id,
        'user_id': model.user_id,
        'description': model.description,
        'latitude': model.latitude,
        'longitude': model.longitude
    }


class HubbedMixin():
    """ Adds extraction methods that add nested serializers interesting for hubbed models."""
    def get_members(self, Hubbed):
        members = Hubbed.hub.members.all()
        serializer = UserSerializer(instance=members, many=True)
        return serializer.data


class AuthLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        credentials = {'email': attrs.get('email'), 'password': attrs.get('password')}
        if all(credentials.values()):
            user = authenticate(**credentials)
            if user:
                if not user.is_active:
                    msg = 'User account is disabled'
                    raise serializers.ValidationError(msg)
                login(self.context['request'], user)
            else:
                msg = 'Unable to login with provided credentials.'
                raise serializers.ValidationError(msg)
        else:
            msg = 'Please provide email and password fields'
            raise serializers.ValidationError(msg)

        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'display_name', 'first_name', 'last_name', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return self.Meta.model.objects.create_user(**{x: validated_data.get(x, None) for x in self.get_fields() if x is not 'id'})


class GroupSerializer(HubbedMixin, serializers.ModelSerializer):
    members = SerializerMethodField()
    class Meta:
        model = GroupModel
        fields = ['id', 'name', 'description', 'members']