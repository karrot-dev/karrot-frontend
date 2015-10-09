ids_uri_pattern_delim = ','


def multiple_integerids(name, minlength=1, maxlength=10, minrepetitions=1, maxrepetitions=200, delim=ids_uri_pattern_delim):
    """
    :type name: str
    :type minlength: int
    :type maxlength: int
    :type minrepetitions: int
    :type maxrepetitions: int
    :rtype str

    >>> multiple_integerids(name='foo_list', minlength=1, maxlength=10, minrepetitions=1, maxrepetitions=3)
    '(?P<foo_list>[0-9]{1,10}(,[0-9]{1,10}){0,2})'

    """
    integerid = '[0-9]{{{minlength},{maxlength}}}'.format(minlength=minlength, maxlength=maxlength)
    integerid_list = '{integerid}({delim}{integerid}){{{minrepetitions},{maxrepetitions}}}'.format(integerid=integerid, minrepetitions=minrepetitions - 1, maxrepetitions=maxrepetitions - 1, delim=delim)
    return '(?P<{name}>{integerid_list})'.format(name=name, integerid_list=integerid_list)


def single_integerid(name, minlength=1, maxlength=10):
    return multiple_integerids(name, minlength, maxlength, minrepetitions=1, maxrepetitions=1)


category_ids_uri_pattern = multiple_integerids('categoryids')
chat_id_uri_pattern = single_integerid('chatid')
feedback_id_uri_pattern = single_integerid('feedbackid')
opportunity_id_uri_pattern = single_integerid('opportunityid')
participate_id_uri_pattern = single_integerid('participateid')
take_id_uri_pattern = single_integerid('takeid')
user_id_uri_pattern = single_integerid('userid')
multiple_user_id_uri_pattern = multiple_integerids('userids')
valuable_id_uri_pattern = single_integerid('valuableid')
wallpost_id_uri_pattern = single_integerid('wallpostid')
