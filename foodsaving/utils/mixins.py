from rest_framework.mixins import UpdateModelMixin


class PartialUpdateModelMixin(object):
    """
    Update a model instance.
    Only allow PATCH, no PUT
    """

    def perform_update(self, serializer):
        serializer.save()

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return UpdateModelMixin.update(self, request, *args, **kwargs)
