ids_uri_pattern_delim = ','


def _multiple_integerid(name, minlength=1, maxlength=10, minrepetitions=1, maxrepetitions=200, delim=ids_uri_pattern_delim):
    """
    :type name: str
    :type minlength: int
    :type maxlength: int
    :type minrepetitions: int
    :type maxrepetitions: int
    :rtype str

    >>> _multiple_integerid(name='foo_list', minlength=1, maxlength=10, minrepetitions=1, maxrepetitions=3)
    '(?P<foo_list>[0-9]{1,10}(,[0-9]{1,10}){0,2})'

    """
    integerid = '[0-9]{{{minlength},{maxlength}}}'.format(minlength=minlength, maxlength=maxlength)
    integerid_list = '{integerid}({delim}{integerid}){{{minrepetitions},{maxrepetitions}}}'.format(integerid=integerid, minrepetitions=minrepetitions - 1, maxrepetitions=maxrepetitions - 1, delim=delim)
    return '(?P<{name}>{integerid_list})'.format(name=name, integerid_list=integerid_list)


def _integerid(name, minlength=1, maxlength=10):
    return _multiple_integerid(name, minlength, maxlength, minrepetitions=1, maxrepetitions=1)


category_ids_uri_pattern = _multiple_integerid('categoryids')
chat_id_uri_pattern = _integerid('chatid')
feedback_id_uri_pattern = _integerid('feedbackid')
opportunity_id_uri_pattern = _integerid('opportunityid')
participate_id_uri_pattern = _integerid('participateid')
take_id_uri_pattern = _integerid('takeid')
user_id_uri_pattern = _integerid('userid')
multiple_user_id_uri_pattern = _multiple_integerid('userids')
valuable_id_uri_pattern = _integerid('valuableid')
wallpost_id_uri_pattern = _integerid('wallpostid')
