
from django import forms
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.views.generic import View
from django.shortcuts import render

from yunity.utils.api import ApiBase


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

class CreateItemView(ApiBase, View):

    def get(self, request):
        'TODO: remove'
        return render(request, 'create_item.html')

    def post(self, request):

        item = Item.objects.create(name=request.POST['name'], description=request.POST['description'], latitude=request.POST['latitude'], longitude=request.POST['longitude'])

        if item:
            return self.json_response({
                'message': 'item created successfully'
            })