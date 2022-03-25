FROM python:3.10

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONOTWRITEBYTECODE 1

WORKDIR /app/backend

COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

RUN apt-get update && apt-get install net-tools 
RUN apt-get install -y netcat

COPY . /app/backend/

RUN useradd user
USER user

EXPOSE 8000
