from enum import Enum

class Action(Enum):

    @classmethod
    def module_name(cls):
        return 'wall'

    CREATE = 'create'
    COMMENT = 'comment'
    READ = 'read'
    EDIT = 'edit'
    DELETE = 'delete'
