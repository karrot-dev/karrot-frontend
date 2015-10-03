def _integerid(name, minlength=1, maxlength=10):
    """
    :type name: str
    :type minlength: int
    :type maxlength: int
    :rtype str

    >>> _integerid(name='foo', minlength=1, maxlength=10)
    '(?P<foo>[0-9]{1,10})'

    """
    return '(?P<{name}>[0-9]{{{minlength},{maxlength}}})'.format(
        name=name,
        minlength=minlength,
        maxlength=maxlength,
    )


chat_id_uri_pattern = _integerid('chatid')
feedback_id_uri_pattern = _integerid('feedbackid')
opportunity_id_uri_pattern = _integerid('opportunityid')
participate_id_uri_pattern = _integerid('participateid')
take_id_uri_pattern = _integerid('takeid')
user_id_uri_pattern = _integerid('userid')
valuable_id_uri_pattern = _integerid('valuableid')
wallpost_id_uri_pattern = _integerid('wallpostid')
