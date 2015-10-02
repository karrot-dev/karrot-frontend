from rest_framework import viewsets, status
from rest_framework.response import Response
from yunity.models import MapItem


class SearchViewSet(viewsets.ViewSet):
    """
    Fulltext search in mapitems

    get results for fulltext search. if parameters are set, don't return results without these attributes

    :param center: longitude,latitude

    :param radius: maximum distance of results

    :param categories: restrict results to categories (OR combined)

    :param metadata: key=value pairs to query metadata (as a string to support and/or combinations)

    results with location may be sorted by distance to center

    result json: {[title, lat/lon, text, category, description, [metadata]}
    """
    queryset = MapItem.objects.all()

    def retrieve(self, request, pk=None):
        return Response(status=status.HTTP_200_OK)