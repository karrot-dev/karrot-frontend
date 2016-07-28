from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.db.models import EmailField, BooleanField, TextField, OneToOneField, CASCADE
from django_enumfield import enum

from yunity.base.base_models import BaseModel, LocationModel
from yunity.walls.models import Wall


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


class ProfileVisibility(enum.Enum):
    PRIVATE = 0
    CONNECTED_USERS = 1
    COMMUNITIES = 2
    REGISTERED_USERS = 3
    PUBLIC = 4


class User(AbstractBaseUser, BaseModel, LocationModel):
    email = EmailField(max_length=255, unique=True)
    is_active = BooleanField(default=True)
    is_staff = BooleanField(default=False)
    display_name = TextField()
    first_name = TextField(null=True)
    last_name = TextField(null=True)

    wall = OneToOneField(Wall, null=True, on_delete=CASCADE)
    profile_visibility = enum.EnumField(ProfileVisibility, default=ProfileVisibility.PRIVATE)

    objects = UserManager()

    USERNAME_FIELD = 'email'

    def get_full_name(self):
        return self.first_name + ' ' + self.last_name

    def get_short_name(self):
        return self.display_name
