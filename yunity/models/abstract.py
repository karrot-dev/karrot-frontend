from django.db.models import OneToOneField, ManyToManyField, TextField, DateTimeField, ForeignKey
from yunity.models.utils import MaxLengthCharField, BaseModel
from yunity.utils.elasticsearch import ElasticsearchMixin


class VersionTrait(BaseModel):
    _VersionTrait_to_BaseModel = OneToOneField('yunity.BaseModel', parent_link=True)

    nextVersion = ForeignKey('self', null=True, related_name='previousVersion')


class FeedbackTrait(BaseModel):
    _FeedbackTrait_to_BaseModel = OneToOneField('yunity.BaseModel', parent_link=True)


class AdministrationTrait(BaseModel):
    _AdministrationTrait_to_BaseModel = OneToOneField('yunity.BaseModel', parent_link=True)

    administratedBy = ManyToManyField('yunity.User')


class MapItem(VersionTrait, FeedbackTrait, AdministrationTrait, ElasticsearchMixin):
    category = ForeignKey('yunity.Category')
    contact = ManyToManyField('yunity.Contact')
    location = ManyToManyField('yunity.Location', through='yunity.MappableLocation')

    provenance = MaxLengthCharField()
    name = TextField()
    # TODO: add metadata::jsonb column

    def to_es(self):
        return {
            "id": self.id,
            "name": self.name,
            "locations": [{"lat": loc.latitude, "lon": loc.longitude} for loc in self.location.all()],
        }


class Request(FeedbackTrait):
    user = ForeignKey('yunity.User', null=True)

    time = DateTimeField(null=True)
    status = MaxLengthCharField()


class Conversation(AdministrationTrait):
    messages = ManyToManyField('yunity.Message')
