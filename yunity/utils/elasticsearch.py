
from django.conf import settings
from django.db.models.signals import post_save, post_delete

from elasticsearch import Elasticsearch, NotFoundError
from elasticsearch_dsl import Search


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
                'location': {
                    'type': 'geo_point',
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


def rebuild_index(es):
    drop_index(es)
    create_index(es)


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
    index_doc(table_name, instance.pk, instance.to_dict())


def es_delete_instance(sender, instance, **kwargs):
    table_name = instance.__class__.get_es_doc_type()
    delete_doc(table_name, instance.pk)


def connect_signals(es_models):
    for model in es_models:
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
)

connect_signals(ES_MODELS)
