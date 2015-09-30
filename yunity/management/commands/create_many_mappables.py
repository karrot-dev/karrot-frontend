# -*- coding: utf-8 -*-

import random

# Django
from django.core.management.base import BaseCommand

from yunity.models import Mappable, Category, MappableLocation, Location

# app
from yunity.utils.elasticsearch import (
    es_client, rebuild_index, disconnect_es_signals
)


class Command(BaseCommand):
    option_list = BaseCommand.option_list

    help = (
        'Create a bunch of Mappables to test search functionality'
    )

    def handle(self, *args, **options):

        lat0, lon0 = (45.666, 11.404)  # Malo, Italy

        # from yunity.tests.create_sample_data import create_sample_data

        cat1, cat2 = Category.objects.all()[:2]

        disconnect_es_signals()  # prevent automatic ES updates

        for i in range(1000):
            lat = random.gauss(lat0, 0.01)
            lon = random.gauss(lon0, 0.01)

            m = Mappable.objects.create(
                name="Item %s" % i,
            )
            loc = Location.objects.create(
                latitude=lat,
                longitude=lon
            )
            MappableLocation.objects.create(
                mappable=m,
                location=loc
            )
            m.sync_to_es()
