from datetime import datetime

from django.db import models
from django.db.models.signals import post_save, post_delete

from django.conf import settings

from yunity.utils.elasticsearch import index_doc, delete_doc


class BaseModel(models.Model):

    class Meta:
        abstract = True

    @classmethod
    def get_es_doc_type(cls):
        return cls.__name__.lower()

    def to_dict(self):
        return {}

    def __repr__(self):
        return 'Model({})'.format(repr(self.to_dict()))


class CreatedModified(BaseModel):
    "Adds created/modified fields to a model, automatically populated"

    created = models.DateTimeField(default=datetime.now)
    modified = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    def to_dict(self):
        d = BaseModel.to_dict(self)
        d.update({
            'created': self.created,
            'modified': self.modified,
        })
        return d


class Category(BaseModel):

    name = models.CharField(max_length=128)
    parent = models.ForeignKey(
        'yunity.Category',
        null=True,
        related_name='children',
    )

    def to_dict(self):
        d = BaseModel.to_dict(self)
        d.update({
            "name": self.name,
            "parent_id": self.parent_id,
        })
        return d


class Mappable(CreatedModified):

    description = models.TextField()
    category = models.ForeignKey(Category)
    latitude = models.FloatField(null=True)
    longitude = models.FloatField(null=True)

    def to_dict(self):
        d = CreatedModified.to_dict(self)
        d.update({
            "description": self.description,
            "category_id": self.category_id,
            "latitude": self.latitude,
            "longitude": self.longitude,
        })
        return d

    def to_es(self):
        d = self.to_dict()
        d['location'] = {
            "latitude": self.latitude,
            "longitude": self.longitude,
        }
        return d

class Chat(BaseModel):
    "Chat between two or more users"

    members = models.ManyToManyField(settings.AUTH_USER_MODEL) # store many userids


class ChatMessage(BaseModel):
    "Chat messages belonging to a specific chat"

    timestamp = models.DateTimeField()
    chat = models.ForeignKey(Chat)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL)
    type = models.CharField(max_length=100)
    content = models.TextField()


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
    Mappable
)

connect_signals(ES_MODELS)

