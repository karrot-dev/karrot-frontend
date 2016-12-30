from django.contrib.auth import get_user_model
from factory import DjangoModelFactory, CREATE_STRATEGY, LazyAttribute, PostGeneration, SubFactory
from yunity.walls.factories import Wall
from yunity.utils.tests.fake import faker


class UserFactory(DjangoModelFactory):

    class Meta:
        model = get_user_model()
        strategy = CREATE_STRATEGY

    is_active = True
    is_staff = False
    display_name = LazyAttribute(lambda _: faker.name())
    email = LazyAttribute(lambda _: faker.email())
    description = LazyAttribute(lambda _: faker.text())

    # Use display_name as password, as it is readable
    password = PostGeneration(lambda obj, *args, **kwargs: obj.set_password(obj.display_name))

    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        user = super()._create(model_class, *args, **kwargs)
        user._unverify_mail()
        return user

    wall = SubFactory(Wall)


class VerifiedUserFactory(UserFactory):
    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        user = super()._create(model_class, *args, **kwargs)
        user.verify_mail()
        return user
