from django.db.models import Aggregate

class Json_agg(Aggregate):
    "Only works in PostgreSQL"
    name = "Json_agg"
    function = "JSON_AGG"
