from django.db.models import Model, AutoField, Field, DateTimeField, TextField, FloatField
from django.db.models.fields.related import RelatedField, ForeignKey
from django.utils import timezone

# from foodsaving.conversations.models import Conversation


class NicelyFormattedModel(Model):

    class Meta:
        abstract = True

    def _get_explicit_field_names(self):
        """
        :rtype: list
        """
        return [field.name for field in self._meta.get_fields()
                if isinstance(field, Field) and not isinstance(field, RelatedField)]

    def to_dict(self):
        """
        :rtype: dict
        """
        fields = self._get_explicit_field_names()
        return {field: getattr(self, field) for field in fields if getattr(self, field)}

    def __repr__(self):
        model = str(self.__class__.__name__)
        columns = ', '.join('{}="{}"'.format(field, value)
                            for field, value in self.to_dict().items())
        return '{}({})'.format(model, columns)


class BaseModel(NicelyFormattedModel):

    class Meta:
        abstract = True

    id = AutoField(primary_key=True)
    created_at = DateTimeField(default=timezone.now)


class LocationModel(Model):
    class Meta:
        abstract = True

    address = TextField(null=True)
    latitude = FloatField(null=True)
    longitude = FloatField(null=True)