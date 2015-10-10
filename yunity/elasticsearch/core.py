from logging import getLogger

from django.conf import settings
from django.db.models.signals import post_save, post_delete
from elasticsearch import Elasticsearch
from elasticsearch.exceptions import NotFoundError
from elasticsearch_dsl import Search

from yunity.elasticsearch.mappings import valuable_mapping, opportunity_mapping

logger = getLogger(__name__)


def es_client(timeout=120):
    return Elasticsearch([{'host': settings.ES_HOST, 'timeout': timeout}])


def es_search(doc_type=None, es=None):
    """
    Easily create a Search instance, the starting point of any self-respecting
    Elasticsearch query
    :param doc_type: string
    :param es: optional Elasticsearch client object, if missing, one will be
    provided
    :return: ES Search instance
    """
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

    from yunity.models import Category

    es.indices.create(index=settings.ES_INDEX, body={
        "mappings":{

            # see:
            #   https://www.elastic.co/guide/en/elasticsearch/guide/current/default-mapping.html
            #   https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-dynamic-mapping.html

            "_default_": {

                # TODO: eventually probably need to turn off dynamic mappings
                # "dynamic": False,

                "properties": {
                    "id": {
                        "type": "integer",
                        "store": True
                    },

                    # TODO: see about making these custom dynamic mapping
                    # see https://www.elastic.co/guide/en/elasticsearch/guide/current/custom-dynamic-mapping.html

                    'locations': {
                        'properties': {
                            'point': {
                                'type': 'geo_point',
                                'doc_values': True,
                            }
                        }
                    }
                }
            }
        }
    }, ignore=400)

    for category in Category.objects.all():
        valuable_doc_type = get_es_type('valuable', category.name)
        opportunity_doc_type = get_es_type('opportunity', category.name)

        val_mapping = valuable_mapping(valuable_doc_type)
        opp_mapping = opportunity_mapping(opportunity_doc_type)

        if val_mapping:
            es.indices.put_mapping(
                index=settings.ES_INDEX,
                doc_type=valuable_doc_type,
                body=val_mapping
            )

        if opp_mapping:
            es.indices.put_mapping(
                index=settings.ES_INDEX,
                doc_type=opportunity_doc_type,
                body=opp_mapping
            )


def get_es_type(base, category_name):
    return "{}::{}".format(base, category_name)


def get_es_indexed_models():

    from yunity.models import Opportunity, Valuable

    return (
        Valuable,
        Opportunity,
    )


def index_db(models):
    for model in models:
        for o in model.objects.all():
            index_doc(o.get_es_type(), o.pk, o.to_es())


def rebuild_index(es):
    """Drop, recreate, and reindex all models"""

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
    table_name = instance.get_es_type()
    index_doc(table_name, instance.pk, instance.to_es())


def es_delete_instance(sender, instance, **kwargs):
    table_name = instance.get_es_type()
    try:
        delete_doc(table_name, instance.pk)
    except NotFoundError:
        logger.warn(
            'tried to delete non-existent %s %s from elasticsearch' % (
                table_name, instance.pk
            )
        )


def connect_es_signals():

    models = get_es_indexed_models()

    for model in models:
        post_save.connect(
            es_index_instance,
            sender=model,
            dispatch_uid="update_%s" % model.__class__
        )
        post_delete.connect(
            es_delete_instance,
            sender=model,
            dispatch_uid="delete_%s" % model.__class__
        )


def disconnect_es_signals():

    models = get_es_indexed_models()

    for model in models:
        post_save.disconnect(
            es_index_instance,
            sender=model
        )
        post_delete.connect(
            es_delete_instance,
            sender=model
        )
