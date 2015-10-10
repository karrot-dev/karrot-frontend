from abc import abstractmethod

from yunity.elasticsearch.core import index_doc


class ElasticsearchMixin(object):
    """
    Mixin for facilitating Elasticsearch indexing of a Model.
    """

    def sync_to_es(self):
        index_doc(
            self.get_es_type(),
            self.pk,
            self.to_es()
        )

    @abstractmethod
    def to_es(self):
        """Generate Elasticsearch representation"""
        raise NotImplementedError

    @abstractmethod
    def get_es_type(self):
        """
        Defines the doc type used in Elasticsearch for this model
        :return: string
        """
        raise NotImplementedError

    @classmethod
    def es_search(cls):
        """
        :return: ES Search instance
        """
        return NotImplementedError
