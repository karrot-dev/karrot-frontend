import logging

from django.views.generic import View

from yunity.models import Mappable
from yunity.utils.api import ApiBase
from yunity.utils.elasticsearch import es_search

# Get an instance of a logger
logger = logging.getLogger(__name__)


class SearchMappableView(ApiBase, View):

    def get(self, request):
        hits = [m.to_dict() for m in Mappable.es_search().execute().hits]
        return self.json_response(hits)
