
from django import forms
from django.contrib.auth import login, authenticate
from django.contrib.auth.models import User
from django.views.generic import View
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import serializers

import logging

from yunity import models
from yunity.utils.api import ApiBase

# Get an instance of a logger
logger = logging.getLogger(__name__)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = ('id', 'email')


class LoginView(APIView):

    def get(self, request):
        if request.user.is_authenticated():
            user = UserSerializer(request.user)
            return Response(user.data)
        else:
            return Response({'message': 'no user'})


class RegisterView(ApiBase, View):

    class RegisterForm(forms.Form):
        email = forms.EmailField()
        password = forms.CharField(min_length=6, max_length=64)

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
