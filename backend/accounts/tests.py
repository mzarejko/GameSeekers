from django.test import TestCase
from accounts.models import User

class UserTestCase(TestCase):

    USERNAME = 'chuck noris'
    EMAIL = 'test@test.com'
    PASSWORD = 'hakunamatata'
    
    def setUp(self):
        user = User(username=self.USERNAME,
                    email=self.EMAIL)
        user.set_password(self.PASSWORD)
        user.save()
        print('setup')

    def test_create_user(self):
        user = User.objects.get(username=self.USERNAME)
        self.assertNotEqual(user, None)

    def tearDown(self):
        user = User.objects.get(username=self.USERNAME)
        user.delete()
        


