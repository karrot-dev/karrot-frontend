from django.db.models import OneToOneField, ManyToManyField, TextField, DateTimeField, ForeignKey
from yunity.models.utils import MaxLengthCharField, BaseModel
from yunity.utils.elasticsearch import ElasticsearchMixin
from django.contrib.postgres.fields import JSONField


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
    locations = JSONField() # [{latitude: float, longitude: float, startTime: timestring, endTime: timestring, description: text}]
    contacts = JSONField() # [{type: text, value: text}
    metadata = JSONField()

    # def to_es(self):
    #     return {
    #         "id": self.id,
    #         "name": self.name,
    #         "locations": [{"lat": loc.latitude, "lon": loc.longitude} for loc in self.location.all()],
    #     }


class Request(FeedbackTrait):
    user = ForeignKey('yunity.User', null=True)

    time = DateTimeField(null=True)
    status = MaxLengthCharField()


class Conversation(AdministrationTrait):
    pass
