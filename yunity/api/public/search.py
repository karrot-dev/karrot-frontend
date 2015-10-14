from collections import defaultdict
import logging

from django.conf.urls import url
from django.views.generic import View

from yunity.utils.api.abc import ApiBase
from yunity.elasticsearch.core import es_search

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

        params = request.GET.dict()

        esq = es_search()

        q       = params.pop("q", None)
        nearest = params.pop("nearest", None)
        radius  = params.pop("radius", "100km")

        if q:
            esq = esq.query("simple_query_string", query=q, fields=["_all"])

        if nearest:
            
            lat, lon = map(float, nearest.split(','))

            # more weighting is given to closer things
            # based on https://www.elastic.co/guide/en/elasticsearch/guide/current/decay-functions.html

            esq = esq.query('function_score', functions=[
                {
                    "gauss": {
                        "locations.point": {
                          "origin": { "lat": lat, "lon": lon },
                          "offset": "0",
                          "scale":  radius # something at this radius gets
                                           # 50% score of something at the origin
                        }
                    },
                    "weight": 1
                }
            ])

        # collects all the remaining params as metadata filters
        # TODO: not all metadata should be filterable (some may be private/admin)

        for key, value in params.items():
            esq = esq.filter("term", **{ "metadata.{}".format(key) : value })
            print('p', key, value)

        # faceting on doc type
        esq.aggs.bucket("doc_type", "terms", field="_type")

        # TODO: also facet on metadata values...

        response = esq.execute()

        hits = response.hits

        for hit in hits:
            d = hit.to_dict()
            d["_meta"] = { k: hit.meta.to_dict()[k] for k in ('score', 'doc_type')}
            groups[hit.meta['doc_type']].append(d)

        for category, group in groups.items():
            results.append({
                "doc_type": category,  # TODO: use category name/slug/id
                "results": group,
                "total": len(group)  # TODO: get real total via faceting
            })

        return self.success({
            "result_groups": results,
            "aggregations": response.aggregations.to_dict()

            # these are useful if you want to see the raw query/results
            #"_query": esq.to_dict(),
            #"_result": response.to_dict()

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
                "_meta": {
                    "doc_type": hit.meta.doc_type,
                },
                "locations": [
                    {
                        "latitude": loc['point']['lat'],
                        "longitude": loc['point']['lon'],
                    }
                    for loc in hit.locations
                ],
            }

        params = request.GET.dict()

        esq = es_search()

        q = params.pop("q", None)

        if q:
            esq = esq.query("simple_query_string", query=q, fields=["_all"])

        # TODO: filter out unnecessary fields
        # esq = esq.fields()  

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
