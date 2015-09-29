from collections import namedtuple
from django.db.models import Model, CharField, Field


class MaxLengthCharField(CharField):
    def __init__(self, *args, **kwargs):
        kwargs['max_length'] = 255
        super().__init__(*args, **kwargs)


class BaseModel(Model):
    class Meta:
        abstract = True

    @classmethod
    def create_constants(cls, column_name, *values):
        class_name = cls.__class__.__name__
        namespace = '{}_{}'.format(class_name, column_name)
        constant_factory = namedtuple(namespace, values)
        constant_values = ['{}.{}'.format(namespace, value) for value in values]
        return constant_factory(*constant_values)

    def _get_explicit_field_names(self):
        return [field.name for field in self._meta.get_fields()
                if isinstance(field, Field) and field.name != 'id']

    def to_dict(self):
        fields = self._get_explicit_field_names()
        return {
            field: getattr(self, field) for field in fields
            if getattr(self, field)}

    def __repr__(self):
        model = str(self.__class__.__name__)
        columns = ', '.join('{}="{}"'.format(field, value) for field, value in self.to_dict().items())
        return '{}({})'.format(model, columns)
