from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db.models import TextField, ForeignKey, ManyToManyField, EmailField, \
    BooleanField, FloatField
from django_enumfield import enum

from yunity.utils.models.abc import BaseModel
from yunity.utils.models.field import MaxLengthCharField


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, first_name=None, last_name=None, display_name=None, **extra_fields):
        """ Creates and saves a User with the given username, email and password.

        """
        email = self._validate_email(email)

        user = self.model(
            email=email,
            is_active=True,
            first_name=first_name,
            last_name=last_name,
            display_name=display_name or first_name or email,
            **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def _validate_email(self, email):
        if email is None:
            raise ValueError('The given email must be set')
        return self.normalize_email(email)

    def create_user(self, email=None, password=None, first_name=None, last_name=None, display_name=None,
                    **extra_fields):
        return self._create_user(email, password, first_name, last_name, display_name, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        return self._create_user(email, password, None, None, None, **extra_fields)


class User(AbstractBaseUser, BaseModel):
    email = EmailField(max_length=255, unique=True)
    is_active = BooleanField(default=True)
    is_staff = BooleanField(default=False)
    display_name = TextField()
    first_name = MaxLengthCharField(null=True)
    last_name = MaxLengthCharField(null=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'

    def get_full_name(self):
        return self.first_name + ' ' + self.last_name

    def get_short_name(self):
        return self.display_name


class ConversationMessage(BaseModel):
    sent_by = ForeignKey('yunity.User')
    in_conversation = ForeignKey('yunity.Conversation', related_name='messages')

    content = TextField()


class ConversationType(enum.Enum):
    ONE_ON_ONE = 0
    USER_MULTICHAT = 1


class Conversation(BaseModel):
    participants = ManyToManyField('yunity.User')
    type = enum.EnumField(ConversationType, default=ConversationType.ONE_ON_ONE)

    name = MaxLengthCharField(null=True)


class Item(BaseModel):
    user = ForeignKey('yunity.User')
    description = TextField()
    latitude = FloatField(blank=True, null=True)
    longitude = FloatField(blank=True, null=True)


class Group(BaseModel):
    name = MaxLengthCharField()
    description = TextField(null=True)
    members = ManyToManyField(User, through='yunity.GroupMembership')


class GroupMembership(BaseModel):
    user = ForeignKey(User)
    group = ForeignKey(Group)
