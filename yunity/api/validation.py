from yunity.utils.validation import Each, OfType, IsIn, HasKey, IsEmail, ShorterThan, Validator


class IsReasonableLengthString(Validator):
    def __init__(self, maxlen=100000):
        self.maxlen = maxlen

    def __call__(self, value):
        (OfType(str) & ShorterThan(self.maxlen))(value)
        return value


class IsListOfIds(Validator):
    def __call__(self, value):
        (OfType(list) & Each(OfType(int)))(value)
        return value


class IsCategory(Validator):
    def __call__(self, value):
        (HasKey('name') & OfType(str))(value)
        (HasKey('parent') & OfType(int))(value)
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


def validate_categories(request):
    (HasKey('categories') & OfType(list) & Each(IsCategory()))(request)
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
