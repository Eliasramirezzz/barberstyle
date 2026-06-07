from .base import *
from decouple import config

DEBUG = True

ALLOWED_HOSTS = []

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # ← debe ser el primero 
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='3306'),
        'OPTIONS': {
            'charset': 'utf8mb4'
        },
    }
}

# Permitir que los navegadores usen el back y front osea puerto diferentes sin ser bloqueados las requers.
# O, si no querés renegar en desarrollo, usá esta (solo para dev.py!):
CORS_ALLOW_ALL_ORIGINS = True