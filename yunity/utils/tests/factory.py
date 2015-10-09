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
            # A list of groups were passed in, use them
            for participant in extracted:
                self.participants.add(participant)


class MessageFactory(Factory):
    class Meta:
        model = "yunity.Message"
        strategy = CREATE_STRATEGY

    sent_by = None  # ForeignKey('yunity.User')
    reply_to = None  # ForeignKey('self', null=True, related_name='replies')
    in_conversation = None  # ForeignKey('yunity.Conversation', related_name='messages')
    created_at = None  # DateTimeField(auto_now=True)
    type = None  # MaxLengthCharField()
    content = None  # TextField()
