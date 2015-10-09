from factory import DjangoModelFactory, CREATE_STRATEGY, Sequence, LazyAttribute, PostGeneration, post_generation, SubFactory


class Factory(DjangoModelFactory):
    class Meta:
        strategy = CREATE_STRATEGY
        model = None
        abstract = True


class CategoryFactory(Factory):
    class Meta:
        model = "yunity.Category"
        strategy = CREATE_STRATEGY


class UserFactory(Factory):
    class Meta:
        model = "yunity.User"
        strategy = CREATE_STRATEGY

    type = CategoryFactory.create()
    display_name = Sequence(lambda n: "user{}".format(n))
    email = LazyAttribute(lambda obj: '%s@email.com' % obj.display_name)
    is_active = True
    is_staff = False
    password = PostGeneration(lambda obj, *args, **kwargs: obj.set_password(obj.display_name))
    locations = []


class ChatFactory(Factory):
    class Meta:
        model = "yunity.Chat"
        strategy = CREATE_STRATEGY

    administrated_by = SubFactory(UserFactory)

    @post_generation
    def participants(self, create, extracted, **kwargs):
        if not create:
            return
        if extracted:
            for participant in extracted:
                self.participants.add(participant)

