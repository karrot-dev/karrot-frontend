from django.db.models import Model, AutoField, Field
from django.db.models.fields.related import RelatedField


class BaseModel(Model):
    id = AutoField(primary_key=True)

    def _get_explicit_field_names(self):
        return [field.name for field in self._meta.get_fields()
                if isinstance(field, Field) and not isinstance(field, RelatedField)]

    def to_dict(self):
        fields = self._get_explicit_field_names()
        return {field: getattr(self, field) for field in fields if getattr(self, field)}

    def __repr__(self):
        model = str(self.__class__.__name__)
        columns = ', '.join('{}="{}"'.format(field, value) for field, value in self.to_dict().items())
        return '{}({})'.format(model, columns)