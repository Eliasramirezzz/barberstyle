from .base import *
import dj_database_url

DEBUG = False # Siempre false o falso par aproduccion.

ALLOWED_HOSTS = [config('ALLOWED_HOST', default='*'), '.onrender.com']

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # ← debe ser el primero 
    'django.middleware.security.SecurityMiddleware',
        'corsheaders.middleware.WhiteNoiseMiddleware',# whitenoise sirve los archivos estáticos directamente desde Django sin necesitar un servidor nginx  en fin archivos estatico en la nube. y siepre despues de la seguridad.
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Base de datos desde DATABASE_URL (Railway/Render la genera sola)
DATABASES =   {
  'default': dj_database_url.config(
    default=config('DATABASE_URL')
  )
}

# Archivos estáticos (CSS/JS del admin de Django)
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

#Permiso del navegador.
CORS_ALLOW_ALL_ORIGINS = [config('FRONTEND_URL', default='http://localhost:5173')]