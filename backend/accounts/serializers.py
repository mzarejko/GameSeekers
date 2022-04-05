from rest_framework import serializers
from accounts.models import User 
from rest_framework.exceptions import ValidationError, AuthenticationFailed
from django.contrib import auth
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import PasswordResetTokenGenerator

class UsernameSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']

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
    email = serializers.EmailField(required=True, write_only=True)
    password = serializers.CharField(write_only=True, required=True)
    access = serializers.CharField(read_only=True)
    refresh = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'access', 'refresh']

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        user = auth.authenticate(email=email, password=password)

        if user is None:
            raise AuthenticationFailed('wrong password or email')
        elif not user.is_active:
            raise ValidationError('account deleted')
        elif not user.is_verified:
            raise ValidationError('account not verfied, firstly activate your profile')

        tokens = user.tokens()
        return {"access": tokens['access'],
                "refresh": tokens['refresh']} 

class ResetPasswordSerializer(serializers.Serializer):
    
    class Meta:
        fields = ['email']

class SetNewPasswordSerializer(serializers.Serializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    token = serializers.CharField(write_only=True)
    uidb64 = serializers.CharField(write_only=True)

    class Meta:
        fields = ['password1', 'password2', 'token', 'uidb64']

    def validate(self, atr):
        try:
            password1 = atr.get('password1')
            password2 = atr.get('password2')
            token = atr.get('token')
            uidb64 = atr.get('uidb64')

            id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed('link is invalid')
            
            if password1 == password2:
                user.set_password(password1)
                user.save()
                return user
            else:
                raise ValidationError('passwords not match')
        except:
            raise ValidationError('bad request')
        return super().validate(atr)
