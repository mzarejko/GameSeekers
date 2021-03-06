from django.urls import path
from accounts import views 
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', views.RegisterAPI.as_view(), name='register'),
    path('login/', views.LoginAPI.as_view(), name='login'),
    path('logout/', views.LogoutAPI.as_view(), name='logout'),
    path('verification/', views.VerifyEmail.as_view(), name='email-verfication'),
    path('refresh-token/', TokenRefreshView.as_view(), name='refresh-token'),
]

