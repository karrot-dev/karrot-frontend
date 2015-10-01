from django.contrib.auth.models import BaseUserManager
from django.db.models import Model, CharField, Field, AutoField
from django.db.models.fields.related import RelatedField
from django.utils import timezone


class MaxLengthCharField(CharField):
    def __init__(self, *args, **kwargs):
        kwargs['max_length'] = 255
        super().__init__(*args, **kwargs)


class BaseModel(Model):
    id = AutoField(primary_key=True)

    def _get_explicit_field_names(self):
        return [field.name for field in self._meta.get_fields()
                if isinstance(field, Field) and not isinstance(field, RelatedField)]

    def to_dict(self):
        fields = self._get_explicit_field_names()
        return {field: getattr(self, field) for field in fields if getattr(self, field)}

    def __repr__(self):
        model = str(self.__class__.__name__)
        columns = ', '.join('{}="{}"'.format(field, value) for field, value in self.to_dict().items())
        return '{}({})'.format(model, columns)


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """ Creates and saves a User with the given username, email and password.

        """
        now = timezone.now()
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, is_active=True, date_joined=now, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email=None, password=None, **extra_fields):
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        return self._create_user(email, password, **extra_fields)
