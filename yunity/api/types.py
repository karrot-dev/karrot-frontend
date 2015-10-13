from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from yunity.utils.validation import Each, OfType, IsIn, HasKey, IsEmail, IsReasonableLengthString


def message(value):
    (HasKey('type') & message_type)(value)
    (HasKey('content') & message_content)(value)
    return value


def message_type(value):
    (OfType(str) & IsIn('TEXT', 'IMAGE'))(value)
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


def category_name(value):
    IsReasonableLengthString()(value)
    return value


def category_parent(value):
    OfType(int)(value)
    return value


def user_email(value):
    try:
        validate_email(value)
    except ValidationError:
        raise ValueError('not a valid email address')
    return value


def user_password(value):
    IsReasonableLengthString()(value)
    return value


def user_display_name(value):
    IsReasonableLengthString()(value)
    return value
