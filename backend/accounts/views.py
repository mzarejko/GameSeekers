from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from accounts import serializers
from accounts.models import User  

class GetUsers(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = serializers.UsernameSerializer

    def get_queryset(self):
        users = User.objects.all()
        return users
