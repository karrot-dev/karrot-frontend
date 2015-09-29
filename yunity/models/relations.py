from django.db.models import ForeignKey, DateTimeField
from yunity.models.entities import User, Location, Mappable, Contact
from yunity.models.utils import BaseModel, MaxLengthCharField


class MappableLocation(BaseModel):
    mappable = ForeignKey(Mappable)
    location = ForeignKey(Location)
    startTime = DateTimeField(null=True)
    endTime = DateTimeField(null=True)


class MappableResponsibility(BaseModel):
    responsible = ForeignKey(User)
    mappable = ForeignKey(Mappable)
    status = MaxLengthCharField()
    date = DateTimeField(null=True)
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
    feedback = MaxLengthCharField(null=True, default=None)

