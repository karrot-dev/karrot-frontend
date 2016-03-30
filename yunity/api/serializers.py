from django.contrib.auth import get_user_model
from rest_framework import serializers


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


def group_summary(model):
    return {
        'id': model.id,
        'name': model.name,
        'description': model.description,
    }


def group(model):
    return {
        'id': model.id,
        'name': model.name,
        'description': model.description,
        'members': [user(member) for member in model.hub.members.all()]
    }


def conversation(model):
    participants = [_['id'] for _ in model.participants.order_by('id').values('id')]
    newest_message = model.messages.order_by('-created_at').first()
    return {
        'id': model.id,
        'name': model.name,
        'participants': participants,
        'message': conversation_message(newest_message),
    }


def conversation_message(model):
    if model:
        return {
            'id': model.id,
            'sender': model.sent_by_id,
            'created_at': model.created_at.isoformat(),
            'content': model.content,
        }
    else:
        return None


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'display_name', 'first_name', 'last_name', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return self.Meta.model.objects.create_user(**{x: validated_data[x] for x in self.get_fields() if x is not 'id'})