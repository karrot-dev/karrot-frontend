from django.db import models

from django.db import models


class CreatedModified(models.Model):

    created = models.DateTimeField(default=datetime.now)
    modified = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Category(models.Model):
    name = models.CharField(max_length=128)
    parent = models.ForeignKey(
        'yunity.Category',
        null=True,
        related_name='children',
    )


class Shareable(CreatedModified):

    description = models.TextField()
    category = models.ForeignKey(Category)
    latitude = models.FloatField(null=True)
    longitude = models.FloatField(null=True)

