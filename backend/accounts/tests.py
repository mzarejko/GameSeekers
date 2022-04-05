from django.test import TestCase
from accounts.models import User
from rest_framework.test import RequestsClient


class RegistrationCase(TestCase):

    USERNAME = 'chuck noris'
    EMAIL = 'efefef.com'
    PASSWORD = 'hakunamatata'
    INVALID_PASSWORD = 'hakunkshfkhfjwo'
    
    def setUp(self):
        client = RequestsClient()

    def test_validate_password(self):
        response = self.client.post('http://0.0.0.0:8000/v1/accounts/register/', json={
            'username': self.USERNAME,
            'email': self.EMAIL,
            'password1': self.PASSWORD,
            'password2': self.INVALID_PASSWORD
        })
        assert response.status_code == 400

    def test_create_user(self):
        response = self.client.post('http://0.0.0.0:8000/v1/accounts/register/', json={
            'username': self.USERNAME,
            'email': self.EMAIL,
            'password1': self.PASSWORD,
            'password2': self.PASSWORD
        })
        assert response.status_code == 201

    def test_validate_duplicated(self):
        response = self.client.post('http://0.0.0.0:8000/v1/accounts/register/', json={
            'username': self.USERNAME,
            'email': self.EMAIL,
            'password1': self.PASSWORD,
            'password2': self.PASSWORD
        })
        assert response.status_code == 400

        

class LoginCase(TestCase):

    USERNAME = 'chuck noris'
    EMAIL = 'test@test.com'
    PASSWORD = 'hakunamatata'
    INVALID_PASSWORD = 'hakunkshfkhfjwo'
    
    def setUp(self):
        client = RequestsClient()
        User.objects.create(username=self.USERNAME,
                            email=self.EMAIL,
                            password=self.PASSWORD,
                            is_active=True,
                            is_verfied=True)

    def validate_login(self):
        response = self.client.post('http://0.0.0.0:8000/v1/accounts/login/', json={

            'email': self.EMAIL,
            'password': self.PASSWORD,
        })
        assert response.status_code == 200
        assert response.access != None
        assert response != None
    
    def tearDown(self):
        user = User.objects.get(username=self.USERNAME)
        user.delete()

