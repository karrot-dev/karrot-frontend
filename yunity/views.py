from django.shortcuts import render

from django.contrib.auth import authenticate

from django import forms

from django.views.generic import View

from django.contrib.auth.models import User

from yunity.utils.api import ApiBase



class LoginView(ApiBase, View):

    def get(self, request):
        return render(request, 'login.html')

    def post(self, request):

        result = authenticate(username=request.POST['email'], password=request.POST['password'])

        return self.json_response(data={
            "result": result
        })


class SignupView(ApiBase, View):

    def get(self, request):
        return render(request, 'login.html')

    def post(self, request):

        user, created = User.objects.get_or_create(
            username=request.POST['email'],
            defaults={
                'password': request.POST['password']
            }
        )

        if created:
            return self.json_response({
               "resust" : {}
            });

        else:
            return self.json_response({},self.STATUS_ERROR)


