from factory import DjangoModelFactory, post_generation, LazyAttribute

from foodsaving.groups.models import Group as GroupModel, GroupMembership
from foodsaving.groups.roles import GROUP_APPROVED_MEMBER
from foodsaving.utils.tests.fake import faker


class GroupFactory(DjangoModelFactory):
    class Meta:
        model = GroupModel

    @post_generation
    def members(self, created, members, **kwargs):
        if not created:
            return
        if members:
            for member in members:
                GroupMembership.objects.create(group=self, user=member, roles=[GROUP_APPROVED_MEMBER])

    name = LazyAttribute(lambda x: faker.name())
    description = LazyAttribute(lambda x: faker.sentence(nb_words=40))
    public_description = LazyAttribute(lambda x: faker.sentence(nb_words=20))
