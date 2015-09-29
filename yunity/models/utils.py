from django.db.models import Model, CharField, Field


class MaxLengthCharField(CharField):
    def __init__(self, *args, **kwargs):
        kwargs['max_length'] = 255
        super().__init__(*args, **kwargs)


class BaseModel(Model):
    class Meta:
        abstract = True

    def _get_explicit_field_names(self):
        return [field.name for field in self._meta.get_fields()
                if isinstance(field, Field) and field.name != 'id']

    def to_dict(self):
        fields = self._get_explicit_field_names()
        return {field: getattr(self, field) for field in fields}

    def __repr__(self):
        model = str(self.__class__.__name__)
        columns = ', '.join('{}="{}"'.format(field, value) for field, value in self.to_dict().items())
        return '{}({})'.format(model, columns)
