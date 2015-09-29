from django.db.models import ForeignKey, DateTimeField, ManyToManyField
from yunity.models.entities import User, Location, Mappable, Message
from yunity.models.utils import BaseModel, MaxLengthCharField
from yunity.utils.decorators import classproperty


class Chat(BaseModel):
    participants = ManyToManyField(User)
    messages = ManyToManyField(Message)


class MappableLocation(BaseModel):
    mappable = ForeignKey(Mappable)
    location = ForeignKey(Location)

    startTime = DateTimeField(null=True)
    endTime = DateTimeField(null=True)


class MappableResponsibility(BaseModel):
    @classproperty
    def TYPE(cls):
        return cls.create_constants('type', 'OWNER')

    @classproperty
    def STATUS(cls):
        return cls.create_constants('status', 'GRANTED', 'PENDING', 'REQUESTED')

    responsible = ForeignKey(User)
    mappable = ForeignKey(Mappable)

    status = MaxLengthCharField()
    date = DateTimeField(null=True)
    type = MaxLengthCharField()


class UserLocation(BaseModel):
    user = ForeignKey(User)
    location = ForeignKey(Location)

    type = MaxLengthCharField()


class ItemRequest(BaseModel):
    requester = ForeignKey(User)
    requested = ForeignKey(Mappable)

    feedback = MaxLengthCharField(null=True, default=None)

