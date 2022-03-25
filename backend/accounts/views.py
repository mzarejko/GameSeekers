from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from . import serializers
from .models import User  
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class GetUsers(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = serializers.UsernameSerializer

    def get_queryset(self):
        users = User.objects.all()
        return users
