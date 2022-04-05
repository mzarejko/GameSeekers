from django.core.mail import EmailMessage
from base.celery import app

@app.task
def send_email(data):
    email = EmailMessage(subject=data['header'], body=data['text'],
                         to=[data['who']])
    email.send()
