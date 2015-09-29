import logging

from django.views.generic import View

from yunity.models import Mappable
from yunity.utils.api import ApiBase
from yunity.utils.elasticsearch import es_search

# Get an instance of a logger
logger = logging.getLogger(__name__)


def filter_es_geo_distance(esq, lat, lon, radius_km):
    geo_params = {
        'distance': "%skm" % radius_km,
        'location': {
            'lat': lat,
            'lon': lon,
        }
    }
    return esq.filter('geo_distance', **geo_params)


class SearchMappableView(ApiBase, View):

    def get(self, request):
        location_centroid_lat = request.GET.get('location_centroid_lat')
        location_centroid_lon = request.GET.get('location_centroid_lon')
        location_radius_km = request.GET.get('location_radius_km')

        esq = Mappable.es_search()
        if location_centroid_lat and location_centroid_lon and location_radius_km:
            esq = filter_es_geo_distance(
                esq,
                location_centroid_lat,
                location_centroid_lon,
                location_radius_km
            )

        hits = [m.to_dict() for m in esq.execute().hits]
        return self.json_response(hits)
