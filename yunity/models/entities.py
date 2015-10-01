
from django.contrib.auth.models import AbstractBaseUser, \
    BaseUserManager
from django.db.models import TextField, ForeignKey, FloatField, DateTimeField, ManyToManyField, \
    EmailField, CharField, BooleanField
from django.utils import timezone
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


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """
        Creates and saves a User with the given username, email and password.
        """
        now = timezone.now()
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email,
                          is_active=True,
                          date_joined=now, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email=None, password=None, **extra_fields):
        return self._create_user(email, password,
                                 **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        return self._create_user(email, password,
                                 **extra_fields)

class User(BaseModel, AbstractBaseUser):
    email = EmailField(max_length=64, unique=True)
    is_active = BooleanField(default=True)
    is_staff = BooleanField(default=False)
    date_joined = DateTimeField(default=timezone.now)

    contact = ManyToManyField(Contact)
    location = ManyToManyField(Location, through='yunity.UserLocation')
    name = TextField()

    objects = UserManager()

    USERNAME_FIELD = 'email'

    def get_full_name(self):
        return self.name

    def get_short_name(self):
        return self.name




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
