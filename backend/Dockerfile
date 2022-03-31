FROM python:3.10

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONOTWRITEBYTECODE 1

COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

RUN apt-get update && apt-get install net-tools 
RUN apt-get install -y netcat

COPY . .





