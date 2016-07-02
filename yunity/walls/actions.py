from yunity.base.action_enum import ActionEnum


class Action(ActionEnum):

    @classmethod
    def module_name(cls):
        return 'wall'

    CREATE = 'create'
    COMMENT = 'comment'
    READ = 'read'
    EDIT = 'edit'
    DELETE = 'delete'
