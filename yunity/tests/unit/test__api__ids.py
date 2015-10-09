from yunity.api.ids import multiple_integerids, single_integerid
from yunity.utils.tests import BaseTestCase


class IdsTestCase(BaseTestCase):
    def test_multiple_integerid_creates_regex(self):
        self.given_data(name='foo_list', minlength=1, maxlength=10, minrepetitions=1, maxrepetitions=3)
        self.when_calling(multiple_integerids)
        self.then_invocation_passed_with(result='(?P<foo_list>[0-9]{1,10}(,[0-9]{1,10}){0,2})')

    def test_single_integerid_creates_regex(self):
        self.given_data(name='foo_single', minlength=1, maxlength=10)
        self.when_calling(single_integerid)
        self.then_invocation_passed_with(result='(?P<foo_single>[0-9]{1,10})')
