from factory import DjangoModelFactory, CREATE_STRATEGY, Sequence, LazyAttribute, PostGeneration, post_generation, SubFactory


class Mock(DjangoModelFactory):
    class Meta:
        strategy = CREATE_STRATEGY
        model = None
        abstract = True


class MockCategory(Mock):
    class Meta:
        model = "yunity.Category"
        strategy = CREATE_STRATEGY


class MockUser(Mock):
    class Meta:
        model = "yunity.User"
        strategy = CREATE_STRATEGY

    type = MockCategory.create()
    display_name = Sequence(lambda n: "user{}".format(n))
    email = LazyAttribute(lambda obj: '%s@email.com' % obj.display_name)
    is_active = True
    is_staff = False
    password = PostGeneration(lambda obj, *args, **kwargs: obj.set_password(obj.display_name))
    locations = []


class MockChat(Mock):
    class Meta:
        model = "yunity.Chat"
        strategy = CREATE_STRATEGY

    administrated_by = SubFactory(MockUser)

    @post_generation
    def participants(self, create, extracted, **kwargs):
        if not create:
            return
        if extracted:
            for participant in extracted:
                self.participants.add(participant)

