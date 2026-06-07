
from pathlib import Path
from decouple import config
from datetime import timedelta
import os # Agregamos esta libreria para importar carpetas u archivos staticos.

BASE_DIR = Path(__file__).resolve().parent.parent.parent # Tres veces .parent porque estamos en la carpeta config luego en settings osea //back/config/settings
SECRET_KEY = config('SECRET_KEY')

# Esto lo agregamos para servir imagenes en una carpeta llamada medi
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media') # Agregamos la carpeta media

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    #Aplicaciones de nosotro
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'users', # Nuestra app de login
    'turnos', # Nuestra app de gestion de turnos y servicios.
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

STATIC_URL = 'static/'

# Configuración de Django REST Framework
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination', 
    'PAGE_SIZE': 20
}

AUTH_USER_MODEL = 'users.user'

# Configuracion del Token
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME':  timedelta(minutes=60),    # el token expira en 1 hora 
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),     # refresh dura 1 días 
    'ROTATE_REFRESH_TOKENS':  True,    # cada refresh genera un nuevo refresh token 
    'BLACKLIST_AFTER_ROTATION': True,  # el token viejo queda inválido 
    'AUTH_HEADER_TYPES': ('Bearer',),  # formato: Authorization: Bearer <token> 

}

# Configuracion general del token
CORS_ALLOW_HEADERS = [
    'accept', 'authorization', 'content-type'
]