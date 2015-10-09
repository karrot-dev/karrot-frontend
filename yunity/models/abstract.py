from django.db.models import OneToOneField, ManyToManyField, TextField, DateTimeField, ForeignKey
from django.contrib.postgres.fields import JSONField

from yunity.utils.models.abc import BaseModel
from yunity.utils.models.field import MaxLengthCharField
from yunity.utils.elasticsearch import ElasticsearchMixin


class VersionTrait(BaseModel):
    _VersionTrait_to_BaseModel = OneToOneField('yunity.BaseModel', parent_link=True)

    next_version = ForeignKey('self', null=True, related_name='previous_version')


class FeedbackTrait(BaseModel):
    _FeedbackTrait_to_BaseModel = OneToOneField('yunity.BaseModel', parent_link=True)


class AdministrationTrait(BaseModel):
    _AdministrationTrait_to_BaseModel = OneToOneField('yunity.BaseModel', parent_link=True)

    administrated_by = ManyToManyField('yunity.User')


class MapItem(VersionTrait, FeedbackTrait, AdministrationTrait, ElasticsearchMixin):
    type = ForeignKey('yunity.Category')

    provenance = MaxLengthCharField()
    name = TextField()
    locations = JSONField()
    contacts = JSONField(null=True)
    metadata = JSONField(null=True)

    def to_es(self):
        return {
            "id": self.id,
            "name": self.name,
            "locations": [
                {
                    "name": loc['description'],
                    "point": {
                        "lat": loc['latitude'],
                        "lon": loc['longitude'],
                    }
                } for loc in self.locations
            ],
            "metadata": self.metadata,
        }


class Request(FeedbackTrait):
    requested_by = ForeignKey('yunity.User', null=True)

    time = DateTimeField(null=True)
    status = MaxLengthCharField()


class Conversation(AdministrationTrait):
    pass
