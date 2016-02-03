from yunity.base.action_enum import ActionEnum

class Action(ActionEnum):

    @classmethod
    def module_name(cls):
        return 'group'

    CREATE = 'create'
    DELETE = 'delete'
    EDIT = 'edit'
    JOIN = 'join'
    MANAGE_TEAMS = 'manage-teams'