# -*- coding: utf-8 -*-

from optparse import make_option


# Django
from django.core.management.base import BaseCommand

# app
from yunity.utils.elasticsearch import es_client, rebuild_index


class Command(BaseCommand):
    option_list = BaseCommand.option_list

    help = (
        'drops and rebuilds the Elasticsearch index from Postgres, check cache'
        ' keys `rebuild_index_canon` and `rebuild_index_bs` for progress'
    )

    def handle(self, *args, **options):
        es = es_client()
        rebuild_index(es)
        self.stdout.write('Index rebuilt!', ending='\n')
