from django.shortcuts import render

from django.contrib.auth import authenticate

from django import forms

from django.views.generic import View

from yunity.utils.api import ApiBase


class LoginView(ApiBase, View):

    def get(self, request):
        return render(request, 'login.html')

    def post(self, request):

        result = authenticate(username=request.POST['email'], password=request.POST['password'])

        return self.json_response(data={
            "result": result
        })