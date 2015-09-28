from django.db.models import Model, CharField


class ElasticsearchMixin(object):
    @classmethod
    def get_es_doc_type(cls):
        return cls.__name__.lower()


class MaxLengthCharField(CharField):
    def __init__(self, *args, **kwargs):
        kwargs['max_length'] = 255
        super().__init__(*args, **kwargs)


class BaseModel(Model):
    class Meta:
        abstract = True

    def to_dict(self):
        return {}

    def __repr__(self):
        return 'Model({})'.format(repr(self.to_dict()))
