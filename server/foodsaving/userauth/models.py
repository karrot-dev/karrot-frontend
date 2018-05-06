from datetime import timedelta

from django.db.models import CharField, ForeignKey, Manager
from django.db import models
from django.conf import settings
from django.utils import crypto, timezone

from foodsaving.base.base_models import BaseModel


class VerificationCodeManager(Manager):
    def create(self, *args, **kwargs):
        if 'code' not in kwargs or not kwargs['code']:
            url_safe_chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
            kwargs['code'] = crypto.get_random_string(length=VerificationCode.LENGTH, allowed_chars=url_safe_chars)
        return super(VerificationCodeManager, self).create(*args, **kwargs)


class VerificationCode(BaseModel):
    """
    A single-use token that expires after a predefined period
    and can only be used by a designated user to authenticate a certain type of action.
    """
    # Action types
    EMAIL_VERIFICATION = 'EMAIL_VERIFICATION'
    PASSWORD_RESET = 'PASSWORD_RESET'
    ACCOUNT_DELETE = 'ACCOUNT_DELETE'
    TYPES = [EMAIL_VERIFICATION, PASSWORD_RESET, ACCOUNT_DELETE]

    LENGTH = 40

    objects = VerificationCodeManager()

    user = ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    code = CharField('actual verification code', unique=True, max_length=50)
    type = CharField(max_length=50)

    class Meta:
        unique_together = ('user', 'type')

    def _get_validity_time_limit(self):
        """
        Retrieve the validity time limit setting in seconds based on the verification code type.

        The validity time limit is the period of time after which the verification code expires.
        """
        if self.type == self.EMAIL_VERIFICATION:
            return settings.EMAIL_VERIFICATION_TIME_LIMIT_HOURS * 3600
        if self.type == self.PASSWORD_RESET:
            return settings.PASSWORD_RESET_TIME_LIMIT_MINUTES * 60
        if self.type == self.ACCOUNT_DELETE:
            return settings.ACCOUNT_DELETE_TIME_LIMIT_MINUTES * 60
        raise NotImplementedError

    def has_expired(self):
        """
        True if the expiration date lies in the past.
        """
        return self.created_at + timedelta(seconds=self._get_validity_time_limit()) < timezone.now()
