import abc

from django.conf import settings
from django.db.models.signals import post_save, post_delete

from elasticsearch import Elasticsearch, NotFoundError
from elasticsearch_dsl import Search


class ElasticsearchMixin(object):

    @abc.abstractmethod
    def to_es(self):
        "Generate Elasticsearch representation"
        raise NotImplementedError

    @classmethod
    def get_es_doc_type(cls):
        return cls.__name__.lower()

    @classmethod
    def es_search(cls):
        return es_search(cls.get_es_doc_type())


def es_client(timeout=120):
    return Elasticsearch([{'host': settings.ES_HOST, 'timeout': timeout}])


def es_search(doc_type, es=None):
    if not es:
        es = es_client()
    return Search(
        using=es,
        index=settings.ES_INDEX,
        doc_type=doc_type,
    )


def drop_index(es):
    try:
        es.indices.delete(index=settings.ES_INDEX)
    except NotFoundError:
        pass


def create_index(es):

    from yunity.models import Mappable, Category

    MAPPABLE_MAPPING = {
        Mappable.get_es_doc_type(): {
            'properties': {
                'locations': {
                    'type': 'geo_point',
                    'index_name': 'location',
                    'doc_values': True,
                }
            }
        }
    }

    es.indices.create(index=settings.ES_INDEX, ignore=400)

    es.indices.put_mapping(
        index=settings.ES_INDEX,
        doc_type=Mappable.get_es_doc_type(),
        body=MAPPABLE_MAPPING
    )

def get_es_indexed_models():

    from yunity.models import Mappable

    return (
        Mappable,
    )


def index_db(models):
    for model in models:
        for o in model.objects.all():
            index_doc(model.get_es_doc_type(), o.pk, o.to_es())


def rebuild_index(es):
    "Drop, recreate, and reindex all models"

    drop_index(es)
    create_index(es)
    index_db(get_es_indexed_models())


def index_doc(doc_type, pk, body):
    es_client().index(
        index=settings.ES_INDEX,
        doc_type=doc_type,
        id=pk,
        body=body,
    )


def delete_doc(doc_type, pk):
    es_client().delete(
        index=settings.ES_INDEX,
        doc_type=doc_type,
        id=pk
    )


def es_index_instance(sender, instance, **kwargs):
    table_name = instance.__class__.get_es_doc_type()
    index_doc(table_name, instance.pk, instance.to_es())


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

# connect_signals()
