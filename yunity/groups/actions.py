from enum import Enum

class Action(Enum):

    @classmethod
    def module_name(cls):
        return 'wall'

    CREATE = 'create'
    DELETE = 'delete'
    EDIT = 'edit'
    JOIN = 'join'
    MANAGE_TEAMS = 'manage-teams'