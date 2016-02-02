from itertools import chain

from django.contrib.contenttypes.models import ContentType
from yunity.base.other_models import Group
from yunity.permissions.models import UserPermission, UserConnectionPermission, HubPermission, GroupTreePermission, \
    ConstantPermission, ConstantPermissionType
from yunity.users.models import UserConnection, User


def permissions_query(user, filter, field):
    group_ids = None
    values_list_kwargs = {}

    if isinstance(field, str):
        fields = [field]
        values_list_kwargs['flat'] = True
    else:
        fields = field

    constant_actions = ConstantPermission.objects.filter(**filter).filter(
            type=ConstantPermissionType.PUBLIC).values_list(*fields, **values_list_kwargs)

    user_actions = []
    user_connection_actions = []
    registered_user_actions = []
    hub_actions = []
    if user:
        user_id = user.id
        group_ids = user.hub_set.targets_with_content_type(Group)

        user_actions = UserPermission.objects.filter(user_id=user_id, **filter).values_list(*fields,
                                                                                            **values_list_kwargs)
        """ UserConnectionPermissions include all users where connected users get an action granted
            so we filter by any user we are connected to to be in that table

            This may be optimized to a single query by using raw SQL when necessary
            """
        connected_user_ids_a = UserConnection.objects.filter(confirmed=True).filter(requester_id=user_id).values_list(
                'requestee_id', flat=True)
        connected_users_ids_b = UserConnection.objects.filter(confirmed=True).filter(requestee_id=user_id).values_list(
                'requester_id', flat=True)
        connected_user_ids = chain(connected_user_ids_a, connected_users_ids_b)
        user_connection_actions = UserConnectionPermission.objects.filter(**filter).filter(
                user_id__in=connected_user_ids).values_list(*fields, **values_list_kwargs)

        registered_user_actions = ConstantPermission.objects.filter(**filter).filter(
            type=ConstantPermissionType.REGISTERED_USERS).values_list(*fields, **values_list_kwargs)

        """ Collect all hubs the user is a member of """
        hubs = user.hub_set.all()
        hub_actions = HubPermission.objects.filter(**filter).filter(hub__in=hubs).values_list(*fields,
                                                                                              **values_list_kwargs)

    group_tree_actions = []
    if group_ids:
        """ The following group hierarchy queries should be optimized soon to be done completely in SQL.
        """
        groups = Group.objects.filter(id__in=group_ids)
        group_parents = list(chain.from_iterable(g.parents() for g in groups))
        group_tree_actions = GroupTreePermission.objects.filter(**filter).filter(
                group__in=group_parents).values_list(*fields, **values_list_kwargs)

    return chain(constant_actions, user_actions, user_connection_actions, registered_user_actions, hub_actions,
                 group_tree_actions)


def list_targets_with_class(user, target_class):
    ctype = ContentType.objects.get_for_model(target_class)
    ctype_params = { 'target_content_type_id': ctype.id }
    target_fields = permissions_query(user, filter=ctype_params, field=['target_id', 'action'])
    target_ids = []
    target_id_to_action_map = {}
    for target_id, action in target_fields:
        target_ids.append(target_id)
        if not target_id in target_id_to_action_map:
            target_id_to_action_map[target_id] = []
        target_id_to_action_map[target_id].append(action)
    targets = ctype.get_all_objects_for_this_type().filter(id__in=target_ids)
    return map(lambda x: (x, target_id_to_action_map[x.id]), targets)


def list_actions_for_target(user, target):
    ctype = ContentType.objects.get_for_model(target)
    target_params = {'target_content_type_id': ContentType.objects.get_for_model(target).id, 'target_id': target.id}
    return list(permissions_query(user, filter=target_params, field='action'))


def can(user, action, target):
    return action in list_actions_for_target(user, target)