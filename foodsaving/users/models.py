from datetime import timedelta

from anymail.message import AnymailMessage
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager

from django.db.models import EmailField, BooleanField, TextField, CharField, DateTimeField
from django.utils import crypto
from django.utils import timezone
from django.utils.translation import ugettext as _

from config import settings
from foodsaving.base.base_models import BaseModel, LocationModel

MAX_DISPLAY_NAME_LENGTH = 80


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, display_name=None, is_active=True, **extra_fields):
        """ Creates and saves a User with the given username, email and password.

        """
        email = self._validate_email(email)
        extra_fields['unverified_email'] = email

        user = self.model(
            email=email,
            is_active=is_active,
            display_name=display_name,
            **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        user.send_verification_code()
        return user

    def _validate_email(self, email):
        if email is None:
            raise ValueError('The given email must be set')
        return self.normalize_email(email)

    def create_user(self, email=None, password=None, display_name=None,
                    **extra_fields):
        return self._create_user(email, password, display_name, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        user = self._create_user(email, password, None, **extra_fields)
        user.is_staff = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, BaseModel, LocationModel):
    email = EmailField(unique=True, null=True)
    is_active = BooleanField(default=True)
    is_staff = BooleanField(default=False)
    display_name = CharField(max_length=settings.NAME_MAX_LENGTH)
    description = TextField(blank=True)

    activation_key = CharField(max_length=40, blank=True)
    key_expires_at = DateTimeField(null=True)
    mail_verified = BooleanField(default=False)
    unverified_email = EmailField(null=True)

    deleted = BooleanField(default=False)
    deleted_at = DateTimeField(default=None, null=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'

    def get_full_name(self):
        return self.display_name

    def get_short_name(self):
        return self.display_name

    def verify_mail(self):
        self.mail_verified = True
        self.activation_key = ''
        self.key_expires_at = None
        self.email = self.unverified_email
        self.save()

    def _unverify_mail(self):
        key = crypto.get_random_string(length=40)
        self.mail_verified = False
        self.activation_key = key
        self.key_expires_at = timezone.now() + timedelta(days=7)
        self.save()

    def send_mail_change_notification(self):
        AnymailMessage(
            subject=_('Mail has changed'),
            body=_('Your mail address has changed from {} to {}. We assume that everything is alright.').format(
                self.email,
                self.unverified_email
            ),
            to=[self.email],
            from_email=settings.DEFAULT_FROM_EMAIL,
            track_clicks=False,
            track_opens=False
        ).send()

    def send_verification_code(self):
        self._unverify_mail()

        url = '{hostname}/#!/verify-mail?key={key}'.format(hostname=settings.HOSTNAME,
                                                           key=self.activation_key)

        AnymailMessage(
            subject=_('Verify your mail address'),
            body=_('Here is your activation link: {}. It will be valid for 7 days.').format(url),
            to=[self.unverified_email],
            from_email=settings.DEFAULT_FROM_EMAIL,
            track_clicks=False,
            track_opens=False
        ).send()

    def reset_password(self):
        new_password = User.objects.make_random_password(length=20)
        self.set_password(new_password)
        self.save()

        AnymailMessage(
            subject=_('New password'),
            body=_('Here is your new temporary password: {}.' +
                   'You can use it to login. Please change it soon.').format(new_password),
            to=[self.email],
            from_email=settings.DEFAULT_FROM_EMAIL,
            track_clicks=False,
            track_opens=False
        ).send()

    def has_perm(self, perm, obj=None):
        # temporarily only allow access for admins
        return self.is_staff

    def has_module_perms(self, app_label):
        # temporarily only allow access for admins
        return self.is_staff
