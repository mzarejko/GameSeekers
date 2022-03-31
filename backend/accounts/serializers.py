from rest_framework import serializers
from accounts.models import User 

class UsernameSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']
