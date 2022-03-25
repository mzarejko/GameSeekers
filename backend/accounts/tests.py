from django.test import TestCase
from .models import User

class UserTestCase(TestCase):
    def SetUp(self):
        user = User.objects.create(username="chuck noris",
                            email="jfkwf@efe.com")
        user.set_password('111111')
        user.save()
        print(user)


    def test_create_user(self):
        user = User.objects.get(username="chuck noris")
        self.assertNotEqual(user, None)
