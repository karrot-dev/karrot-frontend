from unittest import TestCase

from yunity.api.validation import validate_user_email, validate_user_password, validate_user_display_name, \
    validate_chat_message_type, validate_chat_message_content, validate_chat_name, validate_chat_users, validate_categories, \
    validate_chat_participants, validate_chat_message
from yunity.utils.validation import ShorterThan, HasKey, IsIn, OfType, Each, AndThen


class AbstractValidationTestCase(TestCase):
    def setUp(self):
        self.data = None
        self.result = None
        self.exception = None

    def given_data(self, data):
        self.data = data

    def when_calling(self, function):
        try:
            self.result = function(self.data)
        except Exception as e:
            self.exception = e

    def then_validation_failed(self):
        self.assertIsInstance(self.exception, ValueError)

    def then_validation_passed(self):
        self.assertIsNotNone(self.result, 'did not get a result')
        self.assertIsNone(self.exception, 'got an unexpected exception')


class TestApiValidation(AbstractValidationTestCase):
    def test_validate_user_email_passes(self):
        self.given_data({'email': 'adam@foo.com'})
        self.when_calling(validate_user_email)
        self.then_validation_passed()

    def test_validate_user_email_fails(self):
        self.given_data({'email': 'clearly.not.an.email.com'})
        self.when_calling(validate_user_email)
        self.then_validation_failed()

    def test_validate_user_password_passes(self):
        self.given_data({'password': 'my-secret-P4ssw0rd'})
        self.when_calling(validate_user_password)
        self.then_validation_passed()

    def test_validate_user_password_fails(self):
        self.given_data({})
        self.when_calling(validate_user_password)
        self.then_validation_failed()

    def test_validate_user_display_name_passes(self):
        self.given_data({'display_name': 'Adam'})
        self.when_calling(validate_user_display_name)
        self.then_validation_passed()

    def test_validate_user_display_name_fails(self):
        self.given_data({})
        self.when_calling(validate_user_display_name)
        self.then_validation_failed()

    def test_validate_chat_message_type_passes(self):
        self.given_data({'type': 'TEXT'})
        self.when_calling(validate_chat_message_type)
        self.then_validation_passed()

    def test_validate_chat_message_type_fails(self):
        self.given_data({'type': 'not-yet-implemented-type'})
        self.when_calling(validate_chat_message_type)
        self.then_validation_failed()

    def test_validate_chat_message_content_passes(self):
        self.given_data({'content': 'This is the message content. ☺'})
        self.when_calling(validate_chat_message_content)
        self.then_validation_passed()

    def test_validate_chat_message_content_fails(self):
        self.given_data({'content': 'Really lo{}ng message'.format('o' * 999999)})
        self.when_calling(validate_chat_message_content)
        self.then_validation_failed()

    def test_validate_chat_name_passes(self):
        self.given_data({'name': 'my super cool group chat'})
        self.when_calling(validate_chat_name)
        self.then_validation_passed()

    def test_validate_chat_name_fails(self):
        self.given_data({'name': 'my super lo{}ng chat name'.format('o' * 999999)})
        self.when_calling(validate_chat_name)
        self.then_validation_failed()

    def test_validate_users_passes(self):
        self.given_data({'users': [1, 2, 34, 678]})
        self.when_calling(validate_chat_users)
        self.then_validation_passed()

    def test_validate_users_fails(self):
        self.given_data({'users': [1, 2, 'Adam', 3]})
        self.when_calling(validate_chat_users)
        self.then_validation_failed()

    def test_validate_chat_message_passes(self):
        self.given_data({'message': {'content': 'woo message', 'type': 'TEXT'}})
        self.when_calling(validate_chat_message)
        self.then_validation_passed()

    def test_validate_chat_message_fails(self):
        self.given_data({'message': {'content': 'message without a type field, oh no!'}})
        self.when_calling(validate_chat_message)
        self.then_validation_failed()

    def test_validate_categories_passes(self):
        self.given_data({'categories': [{'name': 'foodsharing-basket', 'parent': 1}]})
        self.when_calling(validate_categories)
        self.then_validation_passed()

    def test_validate_categories_fails(self):
        self.given_data({'categories': [{'parent': 1}]})
        self.when_calling(validate_categories)
        self.then_validation_failed()

    def test_validate_participants_passes(self):
        self.given_data({'participants': [1, 2, 3]})
        self.when_calling(validate_chat_participants)
        self.then_validation_passed()

    def test_validate_participants_fails(self):
        self.given_data({'participants': ['Bob', 'John']})
        self.when_calling(validate_chat_participants)
        self.then_validation_failed()


class TestValidationUtil(AbstractValidationTestCase):
    def test_shorter_than_rejects_item_without_length(self):
        self.given_data(123)
        self.when_calling(ShorterThan(100))
        self.then_validation_failed()

    def test_shorter_than_rejects_long_item(self):
        self.given_data('123')
        self.when_calling(ShorterThan(2))
        self.then_validation_failed()

    def test_shorter_than_accepts_short_item(self):
        self.given_data('123')
        self.when_calling(ShorterThan(5))
        self.then_validation_passed()

    def test_has_key_rejects_item_without_keys(self):
        self.given_data('123')
        self.when_calling(HasKey('thekey'))
        self.then_validation_failed()

    def test_has_key_rejects_item_with_missing_key(self):
        self.given_data({'foo': 123})
        self.when_calling(HasKey('thekey'))
        self.then_validation_failed()

    def test_has_key_accepts_item_with_key(self):
        self.given_data({'thekey': 123})
        self.when_calling(HasKey('thekey'))
        self.then_validation_passed()

    def test_is_in_rejects_not_contained_item(self):
        self.given_data('notfound')
        self.when_calling(IsIn('this', 'and', 'that'))
        self.then_validation_failed()

    def test_is_in_accepts_contained_item(self):
        self.given_data('that')
        self.when_calling(IsIn('this', 'and', 'that'))
        self.then_validation_passed()

    def test_of_type_rejects_item_of_wrong_type(self):
        self.given_data({'my': 'dict'})
        self.when_calling(OfType(int))
        self.then_validation_failed()

    def test_of_type_accepts_item_of_same_type(self):
        self.given_data({'my': 'dict'})
        self.when_calling(OfType(dict))
        self.then_validation_passed()

    def test_each_rejects_item_that_is_not_iterable(self):
        self.given_data(123)
        self.when_calling(Each(OfType(int)))
        self.then_validation_failed()

    def test_each_rejects_item_with_members_that_do_not_validate(self):
        self.given_data([1, 2, 'mixed', 'types', {}, 'yay'])
        self.when_calling(Each(OfType(int)))
        self.then_validation_failed()

    def test_each_accepts_item_with_members_that_validate(self):
        self.given_data([1, 2, 3])
        self.when_calling(Each(OfType(int)))
        self.then_validation_passed()

    def test_and_then_rejects_sequence_that_does_not_validate(self):
        self.given_data('without key')
        self.when_calling(AndThen(HasKey('thekey'), OfType(int)))
        self.then_validation_failed()

    def test_and_then_accepts_sequence_that_does_validate(self):
        self.given_data({'thekey': 1})
        self.when_calling(AndThen(HasKey('thekey'), OfType(int)))
        self.then_validation_passed()
