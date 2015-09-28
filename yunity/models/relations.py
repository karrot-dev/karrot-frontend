from django.db.models import CharField, TextField, ForeignKey, FloatField, DateTimeField, ManyToManyField
from yunity.models.entities import User, Location, Mappable, Contact
from yunity.models.utils import BaseModel, MaxLengthCharField


class MappableLocation(BaseModel):
    mappable = ForeignKey(Mappable)
    location = ForeignKey(Location)
    startTime = DateTimeField()
    endTime = DateTimeField()


class MappableResponsibility(BaseModel):
    responsible = ForeignKey(User)
    mappable = ForeignKey(Mappable)
    status = MaxLengthCharField()
    date = DateTimeField()
    type = MaxLengthCharField()


class UserContact(BaseModel):
    user = ForeignKey(User)
    contact = ForeignKey(Contact)
    type = MaxLengthCharField()


class UserLocation(BaseModel):
    user = ForeignKey(User)
    location = ForeignKey(Location)
    type = MaxLengthCharField()


class ItemRequest(BaseModel):
    requester = ForeignKey(User)
    requested = ForeignKey(Mappable)
    feedback = MaxLengthCharField()

