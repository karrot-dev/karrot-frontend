from factory import DjangoModelFactory, CREATE_STRATEGY, Sequence, LazyAttribute, PostGeneration, post_generation, SubFactory


class Factory(DjangoModelFactory):
    class Meta:
        strategy = CREATE_STRATEGY
        model = None
        abstract = True

    _create_batch_cache = []
    _create_cache = {}

    @classmethod
    def create_batch_safe(cls, num_instances):
        instances_to_be_created = num_instances - len(cls._create_batch_cache)
        if instances_to_be_created > 0:
            cls._create_batch_cache.extend(cls.create_batch(instances_to_be_created))
        return cls._create_batch_cache[:num_instances]

    @classmethod
    def create_safe(cls, *args, **kwargs):
        key = str(args) + str(sorted(kwargs.items()))
        value = cls._create_cache.get(key)
        if value is None:
            value = cls.create(*args, **kwargs)
            cls._create_cache[key] = value
        return value


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

    sent_by = None #ForeignKey('yunity.User')
    reply_to = None #ForeignKey('self', null=True, related_name='replies')
    in_conversation = None #ForeignKey('yunity.Conversation', related_name='messages')
    created_at = None #DateTimeField(auto_now=True)
    type = None #MaxLengthCharField()
    content = None #TextField()