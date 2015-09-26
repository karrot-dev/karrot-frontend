
from django.conf import settings

from elasticsearch import Elasticsearch, NotFoundError


def es_client(timeout=120):
    return Elasticsearch([{'host': settings.ES_HOST, 'timeout': timeout}])


def drop_index(es):
    try:
        es.indices.delete(index=settings.ES_INDEX)
    except NotFoundError:
        pass


def create_index(es):

    SHAREABLE_MAPPING = {
        "shareable": {}
    }

    es.indices.create(index=settings.ES_INDEX, ignore=400)

    es.indices.put_mapping(
        index=settings.ES_INDEX,
        doc_type='shareable',
        body=SHAREABLE_MAPPING
    )


def rebuild_index(es):
    drop_index(es)
    create_index(es)
