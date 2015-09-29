from django.db.models import TextField, ForeignKey, FloatField, DateTimeField, ManyToManyField
from yunity.models.utils import BaseModel, MaxLengthCharField
from yunity.utils.decorators import classproperty
from yunity.utils.elasticsearch import ElasticsearchMixin


class Versionable(BaseModel):
    pass


class Metadata(BaseModel):
    key = MaxLengthCharField()
    value = TextField()


class Category(BaseModel):
    parent = ForeignKey('yunity.Category', null=True, related_name='children')

    name = MaxLengthCharField()


class Contact(BaseModel):
    @classproperty
    def TYPE(cls):
        return cls.create_constants('type', 'EMAIL', 'DIRECT')

    value = MaxLengthCharField()
    type = MaxLengthCharField()


class Location(BaseModel):
    latitude = FloatField()
    longitude = FloatField()


class User(BaseModel):
    contact = ManyToManyField(Contact)
    location = ManyToManyField(Location, through='yunity.UserLocation')

    name = TextField()


class Message(BaseModel):
    @classproperty
    def TYPE(cls):
        return cls.create_constants('type', 'TEXT', 'PICTURE')

    sender = ForeignKey(User)

    content = TextField()
    type = MaxLengthCharField()
    createdAt = DateTimeField(auto_now=True)


class Mappable(Versionable, ElasticsearchMixin):
    category = ManyToManyField(Category)
    metadata = ManyToManyField(Metadata)
    wall = ManyToManyField(Message)
    contact = ManyToManyField(Contact)
    location = ManyToManyField(Location, through='yunity.MappableLocation')
    responsible = ManyToManyField(User, through='yunity.MappableResponsibility')

    provenance = MaxLengthCharField()
    name = TextField()

    def to_es(self):
        d = self.to_dict()
        d['location'] = {
            'latitude': d['latitude'],
            'longitude': d['longitude'],
        }
        return d


class Event(BaseModel):
    initiator = ForeignKey(User)
    target = ForeignKey(Versionable)

    type = MaxLengthCharField()
    time = DateTimeField(auto_now=True)
