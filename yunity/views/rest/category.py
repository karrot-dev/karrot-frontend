from rest_framework import viewsets, status
from rest_framework.decorators import detail_route
from rest_framework.response import Response
from yunity.models import Category


class CategoryViewSet(viewsets.ViewSet):
    """
    Handle categories
    """
    queryset = Category.objects.all()
    
    def create(self, request):
        """
        Create a new category

        {name}
        """
        return Response(status=status.HTTP_201_CREATED)

    def list(self):
        """
        List all categories
        """
        return Response(status=status.HTTP_200_OK)