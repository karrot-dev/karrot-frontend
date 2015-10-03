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


chatid = _integerid('chatid')
feedbackid = _integerid('feedbackid')
opportunityid = _integerid('opportunityid')
participateid = _integerid('participateid')
takeid = _integerid('takeid')
userid = _integerid('userid')
valuableid = _integerid('valuableid')
wallpostid = _integerid('wallpostid')
