
from django.views.generic import View
from django.shortcuts import render
from yunity.models import MapItem, Category
import logging

from django.forms.models import model_to_dict
from yunity.utils.api import ApiBase

# Get an instance of a logger
logger = logging.getLogger(__name__)


class CreateMappableView(ApiBase, View):

    def get(self, request):
        'TODO: remove'
        return render(request, 'create_mappable.html')

    def post(self, request):

        description = request.POST.get('description')
        latitude = request.POST.get('latitude')
        longitude = request.POST.get('longitude')
        category_name = request.POST.get('category')

        category = Category.objects.get_or_create(name=category_name)[0]

        item = MapItem.objects.create(category=category, description=description, latitude=latitude, longitude=longitude)

        if item:
            return self.json_response({
                'message': 'item created successfully'
            })

class GetMappableView(ApiBase, View):

    def get(self, request, mappable_id):
        'TODO: remove'
        mappable = MapItem.objects.get(id=mappable_id)
        logger.error('Mappable ID: ' + str(mappable.id))
        #return render(request, 'get_mappable.html', { 'mappable': mappable })

        return self.json_response(model_to_dict(mappable))

