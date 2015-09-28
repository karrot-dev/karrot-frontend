# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    replaces = [('yunity', '0001_initial'), ('yunity', '0002_auto_20150928_0929')]

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, verbose_name='ID', primary_key=True)),
                ('name', models.CharField(max_length=128)),
                ('parent', models.ForeignKey(related_name='children', to='yunity.Category', null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Mappable',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, verbose_name='ID', primary_key=True)),
                ('created', models.DateTimeField(default=datetime.datetime.now)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('description', models.TextField()),
                ('latitude', models.FloatField(null=True)),
                ('longitude', models.FloatField(null=True)),
                ('category', models.ForeignKey(to='yunity.Category')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
