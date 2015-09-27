
from django.conf.urls import include, url

from yunity import views


urlpatterns = [
    url(r'^login/', views.LoginView.as_view()),
    url(r'^register/', views.RegisterView.as_view()),
    url(r'^items/new', views.CreateItemView.as_view())
]
