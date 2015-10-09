from yunity.api.validation import validate_user_email, validate_user_password, validate_user_display_name, \
    validate_chat_message_type, validate_chat_message_content, validate_chat_name, validate_chat_users, validate_categories, \
    validate_chat_participants, validate_chat_message
from yunity.utils.test import AbstractValidationTestCase


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
