from rest_framework.response import Response


class PartialUpdateModelMixin(object):
    """
    Update a model instance.
    Only allow PATCH, no PUT
    """
    def perform_update(self, serializer):
        serializer.save()

    def partial_update(self, request, *args, **kwargs):
        partial = True
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
