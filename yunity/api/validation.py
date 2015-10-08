from yunity.utils.validation import Each, OfType, IsIn, HasKey, IsEmail, ShorterThan


def _is_reasonable_length_string(value, maxlen=100000):
    (OfType(str) & ShorterThan(maxlen))(value)
    return value


def _is_list_of_ids(value):
    (OfType(list) & Each(OfType(int)))(value)
    return value


def _is_category(value):
    (HasKey('name') & OfType(str))(value)
    (HasKey('parent') & OfType(int))(value)
    return value


def _is_message_type(value):
    (OfType(str) & IsIn('TEXT', 'IMAGE'))(value)
    return value


def validate_chat_message(request):
    (HasKey('message') & validate_chat_message_type)(request)
    (HasKey('message') & validate_chat_message_content)(request)
    return request


def validate_chat_message_type(request):
    (HasKey('type') & _is_message_type)(request)
    return request


def validate_chat_message_content(request):
    (HasKey('content') & _is_reasonable_length_string)(request)
    return request


def validate_chat_name(request):
    (HasKey('name') & _is_reasonable_length_string)(request)
    return request


def validate_chat_participants(request):
    (HasKey('participants') & _is_list_of_ids)(request)
    return request


def validate_chat_users(request):
    (HasKey('users') & _is_list_of_ids)(request)
    return request


def validate_categories(request):
    (HasKey('categories') & OfType(list) & Each(_is_category))(request)
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
