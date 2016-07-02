from yunity.utils.tests.abc import BaseRequestTestCase, AnyResult
from yunity.utils.validation import ShorterThan, HasKey, IsIn, OfType, Each, AndThen, ValidationFailure


class TestValidationUtil(BaseRequestTestCase):

    def test_shorter_than_rejects_item_without_length(self):
        self.given_data(123)
        self.when_calling(ShorterThan(100))
        self.then_invocation_failed_with(ValidationFailure)

    def test_shorter_than_rejects_long_item(self):
        self.given_data('123')
        self.when_calling(ShorterThan(2))
        self.then_invocation_failed_with(ValidationFailure)

    def test_shorter_than_accepts_short_item(self):
        self.given_data('123')
        self.when_calling(ShorterThan(5))
        self.then_invocation_passed_with(AnyResult())

    def test_has_key_rejects_item_without_keys(self):
        self.given_data('123')
        self.when_calling(HasKey('thekey'))
        self.then_invocation_failed_with(ValidationFailure)

    def test_has_key_rejects_item_with_missing_key(self):
        self.given_data({'foo': 123})
        self.when_calling(HasKey('thekey'))
        self.then_invocation_failed_with(ValidationFailure)

    def test_has_key_accepts_item_with_key(self):
        self.given_data({'thekey': 123})
        self.when_calling(HasKey('thekey'))
        self.then_invocation_passed_with(AnyResult())

    def test_is_in_rejects_not_contained_item(self):
        self.given_data('notfound')
        self.when_calling(IsIn('this', 'and', 'that'))
        self.then_invocation_failed_with(ValidationFailure)

    def test_is_in_accepts_contained_item(self):
        self.given_data('that')
        self.when_calling(IsIn('this', 'and', 'that'))
        self.then_invocation_passed_with(AnyResult())

    def test_of_type_rejects_item_of_wrong_type(self):
        self.given_data({'my': 'dict'})
        self.when_calling(OfType(int))
        self.then_invocation_failed_with(ValidationFailure)

    def test_of_type_accepts_item_of_same_type(self):
        self.given_data({'my': 'dict'})
        self.when_calling(OfType(dict))
        self.then_invocation_passed_with(AnyResult())

    def test_each_rejects_item_that_is_not_iterable(self):
        self.given_data(123)
        self.when_calling(Each(OfType(int)))
        self.then_invocation_failed_with(ValidationFailure)

    def test_each_rejects_item_with_members_that_do_not_validate(self):
        self.given_data([1, 2, 'mixed', 'types', {}, 'yay'])
        self.when_calling(Each(OfType(int)))
        self.then_invocation_failed_with(ValidationFailure)

    def test_each_accepts_item_with_members_that_validate(self):
        self.given_data([1, 2, 3])
        self.when_calling(Each(OfType(int)))
        self.then_invocation_passed_with(AnyResult())

    def test_and_then_rejects_sequence_that_does_not_validate(self):
        self.given_data('without key')
        self.when_calling(AndThen(HasKey('thekey'), OfType(int)))
        self.then_invocation_failed_with(ValidationFailure)

    def test_and_then_accepts_sequence_that_does_validate(self):
        self.given_data({'thekey': 1})
        self.when_calling(AndThen(HasKey('thekey'), OfType(int)))
        self.then_invocation_passed_with(AnyResult())
