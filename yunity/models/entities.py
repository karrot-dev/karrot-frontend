from django.db.models import TextField, ForeignKey, FloatField, DateTimeField, ManyToManyField
from yunity.models.utils import BaseModel, MaxLengthCharField
from yunity.utils.decorators import classproperty


class Versionable(BaseModel):
    pass


class Metadata(BaseModel):
    key = MaxLengthCharField()
    value = TextField()


class Category(BaseModel):
    name = MaxLengthCharField()
    parent = ForeignKey('yunity.Category', null=True, related_name='children')


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
    name = TextField()
    contact = ManyToManyField(Contact)
    location = ManyToManyField(Location, null=True, through='yunity.UserLocation')


class Message(BaseModel):
    @classproperty
    def TYPE(cls):
        return cls.create_constants('type', 'TEXT')

    content = TextField()
    type = MaxLengthCharField()
    createdAt = DateTimeField(auto_now=True)


class Mappable(Versionable):
    provenance = MaxLengthCharField()
    name = TextField()
    metadata = ForeignKey(Metadata, null=True)
    category = ForeignKey(Category)
    location = ManyToManyField(Location, through='yunity.MappableLocation')
    contact = ManyToManyField(Contact)
    wall = ManyToManyField(Message, null=True)
    responsible = ManyToManyField(User, through='yunity.MappableResponsibility')


class Event(BaseModel):
    type = MaxLengthCharField()
    time = DateTimeField(auto_now=True)
    initiator = ForeignKey(User)
    target = ForeignKey(Versionable)
