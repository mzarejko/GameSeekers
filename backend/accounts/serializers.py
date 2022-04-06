from rest_framework import serializers
from accounts.models import User 
from rest_framework.exceptions import ValidationError, AuthenticationFailed
from django.contrib import auth

class RegisterSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(required=True, write_only=True,
                                      style={'input_type': 'password'})
    password2 = serializers.CharField(required=True, write_only=True,
                                      style={'input_type': 'password'})
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']

    
    def create(self, data):
        password1 = data['password1'] 
        password2 = data['password2'] 

        if password1 != password2:
            raise ValidationError('passwords not match')

        if User.objects.filter(email=data['email'], 
                               is_verified=False).exists():
            user = User.objects.get(email=data['email'])
            user.username = data['username']
            user.password = data['password1']
            user.save()
            return user

        elif User.objects.filter(email=data['email'], is_verified=True).exists():
            raise ValidationError("email already have account")

        elif not User.objects.filter(email=data['email']).exists():
            user = User(
                username=data['username'],
                email=data['email'],
            )
            user.set_password(password1)
            user.save()
            return user

        raise ValidationError("validation error")

class LoginSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=True, write_only=True)
    password = serializers.CharField(write_only=True, required=True, 
                                     style={'input_type': 'password'})
    access = serializers.CharField(read_only=True)
    refresh = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'access', 'refresh']

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        user = auth.authenticate(username=username, password=password)

        if user is None:
            raise AuthenticationFailed('wrong password or email')
        elif not user.is_active:
            raise ValidationError('account deleted')
        elif not user.is_verified:
            raise ValidationError('account not verfied, firstly activate your profile')

        tokens = user.tokens()
        return {"access": tokens['access'],
                "refresh": tokens['refresh']} 
