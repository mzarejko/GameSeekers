# tu będzie env dla produkcji jak bedzie nam sie chciało
from pathlib import Path
import os
import dj_database_url
import django_heroku
from datetime import timedelta
from .base import *

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY= os.environ.get('SECRET_KEY') 
DEBUG = False
ALLOWED_HOSTS = ['game-seekers-backend.herokuapp.com']
DATABASES = {}
DATABASES['default'] = dj_database_url.config(conn_max_age=600)

STATIC_URL = '/static/'
STATIC_ROOT = 'staticfiles/static/'
MEDIA_ROOT = 'staticfiles/media/'
MEDIA_URL = '/media/'

INSTALLED_APPS += [
    "whitenoise.runserver_nostatic",
]

# add this middleware to base settings
MIDDLEWARE += ['whitenoise.middleware.WhiteNoiseMiddleware',]
STATICFILES_STORAGE = 'whitenoise.storage.CompressedStaticFilesStorage'

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': False,

    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,

    'AUTH_HEADER_TYPES': ('Bearer'),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',

    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',

    'JTI_CLAIM': 'jti',

    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
    'SLIDING_TOKEN_LIFETIME': timedelta(minutes=5),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
}

# this will automatically configure DATABASE and HOSTS 
django_heroku.settings(locals())


