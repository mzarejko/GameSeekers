from django.urls import path
from accounts import views 

urlpatterns = [
    path('users/', views.GetUsers.as_view(), name='users'),
    path('register/', views.RegisterAPI.as_view(), name='register'),
    path('login/', views.LoginAPI.as_view(), name='login'),
    path('logout/', views.LogoutAPI.as_view(), name='logout'),
    path('email-verification/', views.VerifyEmail.as_view(), name='email-verfication'),
]

