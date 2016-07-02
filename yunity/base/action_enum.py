from enum import Enum


class ActionEnum(Enum):

    def __str__(self):
        return self.value

    def to_params(self):
        return {'module': self.module_name(), 'action': self.value}

    def to_tuple(self):
        return (self.module_name(), self.value)
