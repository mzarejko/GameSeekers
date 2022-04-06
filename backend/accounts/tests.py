from django.test import TestCase
from accounts.models import User
from django.urls import reverse
from rest_framework import status
import json
from rest_framework_simplejwt.tokens import RefreshToken

class RegisterTests(TestCase):

    def setUp(self):
        self.payload = {'username': 'czupakabra',
                        'email': 'test@test.com', 
                        'password1': 'test',
                        'password2': 'test'}

        self.invalid_payload = {'username': 'czupakabra',
                                'email': 'test@test.com', 
                                'password1': 'sest',
                                'password2': 'test'}
    def test_create_account(self):
        url = reverse('register')
        response = self.client.post(url, data=json.dumps(self.payload), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(username='czupakabra')
        user.delete()

    def test_wrong_passwords(self):
        url = reverse('register')
        response = self.client.post(url, data=json.dumps(self.invalid_payload), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class LoginLogoutTests(TestCase):

    def setUp(self):
        self.payload = {'username': 'czupakabra',
                        'password': 'test'}

        self.invalid_payload = {'username': 'czupakabra',
                                'password': 'efef'}

        user = User.objects.create(username='czupakabra',
                            email='test@test.com',
                            is_verified=True,
                            is_active=True)
        user.set_password('test')
        user.save()

    def test_login(self):
        url = reverse('login')
        response = self.client.post(url, data=json.dumps(self.payload), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user = User.objects.get(username='czupakabra')
        user.delete()

    def test_wrong_login(self):
        url = reverse('register')
        response = self.client.post(url, data=json.dumps(self.invalid_payload), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LogoutTests(TestCase):

    def setUp(self):
        user = User.objects.create(username='czupakabra',
                            email='test@test.com',
                            is_verified=True,
                            is_active=True)
        user.set_password('test')
        user.save()
        self.refresh = user.tokens()['refresh']

    def test_logout(self):
        url = 'http://0.0.0.0:8000/v1/accounts/logout/?refresh='+self.refresh
        response = self.client.post(url, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user = User.objects.get(username='czupakabra')
        user.delete()

