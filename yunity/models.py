from datetime import datetime

from django.db import models
from django.db.models.signals import post_save, post_delete

from yunity.utils.elasticsearch import index_doc, delete_doc


class CreatedModified(object):

    created = models.DateTimeField(default=datetime.now)
    modified = models.DateTimeField(auto_now=True)



class BaseModel(models.Model):

    class Meta:
        abstract = True

    @classmethod
    def get_es_doc_type(cls):
        return cls.__name__.lower()


class Category(BaseModel):
    name = models.CharField(max_length=128)
    parent = models.ForeignKey(
        'yunity.Category',
        null=True,
        related_name='children',
    )

    def to_dict(self):
        return {
            "name": self.name,
            "parent_id": self.parent_id,
        }


class Shareable(BaseModel, CreatedModified):

    description = models.TextField()
    category = models.ForeignKey(Category)
    latitude = models.FloatField(null=True)
    longitude = models.FloatField(null=True)

    def to_dict(self):
        return {
            "description": self.description,
            "category_id": self.category_id,
            "latitude": self.latitude,
            "longitude": self.longitude,
        }


def es_index_instance(sender, instance, **kwargs):
    table_name = instance.__class__.get_es_doc_type()
    index_doc(table_name, instance.pk, instance.to_dict())


def es_delete_instance(sender, instance, **kwargs):
    table_name = instance.__class__.get_es_doc_type()
    delete_doc(table_name, instance.pk)


def connect_signals(models):
    for model in models:
        post_save.connect(
            es_index_instance,
            sender=model,
            dispatch_uid="update_%s" % model.get_es_doc_type()
        )
        post_delete.connect(
            es_delete_instance,
            sender=model,
            dispatch_uid="delete_%s" % model.get_es_doc_type()
        )

ES_MODELS = (
    Category,
    Shareable
)

connect_signals(ES_MODELS)
