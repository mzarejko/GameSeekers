from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from accounts import serializers
from accounts.models import User  
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from .tasks import send_email
from django.conf import settings
import jwt
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


class LoginAPI(APIView):
    permission_classes = [AllowAny]
    
    @swagger_auto_schema(request_body=serializers.LoginSerializer,
                         responses={'200': 'ok',
                                    '400': 'validation error'}
                         )
    def post(self, request):
        serializer = serializers.LoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            return Response(serializer.data, status=status.HTTP_200_OK)

class RegisterAPI(APIView):
    permission_classes = [AllowAny]

    def send_activation(self, user, token, request):

        current_site = get_current_site(request).domain
        relativeLink = reverse('email-verfication')
        absurl = 'http://'+current_site+relativeLink+"?token="+str(token)

        email_body = f'Hi {user.username},\n Click this link to activate your account:  \n {absurl}'
        mail = {'text': email_body, 'who': user.email, 'header': 'Verfication'}
        send_email.delay(mail)

    @swagger_auto_schema(request_body=serializers.RegisterSerializer,
                         responses={'200': 'ok',
                                    '400': 'validation error'}
                         )
    def post(self, request):
        serializer = serializers.RegisterSerializer(data=request.data)
        if  User.objects.filter(email=request.data["email"],
                                is_verified=False).exists():
            user = User.objects.filter(email=request.data["email"],
                                    is_verified=False).first()
            serializer.validate(request.data)
            user.username = request.data["username"]
            user.set_password(request.data["password1"])
            token = RefreshToken.for_user(user).access_token
            self.send_activation(user, token, request)
            
        elif serializer.is_valid(raise_exception=True):
            serializer.save()
            user = User.objects.get(username = serializer.data['username'],
                                    email=serializer.data['email'])
            token = RefreshToken.for_user(user).access_token
            self.send_activation(user, token, request)
        return Response({"Check your mail for activation link"}, status=status.HTTP_200_OK)

class VerifyEmail(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(responses={'200': 'ok',
                                    '400': 'validation error'},
                        manual_parameters=[
                            openapi.Parameter('token',
                            openapi.IN_QUERY,
                            type=openapi.TYPE_STRING)
                        ])
    def get(self, request):
        token = request.GET.get('token')

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms='HS256')
            user = User.objects.get(id=payload['user_id'])
            if not user.is_verified:
                user.is_verified = True
                user.save()

            return Response({'Successfully activated'}, status=status.HTTP_200_OK)
        except jwt.ExpiredSignatureError:
            return Response({'detail': 'token expired'}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.exceptions.DecodeError:
            return Response({'detail': 'invalid token'}, status=status.HTTP_400_BAD_REQUEST)


class LogoutAPI(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(manual_parameters=[
            openapi.Parameter('refresh',
                          openapi.IN_QUERY,
                          type=openapi.TYPE_STRING)
        ]
    )
    def post(self, request):
        try:
            refresh_token = request.GET.get("refresh")
            RefreshToken(refresh_token).blacklist()
        except TokenError:
            return Response({'detail': 'Token is invalid or expired'},
                            status=status.HTTP_400_BAD_REQUEST)
        return Response({'detail': 'Successful logout'}, status=status.HTTP_200_OK)

