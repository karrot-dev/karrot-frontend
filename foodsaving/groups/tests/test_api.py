from dateutil.relativedelta import relativedelta
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from foodsaving.groups import roles
from foodsaving.groups.factories import GroupFactory
from foodsaving.groups.models import Group as GroupModel, GroupMembership, Agreement, UserAgreement
from foodsaving.stores.factories import PickupDateFactory, StoreFactory
from foodsaving.users.factories import UserFactory
from foodsaving.utils.tests.fake import faker


class TestGroupsAPI(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.user = UserFactory()
        cls.member = UserFactory()
        cls.group = GroupFactory(members=[cls.member, ])
        cls.group_with_password = GroupFactory(password='abc')
        cls.join_password_url = '/api/groups/{}/join/'.format(cls.group_with_password.id)
        cls.url = '/api/groups/'
        cls.group_data = {'name': faker.name(),
                          'description': faker.text(),
                          'address': faker.address(),
                          'latitude': faker.latitude(),
                          'longitude': faker.longitude(),
                          'timezone': 'Europe/Berlin'}

    def test_create_group(self):
        self.client.force_login(user=self.user)
        data = {'name': 'random_name', 'description': 'still alive', 'timezone': 'Europe/Berlin'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        self.assertEqual(response.data['name'], data['name'])
        self.assertEqual(GroupModel.objects.get(name=data['name']).description, data['description'])

    def test_create_group_with_location(self):
        self.client.force_login(user=self.user)
        response = self.client.post(self.url, self.group_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], self.group_data['name'])
        self.assertEqual(GroupModel.objects.get(name=self.group_data['name']).description,
                         self.group_data['description'])
        self.assertEqual(response.data['address'], self.group_data['address'])

    def test_create_group_fails_if_not_logged_in(self):
        data = {'name': 'random_name', 'description': 'still alive'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_groups(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_groups_as_user(self):
        self.client.force_login(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse('password' in response.data)

    def test_retrieve_group(self):
        url = self.url + str(self.group.id) + '/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_group_as_user(self):
        self.client.force_login(user=self.user)
        url = self.url + str(self.group.id) + '/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse('password' in response.data)

    def test_retrieve_group_as_member(self):
        self.client.force_login(user=self.member)
        url = self.url + str(self.group.id) + '/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('password' in response.data)

    def test_patch_group(self):
        url = self.url + str(self.group.id) + '/'
        response = self.client.patch(url, self.group_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_patch_group_as_user(self):
        self.client.force_login(user=self.user)
        url = self.url + str(self.group.id) + '/'
        response = self.client.patch(url, self.group_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_patch_group_as_member(self):
        self.client.force_login(user=self.member)
        url = self.url + str(self.group.id) + '/'
        response = self.client.patch(url, self.group_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_change_timezone_to_invalid_value_fails(self):
        self.client.force_login(user=self.member)
        url = self.url + str(self.group.id) + '/'
        response = self.client.patch(url, {'timezone': 'alksjdflkajw'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.data)
        self.assertEqual(response.data, {'timezone': ['Unknown timezone']})

    def test_get_conversation(self):
        self.client.force_login(user=self.member)
        response = self.client.get('/api/groups/{}/conversation/'.format(self.group.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn(self.member.id, response.data['participants'])

    def test_join_group(self):
        self.client.force_login(user=self.user)
        response = self.client.post('/api/groups/{}/join/'.format(self.group.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_join_group_with_password(self):
        self.client.force_login(user=self.user)
        response = self.client.post(self.join_password_url, {"password": "abc"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_join_group_with_password_fails_if_wrong(self):
        self.client.force_login(user=self.user)
        response = self.client.post(self.join_password_url, {"password": "wrong"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_join_group_with_password_fails_if_empty(self):
        self.client.force_login(user=self.user)
        response = self.client.post(self.join_password_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_join_group_fails_if_not_logged_in(self):
        response = self.client.post('/api/groups/{}/join/'.format(self.group.id))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_leave_group(self):
        store = StoreFactory(group=self.group)
        pickupdate = PickupDateFactory(
            store=store,
            collectors=[self.member, self.user],
            date=timezone.now() + relativedelta(weeks=1))
        past_pickupdate = PickupDateFactory(
            store=store,
            collectors=[self.member, ],
            date=timezone.now() - relativedelta(weeks=1)
        )
        unrelated_pickupdate = PickupDateFactory(
            date=timezone.now() + relativedelta(weeks=1),
            collectors=[self.member, ],
        )
        GroupMembership.objects.create(group=unrelated_pickupdate.store.group, user=self.member)

        self.client.force_login(user=self.member)
        response = self.client.post('/api/groups/{}/leave/'.format(self.group.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(pickupdate.collectors.get_queryset().filter(id=self.member.id).exists())
        self.assertTrue(past_pickupdate.collectors.get_queryset().filter(id=self.member.id).exists())
        self.assertTrue(unrelated_pickupdate.collectors.get_queryset().filter(id=self.member.id).exists())

    def test_leave_group_fails_if_not_logged_in(self):
        response = self.client.post('/api/groups/{}/leave/'.format(self.group.id))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_group(self):
        url = self.url + str(self.group.id) + '/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_delete_group_as_user(self):
        self.client.force_login(user=self.user)
        url = self.url + str(self.group.id) + '/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_delete_group_as_member(self):
        self.client.force_login(user=self.member)
        url = self.url + str(self.group.id) + '/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)


class TestGroupMembershipsAPI(APITestCase):
    def setUp(self):
        self.admin = UserFactory()  # has membership management rights
        self.member = UserFactory()
        self.group = GroupFactory(members=[self.admin, self.member])
        self.membership = GroupMembership.objects.get(group=self.group, user=self.member)

    def test_add_membership_role(self):
        self.client.force_login(user=self.admin)
        role = roles.GROUP_MEMBERSHIP_MANAGER
        self.assertNotIn(role, self.membership.roles)
        response = self.client.put('/api/groups/{}/users/{}/roles/{}/'.format(self.group.id, self.member.id, role))
        self.assertIn(role, response.data['roles'])
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.membership.refresh_from_db()
        self.assertIn(role, self.membership.roles)

    def test_add_agreement_role(self):
        self.client.force_login(user=self.admin)
        role = roles.GROUP_AGREEMENT_MANAGER
        self.assertNotIn(role, self.membership.roles)
        response = self.client.put('/api/groups/{}/users/{}/roles/{}/'.format(self.group.id, self.member.id, role))
        self.assertIn(role, response.data['roles'])
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.membership.refresh_from_db()
        self.assertIn(role, self.membership.roles)

    def test_remove_role(self):
        self.client.force_login(user=self.admin)
        role = roles.GROUP_MEMBERSHIP_MANAGER
        self.membership.roles.append(role)
        self.membership.save()
        self.assertIn(role, self.membership.roles)
        response = self.client.delete('/api/groups/{}/users/{}/roles/{}/'.format(self.group.id, self.member.id, role))
        self.assertNotIn(role, response.data['roles'])
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.membership.refresh_from_db()
        self.assertNotIn(role, self.membership.roles)

    def test_add_role_for_invalid_group_fails(self):
        self.client.force_login(user=self.admin)
        role = roles.GROUP_MEMBERSHIP_MANAGER
        self.assertNotIn(role, self.membership.roles)
        response = self.client.put('/api/groups/{}/users/{}/roles/{}/'.format(99999, self.member.id, role))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.membership.refresh_from_db()
        self.assertNotIn(role, self.membership.roles)

    def test_add_role_for_invalid_user_fails(self):
        self.client.force_login(user=self.admin)
        role = roles.GROUP_MEMBERSHIP_MANAGER
        self.assertNotIn(role, self.membership.roles)
        response = self.client.put('/api/groups/{}/users/{}/roles/{}/'.format(self.group.id, 99999, role))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.membership.refresh_from_db()
        self.assertNotIn(role, self.membership.roles)

    def test_add_invalid_role_fails(self):
        self.client.force_login(user=self.admin)
        response = self.client.put('/api/groups/{}/users/{}/roles/{}/'
                                   .format(self.group.id, self.member.id, 'does not exist'))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.membership.refresh_from_db()
        self.assertNotIn('does not exist', self.membership.roles)

    def test_add_role_as_non_admin_fails(self):
        self.client.force_login(user=self.member)
        role = roles.GROUP_MEMBERSHIP_MANAGER
        self.assertNotIn(role, self.membership.roles)
        response = self.client.put('/api/groups/{}/users/{}/roles/{}/'.format(self.group.id, self.member.id, role))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.membership.refresh_from_db()
        self.assertNotIn(role, self.membership.roles)


class TestDefaultGroupMembership(APITestCase):
    def setUp(self):
        self.creator = UserFactory()
        self.member = UserFactory()

    def test_group_creator_is_initial_membership_manager(self):
        self.client.force_login(user=self.creator)
        response = self.client.post('/api/groups/', {'name': faker.name(), 'timezone': 'Europe/Berlin'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        group_id = response.data['id']

        membership = GroupMembership.objects.get(group=group_id, user=self.creator)
        role = roles.GROUP_MEMBERSHIP_MANAGER
        self.assertIn(role, membership.roles)

        # can't drop management rights as only admin
        self.client.delete('/api/groups/{}/users/{}/roles/{}/'.format(group_id, self.creator.id, role))
        membership.refresh_from_db()
        self.assertIn(role, membership.roles)

        # creator makes another person admin and drops own rights
        GroupModel.objects.get(id=group_id).add_member(self.member)
        response = self.client.put('/api/groups/{}/users/{}/roles/{}/'.format(group_id, self.member.id, role))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client.delete('/api/groups/{}/users/{}/roles/{}/'.format(group_id, self.creator.id, role))
        membership.refresh_from_db()
        self.assertNotIn(role, membership.roles)


class TestAgreementsAPI(APITestCase):
    def setUp(self):
        self.normal_member = UserFactory()
        self.agreement_manager = UserFactory()
        self.group = GroupFactory(members=[self.normal_member, self.agreement_manager, ])
        self.agreement = Agreement.objects.create(group=self.group, title=faker.text(), content=faker.text())
        membership = GroupMembership.objects.get(group=self.group, user=self.agreement_manager)
        membership.roles.append(roles.GROUP_AGREEMENT_MANAGER)
        membership.save()

        # other group/agreement that neither user is part of
        self.other_group = GroupFactory()
        self.other_agreement = Agreement.objects.create(group=self.other_group, title=faker.text(),
                                                        content=faker.text())

    def test_can_create_agreement(self):
        self.client.force_login(user=self.agreement_manager)
        response = self.client.post('/api/agreements/',
                                    {'title': faker.text(), 'content': faker.text(), 'group': self.group.id})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_cannot_create_agreement_for_another_group(self):
        self.client.force_login(user=self.agreement_manager)
        response = self.client.post('/api/agreements/',
                                    {'title': faker.text(), 'content': faker.text(), 'group': self.other_group.id})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_can_update_agreement(self):
        self.client.force_login(user=self.agreement_manager)
        response = self.client.patch('/api/agreements/{}/'.format(self.agreement.id), {'title': faker.name()})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_normal_member_cannot_create_agreement(self):
        self.client.force_login(user=self.normal_member)
        response = self.client.post('/api/agreements/',
                                    {'title': faker.name(), 'content': faker.text(), 'group': self.group.id})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_agreements(self):
        self.client.force_login(user=self.normal_member)
        response = self.client.get('/api/agreements/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['agreed'], False)

    def test_view_agreement(self):
        self.client.force_login(user=self.normal_member)
        response = self.client.get('/api/agreements/{}/'.format(self.agreement.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.agreement.title)
        self.assertEqual(response.data['content'], self.agreement.content)

    def test_can_agree(self):
        self.client.force_login(user=self.normal_member)
        response = self.client.post('/api/agreements/{}/agree/'.format(self.agreement.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['agreed'], True)

    def test_can_agree_is_idempotent(self):
        self.client.force_login(user=self.normal_member)
        response = self.client.post('/api/agreements/{}/agree/'.format(self.agreement.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.post('/api/agreements/{}/agree/'.format(self.agreement.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(UserAgreement.objects.filter(user=self.normal_member, agreement=self.agreement).count(), 1)

    def test_cannot_view_agreements_for_other_groups(self):
        self.client.force_login(user=self.normal_member)
        response = self.client.get('/api/agreements/{}/'.format(self.other_agreement.id))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_cannot_agree_agreements_for_other_groups(self):
        self.client.force_login(user=self.normal_member)
        response = self.client.post('/api/agreements/{}/agree/'.format(self.other_agreement.id))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_can_set_group_agreement(self):
        self.client.force_login(user=self.agreement_manager)
        response = self.client.patch('/api/groups/{}/'.format(self.group.id), {'active_agreement': self.agreement.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_cannot_set_group_agreement_if_for_wrong_group(self):
        self.client.force_login(user=self.agreement_manager)
        response = self.client.patch('/api/groups/{}/'.format(self.group.id),
                                     {'active_agreement': self.other_agreement.id})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_normal_user_cannot_group_agreement(self):
        self.client.force_login(user=self.normal_member)
        response = self.client.patch('/api/groups/{}/'.format(self.group.id), {'active_agreement': self.agreement.id})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
