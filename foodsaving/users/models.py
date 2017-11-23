from datetime import timedelta

from anymail.message import AnymailMessage
from django.conf import settings
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.db import transaction
from django.db.models import EmailField, BooleanField, TextField, CharField, DateTimeField, ForeignKey
from django.template.loader import render_to_string
from django.utils import crypto
from django.utils import timezone
from django.utils.translation import ugettext as _

from foodsaving.base.base_models import BaseModel, LocationModel

MAX_DISPLAY_NAME_LENGTH = 80


class UserManager(BaseUserManager):
    use_in_migrations = True

    @transaction.atomic
    def _create_user(self, email, password, display_name=None, is_active=True, **extra_fields):
        """ Creates and saves a user with the given username, email and password.

        """
        email = self._validate_email(email)
        extra_fields['unverified_email'] = email

        user = self.model(
            email=email,
            is_active=is_active,
            display_name=display_name,
            **extra_fields)
        user.set_password(password)
        user.save()
        user._send_welcome_mail()
        return user

    def filter_by_similar_email(self, email):
        return self.filter(email__iexact=email)

    def get_by_natural_key(self, email):
        """
        As we don't allow sign-ups with similarly cased email addresses,
        we can allow users to login with case spelling mistakes
        """
        return self.get(email__iexact=email)

    def _validate_email(self, email):
        if email is None:
            raise ValueError('The email field must be set')
        return self.normalize_email(email)

    def create_user(self, email=None, password=None, display_name=None,
                    **extra_fields):
        return self._create_user(email, password, display_name, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        user = self._create_user(email, password, email, **extra_fields)
        user.is_superuser = True
        user.is_staff = True
        user.save()
        return user


class User(AbstractBaseUser, BaseModel, LocationModel):
    email = EmailField(unique=True, null=True)
    is_active = BooleanField(default=True)
    is_staff = BooleanField(default=False)
    is_superuser = BooleanField(default=False)
    display_name = CharField(max_length=settings.NAME_MAX_LENGTH)
    description = TextField(blank=True)
    language = CharField(max_length=7, default='en')

    activation_key = CharField(max_length=40, blank=True)
    key_expires_at = DateTimeField(null=True)
    mail_verified = BooleanField(default=False)
    unverified_email = EmailField(null=True)

    deleted = BooleanField(default=False)
    deleted_at = DateTimeField(default=None, null=True)
    current_group = ForeignKey('groups.Group', blank=True, null=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'

    def get_full_name(self):
        return self.display_name

    def get_short_name(self):
        return self.display_name

    @transaction.atomic
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

    @transaction.atomic
    def update_email(self, unverified_email):
        self.unverified_email = unverified_email
        self._send_mail_change_notification()
        self.send_new_verification_code()

    def update_language(self, language):
        self.language = language

    def _send_mail_change_notification(self):
        context = {
            'user': self,
        }

        AnymailMessage(
            subject=render_to_string('changemail_notice-subject.jinja').replace('\n', ''),
            body=render_to_string('changemail_notice-body-text.jinja', context),
            to=[self.email],
            from_email=settings.DEFAULT_FROM_EMAIL,
            track_clicks=False,
            track_opens=False
        ).send()

    def _send_welcome_mail(self):
        self._unverify_mail()

        url = '{hostname}/#/verify-mail?key={key}'.format(
            hostname=settings.HOSTNAME,
            key=self.activation_key
        )

        context = {
            'user': self,
            'url': url,
        }

        AnymailMessage(
            subject=render_to_string('mailverification-subject.jinja').replace('\n', ''),
            body=render_to_string('mailverification-body-text.jinja', context),
            to=[self.unverified_email],
            from_email=settings.DEFAULT_FROM_EMAIL,
            track_clicks=False,
            track_opens=False
        ).send()

    @transaction.atomic
    def send_new_verification_code(self):
        self._unverify_mail()

        url = '{hostname}/#/verify-mail?key={key}'.format(
            hostname=settings.HOSTNAME,
            key=self.activation_key
        )

        context = {
            'user': self,
            'url': url,
        }

        AnymailMessage(
            subject=render_to_string('send_new_verification_code-subject.jinja').replace('\n', ''),
            body=render_to_string('send_new_verification_code-body-text.jinja', context),
            to=[self.unverified_email],
            from_email=settings.DEFAULT_FROM_EMAIL,
            track_clicks=False,
            track_opens=False
        ).send()

    @transaction.atomic
    def reset_password(self):
        new_password = User.objects.make_random_password(length=20)
        self.set_password(new_password)
        self.save()

        AnymailMessage(
            subject=_('New password'),
            body=_('Here is your new temporary password: {}. ' +
                   'You can use it to login. Please change it soon.').format(new_password),
            to=[self.email],
            from_email=settings.DEFAULT_FROM_EMAIL,
            track_clicks=False,
            track_opens=False
        ).send()

    def has_perm(self, perm, obj=None):
        # temporarily only allow access for admins
        return self.is_superuser

    def has_module_perms(self, app_label):
        # temporarily only allow access for admins
        return self.is_superuser
