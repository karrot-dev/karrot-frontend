from django.core.exceptions import ValidationError
from django.core.validators import validate_email

from yunity.utils.validation import Each, OfType, HasKey, IsReasonableLengthString, ValidationFailure


def message(value):
    (HasKey('content') & message_content)(value)
    return value

def message_content(value):
    IsReasonableLengthString()(value)
    return value

def chat_name(value):
    IsReasonableLengthString()(value)
    return value


def list_of_userids(value):
    (OfType(list) & Each(OfType(int)))(value)
    return value


def user_email(value):
    try:
        validate_email(value)
    except ValidationError:
        raise ValidationFailure('not a valid email address')
    return value


def user_password(value):
    IsReasonableLengthString()(value)
    return value


def user_display_name(value):
    IsReasonableLengthString()(value)
    return value


def user_first_name(value):
    IsReasonableLengthString()(value)
    return value


def user_last_name(value):
    IsReasonableLengthString()(value)
    return value

def item_description(value):
    IsReasonableLengthString()(value)
    return value