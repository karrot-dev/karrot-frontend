from django.db.models import Model, AutoField, Field, DateTimeField, CharField
from django.db.models.fields.related import RelatedField
from django.utils import timezone


class BaseModel(Model):
    class Meta:
        abstract = True

    id = AutoField(primary_key=True)
    created_at = DateTimeField(default=timezone.now)

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
        columns = ', '.join('{}="{}"'.format(field, value) for field, value in self.to_dict().items())
        return '{}({})'.format(model, columns)


class MaxLengthCharField(CharField):
    def __init__(self, *args, **kwargs):
        kwargs['max_length'] = 255
        super().__init__(*args, **kwargs)


