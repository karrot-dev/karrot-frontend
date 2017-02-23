from factory import DjangoModelFactory, post_generation, LazyAttribute
from foodsaving.groups.models import Group as GroupModel
from foodsaving.utils.tests.fake import faker


class Group(DjangoModelFactory):

    class Meta:
        model = GroupModel

    @post_generation
    def members(self, created, members, **kwargs):
        if not created:
            return
        if members:
            for member in members:
                self.members.add(member)

    name = LazyAttribute(lambda x: faker.sentence(nb_words=4))
    description = LazyAttribute(lambda x: faker.name())
    public_description = LazyAttribute(lambda x: faker.sentence(nb_words=20))
