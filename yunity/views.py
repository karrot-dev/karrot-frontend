
from django import forms
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.views.generic import View
from django.shortcuts import render
from .models import Mappable, Category
import logging

from django.forms.models import model_to_dict
from yunity.utils.api import ApiBase

# Get an instance of a logger
logger = logging.getLogger(__name__)

class LoginView(ApiBase, View):

    def get(self, request):
        'TODO: remove'
        return render(request, 'login.html')

    def post(self, request):

        user = authenticate(
            username=request.POST['email'],
            password=request.POST['password'],
        )

        if user:
            return self.json_response()
        else:
            return self.json_response({
                'message': 'could not authenticate'
            }, self.STATUS_ERROR)


class RegisterView(ApiBase, View):

    class RegisterForm(forms.Form):
        email = forms.EmailField()
        password = forms.CharField(min_length=6, max_length=64)

    def get(self, request):
        'TODO: remove'
        return render(request, 'register.html')

    def post(self, request):

        form = self.RegisterForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            user = User.objects.filter(
                username=email
            ).first()

            if user:
                return self.json_response({}, self.STATUS_ERROR)
            else:
                user = User.objects.create(username=email)
                user.set_password(password)
                user.save()
                return self.json_response()
        else:
            return self.json_response({
                'errors': form.errors
            }, self.STATUS_ERROR)

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

        item = Mappable.objects.create(category=category, description=description, latitude=latitude, longitude=longitude)

        if item:
            return self.json_response({
                'message': 'item created successfully'
            })

class GetMappableView(ApiBase, View):

    def get(self, request, mappable_id):
        'TODO: remove'
        mappable = Mappable.objects.get(id=mappable_id)
        logger.error('Mappable ID: ' + str(mappable.id))
        #return render(request, 'get_mappable.html', { 'mappable': mappable })

        return self.json_response(model_to_dict(mappable))
