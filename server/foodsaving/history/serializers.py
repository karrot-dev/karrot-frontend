from rest_framework import serializers
from rest_framework.fields import SerializerMethodField

from foodsaving.history.models import History, HistoryTypus


class HistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = History
        fields = ['id', 'date', 'typus', 'group', 'store', 'users', 'payload']

    typus = SerializerMethodField()

    def get_typus(self, obj):
        return HistoryTypus.name(obj.typus)
