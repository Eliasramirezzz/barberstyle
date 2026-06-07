
from django.contrib import admin
from django.urls import path, include # Lo necesitamos el include
# Librerias de token de seguridad
from rest_framework_simplejwt.views import  TokenRefreshView, TokenVerifyView #Usamos la librerias correcta para django v6 en adelante.
from django.conf import settings # Esto es importante para el uso de las rutas estaticas
from django.conf.urls.static import static # Importante para las imágenes 
from users.views import MyTokenObtainPairView
from turnos.views import  HorariosDisponiblesView 


urlpatterns = [
    # Rutas de Autenticación
    path('admin/', admin.site.urls), # Esta la dejamos como esta.
    # Rutas para el sistema de Tokens (Seguridad). MODO NUEVO DE DJANGO
     path('api/turnos/horario-disponible/', HorariosDisponiblesView.as_view(), name='horarios-disponibles'), # La ponemo primero para evitar problema del include.

    # Agregamos las rutas de la app turnos.
    path('api/', include('turnos.urls')),
   
    path('api/auth/token/',  MyTokenObtainPairView.as_view(), name='token_obtain_pair'), # Es para obtener el token personalizado ya traduccido del serializer. Es una locura
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # Es para renovar el token cuando se expira
    path('api/auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'), # Es para verificar el token
    
]

# Aca manejamos las url del proyecto, pero vamos a manejar las imagenes de los servicios.
# Habilitamos la carpeta /media/ para que Django exponga las imágenes
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    # Funciona asi: agrego a las url, una ruta statica, esa carpeta sera media, luego le decimos que la carpeta es la que tiene las imagenes pero las sirbe de modo SuperUsuario y estatica.