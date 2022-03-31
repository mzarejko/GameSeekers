# env do lokalnego developmentu
from pathlib import Path
from .base import *
import os

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = 'django-insecure-2m2exf+or)f$dj*hc(4w$#zzqkx!0$5^e#0cuey7^i&icxmc1m'
DEBUG = True
ALLOWED_HOSTS = ['0.0.0.0']
STATIC_URL = 'static/'
STATIC_ROOT = 'static'

DATABASES = {
    'default': {
       'ENGINE': 'django.db.backends.postgresql',
       'NAME': 'GameSeekers',
       'USER': 'rychu',
       'PASSWORD': 'peja',
       'HOST': 'db',
       'PORT': '5432',
    }
}


