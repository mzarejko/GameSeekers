# tu będzie env dla produkcji jak bedzie nam sie chciało
from pathlib import Path
import os
import dj_database_url
import django_heroku
from .base import *

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY= os.environ.get('SECRET_KEY') 
DEBUG = False
ALLOWED_HOSTS = ['game-seekers-backend.herokuapp.com']
DATABASES = {}
DATABASES['default'] = dj_database_url.config(conn_max_age=600)
STATIC_URL = '/staticfiles/static/'
STATIC_ROOT = 'static'
MEDIA_URL = '/staticfiles/media/'

INSTALLED_APPS += [
    "whitenoise.runserver_nostatic",
]

# add this middleware to base settings
MIDDLEWARE += ['whitenoise.middleware.WhiteNoiseMiddleware',]
STATICFILES_STORAGE = 'whitenoise.storage.CompressedStaticFilesStorage'

# this will automatically configure DATABASE and HOSTS 
django_heroku.settings(locals())


