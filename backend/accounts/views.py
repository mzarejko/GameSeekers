from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
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
    
    @swagger_auto_schema(tags=["accounts"], request_body=serializers.LoginSerializer)
    def post(self, request):
        serializer = serializers.LoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            return Response(serializer.data, status=status.HTTP_200_OK)

class RegisterAPI(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(tags=["accounts"], request_body=serializers.RegisterSerializer)
    def post(self, request):
        serializer = serializers.RegisterSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.create(data=request.data)

            user = User.objects.get(email=serializer.data['email'])
            token = RefreshToken.for_user(user).access_token

            current_site = get_current_site(request).domain
            relativeLink = reverse('email-verfication')
            absurl = 'http://'+current_site+relativeLink+"?token="+str(token)

            email_body = f'Hi {user.username},\n Click this link to activate your account:  \n {absurl}'
            mail = {'text': email_body, 'who': user.email, 'header': 'Verfication'}
            send_email.delay(mail)
            return Response({"Check your mail for activation link"}, status=status.HTTP_201_CREATED)

class VerifyEmail(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(tags=["accounts"], manual_parameters=[
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

    @swagger_auto_schema(tags=["accounts"],
        manual_parameters=[
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

