from django.db.models import Aggregate


class JsonAggregate(Aggregate):
    """
    Only works in PostgreSQL
    """
    name = "Json_agg"
    function = "JSON_AGG"
