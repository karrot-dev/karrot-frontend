from itertools import chain

from django.contrib.contenttypes.models import ContentType
from django.db.models import Q
from yunity.base.hub_models import Hub
from yunity.base.other_models import Group
from yunity.permissions.models import UserPermission, UserConnectionPermission, HubPermission, GroupTreePermission, \
    ConstantPermission, ConstantPermissionType
from yunity.users.models import UserConnection


def list_actions_for_target(user_id, group_ids, target):
    ctype = ContentType.objects.get_for_model(target)
    target_params = {'target_content_type_id': ContentType.objects.get_for_model(target).id, 'target_id': target.id}

    constant_actions = ConstantPermission.objects.filter(**target_params).filter(
            type=ConstantPermissionType.PUBLIC).values_list('action', flat=True)

    user_actions = []
    user_connection_actions = []
    registered_user_actions = []
    if user_id:
        user_actions = UserPermission.objects.filter(user_id=user_id, **target_params).values_list('action', flat=True)
        """ UserConnectionPermissions include all users where connected users get an action granted
            so we filter by any user we are connected to to be in that table

            This may be optimized to a single query by using raw SQL when necessary
            """
        connected_user_ids_a = UserConnection.objects.filter(confirmed=True).filter(requester_id=user_id).values_list(
                'requestee_id', flat=True)
        connected_users_ids_b = UserConnection.objects.filter(confirmed=True).filter(requestee_id=user_id).values_list(
                'requester_id', flat=True)
        connected_user_ids = chain(connected_user_ids_a, connected_users_ids_b)
        user_connection_actions = UserConnectionPermission.objects.filter(**target_params).filter(
                user_id__in=connected_user_ids).values_list('action', flat=True)

        registered_user_actions = ConstantPermission.objects.filter(**target_params).filter(
            type=ConstantPermissionType.REGISTERED_USERS).values_list('action', flat=True)

    hub_actions = []
    group_tree_actions = []
    if group_ids:
        hubs = Hub.objects.filter(target_content_type_id=ContentType.objects.get_for_model(Group)).filter(
                target_id__in=group_ids)
        hub_actions = HubPermission.objects.filter(**target_params).filter(hub__in=hubs).values_list('action',
                                                                                                     flat=True)

        """ The following group hierarchy queries should be optimized soon to be done completely in SQL.
        """
        groups = Group.objects.filter(id__in=group_ids)
        group_parents = list(chain.from_iterable(g.parents() for g in groups))
        group_tree_actions = GroupTreePermission.objects.filter(**target_params).filter(
                group__in=group_parents).values_list('action', flat=True)

    actions = chain(constant_actions, user_actions, user_connection_actions, registered_user_actions, hub_actions, group_tree_actions)
    return list(actions)
