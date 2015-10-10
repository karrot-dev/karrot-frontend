from yunity.utils.validation import Each, OfType, IsIn, HasKey, IsEmail, Validator, IsReasonableLengthString


class IsListOfIds(Validator):
    def __call__(self, value):
        (OfType(list) & Each(OfType(int)))(value)
        return value


class IsMessageType(Validator):
    def __call__(self, value):
        (OfType(str) & IsIn('TEXT', 'IMAGE'))(value)
        return value


def validate_chat_message(request):
    (HasKey('message') & validate_chat_message_type)(request)
    (HasKey('message') & validate_chat_message_content)(request)
    return request


def validate_chat_message_type(request):
    (HasKey('type') & IsMessageType())(request)
    return request


def validate_chat_message_content(request):
    (HasKey('content') & IsReasonableLengthString())(request)
    return request


def validate_chat_name(request):
    (HasKey('name') & IsReasonableLengthString())(request)
    return request


def validate_chat_participants(request):
    (HasKey('participants') & IsListOfIds())(request)
    return request


def validate_chat_users(request):
    (HasKey('users') & IsListOfIds())(request)
    return request


def validate_category_name(request):
    (HasKey('name') & IsReasonableLengthString())(request)
    return request


def validate_category_parent(request):
    (HasKey('parent') & OfType(int))(request)
    return request


def validate_user_email(request):
    (HasKey('email') & IsEmail())(request)
    return request


def validate_user_password(request):
    (HasKey('password') & OfType(str))(request)
    return request


def validate_user_display_name(request):
    (HasKey('display_name') & OfType(str))(request)
    return request
