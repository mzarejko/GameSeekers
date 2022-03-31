from django.urls import path
from accounts import views 

urlpatterns = [
    path('users/', views.GetUsers.as_view(), name='users'),
]

