from collections import defaultdict
import logging

from django.conf.urls import url
from django.views.generic import View

from yunity.utils.api import ApiBase
from yunity.models import MapItem
from yunity.utils.elasticsearch import es_search


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
        'locations.point': {
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
        "locations.point": {
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
        """
        TODO:
            - use intelligent ES query to facet across categories instead
            of grouping with Python
        """
        groups = defaultdict(list)
        results = []

        hits = es_search().execute().hits  # TODO: change
        for h in hits:
            groups[h.meta['doc_type']].append(h.to_dict())

        for category, group in groups.items():
            results.append({
                "doc_type": category,  # TODO: use category name/slug/id
                "results": group,
                "total": len(group)  # TODO: get real total via faceting
            })

        return self.success({
            "result_groups": results
        })


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

        def _serialize(hit):
            """
            TODO: Ideally elasticsearch will handle this itself
            """
            return {
                "id": hit.id,
                "doc_type": hit.meta['doc_type'],  # TODO: replace with name/id
                "locations": [
                    {
                        "latitude": loc['point']['lat'],
                        "longitude": loc['point']['lon'],
                    } for loc in hit.locations
                ]
            }

        term = request.GET.get('q', '')  # TODO: hook this up somehow
        lat = float(request.GET.get('lat', 0))
        lon = float(request.GET.get('lon', 0))
        radius = float(request.GET.get('radius_km', 0))

        esq = es_search()
        esq = esq.fields()  # TODO: filter out unnecessary fields
        if lat and lon:
            esq = sort_es_geo_distance(esq, lat, lon)
            if radius:
                # TODO: this doesn't work
                esq = filter_es_geo_distance(esq, lat, lon, radius)

        hits = [_serialize(m) for m in esq.execute().hits]

        return self.success({
            "results": hits
        })


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
