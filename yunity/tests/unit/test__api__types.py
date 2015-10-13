from yunity.api import types
from yunity.utils.tests.abc import BaseTestCase, AnyResult


class TestApiValidation(BaseTestCase):
    def test_validate_user_email_passes(self):
        self.given_data('adam@foo.com')
        self.when_calling(types.user_email)
        self.then_invocation_passed_with(AnyResult())

    def test_validate_user_email_fails(self):
        self.given_data('clearly.not.an.email.com')
        self.when_calling(types.user_email)
        self.then_invocation_failed_with(ValueError)

    def test_validate_user_password_passes(self):
        self.given_data('my-secret-P4ssw0rd')
        self.when_calling(types.user_password)
        self.then_invocation_passed_with(AnyResult())

    def test_validate_user_password_fails(self):
        self.given_data('Really lo{}ng password'.format('o' * 999999))
        self.when_calling(types.user_password)
        self.then_invocation_failed_with(ValueError)

    def test_validate_user_display_name_passes(self):
        self.given_data('Adam')
        self.when_calling(types.user_display_name)
        self.then_invocation_passed_with(AnyResult())

    def test_validate_user_display_name_fails(self):
        self.given_data('Really lo{}ng name'.format('o' * 999999))
        self.when_calling(types.user_display_name)
        self.then_invocation_failed_with(ValueError)

    def test_validate_message_type_passes_for_text(self):
        self.given_data('TEXT')
        self.when_calling(types.message_type)
        self.then_invocation_passed_with(AnyResult())

    def test_validate_message_type_passes_for_image(self):
        self.given_data('IMAGE')
        self.when_calling(types.message_type)
        self.then_invocation_passed_with(AnyResult())

    def test_validate_message_type_fails(self):
        self.given_data('not-yet-implemented-type')
        self.when_calling(types.message_type)
        self.then_invocation_failed_with(ValueError)

    def test_validate_message_content_passes(self):
        self.given_data('This is the message content. ☺')
        self.when_calling(types.message_content)
        self.then_invocation_passed_with(AnyResult())

    def test_validate_message_content_fails(self):
        self.given_data('Really lo{}ng message'.format('o' * 999999))
        self.when_calling(types.message_type)
        self.then_invocation_failed_with(ValueError)

    def test_validate_chat_name_passes(self):
        self.given_data('my super cool group chat')
        self.when_calling(types.chat_name)
        self.then_invocation_passed_with(AnyResult())

    def test_validate_chat_name_fails(self):
        self.given_data('my super lo{}ng chat name'.format('o' * 999999))
        self.when_calling(types.chat_name)
        self.then_invocation_failed_with(ValueError)

    def test_validate_list_of_user_ids_passes(self):
        self.given_data([1, 2, 34, 678])
        self.when_calling(types.list_of_userids)
        self.then_invocation_passed_with(AnyResult())

    def test_validate_list_of_user_ids_fails(self):
        self.given_data([1, 2, 'Adam', 3])
        self.when_calling(types.list_of_userids)
        self.then_invocation_failed_with(ValueError)

    def test_validate_message_passes(self):
        self.given_data({'content': 'woo message', 'type': 'TEXT'})
        self.when_calling(types.message)
        self.then_invocation_passed_with(AnyResult())

    def test_validate_message_fails(self):
        self.given_data({'content': 'message without a type field, oh no!'})
        self.when_calling(types.message)
        self.then_invocation_failed_with(ValueError)

    def test_validate_category_name_passes(self):
        self.given_data('foodsharing-basket')
        self.when_calling(types.category_name)
        self.then_invocation_passed_with(AnyResult())

    def test_validate_category_name_fails(self):
        self.given_data('really lo{}ng name'.format('o' * 999999))
        self.when_calling(types.category_name)
        self.then_invocation_failed_with(ValueError)

    def test_validate_category_parent_passes(self):
        self.given_data(123)
        self.when_calling(types.category_parent)
        self.then_invocation_passed_with(AnyResult())

    def test_validate_category_parent_fails(self):
        self.given_data('123')
        self.when_calling(types.category_parent)
        self.then_invocation_failed_with(ValueError)
