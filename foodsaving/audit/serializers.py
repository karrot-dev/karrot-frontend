from rest_framework import serializers
from rest_framework.fields import SerializerMethodField

from foodsaving.audit.models import Audit, AuditTypus


class AuditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Audit
        fields = ['id', 'date', 'typus', 'group', 'store', 'users', 'payload']

    typus = SerializerMethodField()

    def get_typus(self, obj):
        return AuditTypus.name(obj.typus)
