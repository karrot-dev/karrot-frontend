from django.conf.urls import url
from django.http import HttpRequest
from django.views.generic import View

import logging

from django.views.generic import View

from yunity.api.utils import ApiBase
from yunity.models import MapItem

logger = logging.getLogger(__name__)


def filter_es_geo_distance(esq, lat, lon, radius_km):
    """ Add a distance filter to a search query
    :param esq: ES Search instance
    :param lat: latitude
    :param lon: longitude
    :param radius_km: radius in kilometers
    :return: ES Search instance
    """
    geo_params = {
        'distance': "%skm" % radius_km,
        'mappable.location': {
            'lat': lat,
            'lon': lon,
        }
    }
    return esq.filter('geo_distance', **geo_params)


def sort_es_geo_distance(esq, lat, lon):
    """ Add a distance sort to a search query
    :param esq: ES Search instance
    :param lat: latitude
    :param lon: longitude
    :return: ES Search instance
    """
    return esq.sort({'_geo_distance': {
        "location": {
            "lat": lat,
            "lon": lon,
        },
        "order": "desc",
        "unit": "km",
        "distance_type": "plane",
    }})


class Search(ApiBase, View):
    """
    Used to power e.g. the global search bar
    """
    def get(self, request):
        raise NotImplementedError


class SearchMap(ApiBase, View):

    def get(self, request):
        """
        A simple starting implementation for search.
        TODO:
            - accept more parameters
            - scoring on multiple factors
            - decide on what id to use (MapItem, or [type]:[id], etc.)
            - and much more...
        """
        term = request.GET.get('q', '')
        lat = float(request.GET.get('lat', 0))
        lon = float(request.GET.get('lon', 0))
        radius = float(request.GET.get('radius_km', 0))

        esq = MapItem.es_search()
        if lat and lon:
            esq = sort_es_geo_distance(esq, lat, lon)
            if radius:
                esq = filter_es_geo_distance(esq, lat, lon, radius)

        hits = [m.to_dict() for m in esq.execute().hits]
        return self.success(hits)



class SearchDetail(ApiBase, View):
    """
    Primarily used to get more information about a single item,
    e.g. to display more information on map popover that was returned
    by SearcMap
    """

    def get(self, request):
        raise NotImplementedError



urlpatterns = [
    url(r'^/$', Search.as_view()),
    url(r'^/map/?$', SearchMap.as_view()),
    url(r'^/detail/{pk}?$'.format(pk="pattern (TODO)"), SearchDetail.as_view()),
]
