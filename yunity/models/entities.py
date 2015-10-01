from django.contrib.auth.models import AbstractBaseUser
from django.db.models import TextField, ForeignKey, FloatField, DateTimeField, ManyToManyField, \
    EmailField, CharField
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


class User(BaseModel, AbstractBaseUser):
    email = EmailField(max_length=64)
    contact = ManyToManyField(Contact)
    location = ManyToManyField(Location, through='yunity.UserLocation')
    name = TextField()

    USERNAME_FIELD = 'yunity.User.email'



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
        return {
            "id": self.id,
            "name": self.name,
            "locations": [
                {
                    "lat": loc.latitude,
                    "lon": loc.longitude,
                }
                for loc in self.location.all()
            ]
        }


class Event(BaseModel):
    initiator = ForeignKey(User)
    target = ForeignKey(Versionable)

    type = MaxLengthCharField()
    time = DateTimeField(auto_now=True)
