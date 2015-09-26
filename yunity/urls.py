
from django.conf.urls import include, url

from yunity import views


urlpatterns = [
    url(r'^login/', views.login),
]
