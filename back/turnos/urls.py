# Este archivo lo creamos nosotro para rutas solo de la app que luego la usaremos en el proyecto para el endpoing
from django.urls import path # Necesario Importar para el uso de rutas en view de la aplicacion.
from .views import ServicioViewSet, BarberoViewSet, RegistroTurnoView # Importamos las vistas de la app
from rest_framework.routers import DefaultRouter # Sirve para crear las rutas en general.

# Creamos la instancia del router.
router = DefaultRouter()

# Vamos a registrar en esa ruta por defcto las rutas de la app.
router.register(r'servicios', ServicioViewSet, basename='servicio')
router.register(r'barberos', BarberoViewSet, basename='barbero')
router.register(r'turnos', RegistroTurnoView, basename='turno')
# La 'r' es para indicar que es una ruta dinámica.

# Aquí volcamos todas las rutas generadas por el router a la lista oficial de Django.
urlpatterns = router.urls

# Esto nos genera las siguientes rutas end-points:
# GET /api/servicios/ lista
# GET /api/servicios/:id/ detalle
# GET /api/barberos/ lista
# GET /api/barberos/:id/ detalle
# POST /api/turnos/ crear turno
# GET /api/turnos/:id/ detalle
# PATCH/PUT /api/turnos/:id/ actualizar

