from django.contrib.auth import get_user_model
from factory import DjangoModelFactory, CREATE_STRATEGY, LazyAttribute, PostGeneration, SubFactory
from yunity.walls.factories import Wall
from yunity.utils.tests.fake import faker


class User(DjangoModelFactory):

    class Meta:
        model = get_user_model()
        strategy = CREATE_STRATEGY

    is_active = True
    is_staff = False
    display_name = LazyAttribute(lambda _: faker.name())
    first_name = LazyAttribute(lambda _: faker.name())
    last_name = LazyAttribute(lambda _: faker.name())
    email = LazyAttribute(lambda _: faker.email())

    # Use display_name as password, as it is readable
    password = PostGeneration(lambda obj, *args, **kwargs: obj.set_password(obj.display_name))

    wall = SubFactory(Wall)
