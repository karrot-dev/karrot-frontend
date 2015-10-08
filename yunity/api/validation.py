from yunity.utils.validation import Each, OfType, IsIn, HasKey, ShorterThan, IsEmail


def validate_chat_message(request):
    validate_chat_message_type(request)
    (HasKey('message') & OfType(str) & ShorterThan(100000))(request)
    return request


def validate_chat_message_type(request):
    (HasKey('type') & OfType(str) & IsIn('TEXT', 'IMAGE'))(request)
    return request


def validate_chat_message_content(request):
    (HasKey('content') & OfType(str) & ShorterThan(100000))(request)
    return request


def validate_chat_name(request):
    (HasKey('name') & OfType(str) & ShorterThan(100000))(request)
    return request


def validate_chat_participants(request):
    (HasKey('participants') & OfType(list) & Each(OfType(int)))(request)
    return request


def validate_chat_users(request):
    (HasKey('users') & OfType(list) & Each(OfType(int)))(request)
    return request


def validate_categories(request):
    def validate_category(data):
        (HasKey('name') & OfType(str))(data)
        (HasKey('parent') & OfType(int))(data)

    (HasKey('categories') & OfType(list) & Each(validate_category))(request)
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
