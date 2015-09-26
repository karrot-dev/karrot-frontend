from django.shortcuts import render

from django.contrib.auth import authenticate

from django import forms

class LoginForm(forms.Form):


def login(request):
    if request.method == 'POST':
        print("TODO")
        # authenticate(username=)
    elif request.method == 'GET':
        return render(request, 'login.html')