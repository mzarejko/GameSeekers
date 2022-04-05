import os 
from celery import Celery

if not os.environ.get('DJANGO_SETTINGS_MODULE'):
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'base.develop')

# url redis:6379 for docker-compose
BASE_REDIS_URL = os.environ.get('REDIS_URL', 'redis://redis:6379/0')
app = Celery('base')
app.config_from_object('django.conf:settings')
app.conf.broker_url = BASE_REDIS_URL
app.autodiscover_tasks()


