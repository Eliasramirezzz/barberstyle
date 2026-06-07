# Este archivo es el traductor del modelo a json necesario para la comuicacion del front con el back.
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer # Para obtener el token.
from rest_framework_simplejwt.views import TokenObtainPairView # Para las vistas de token
from rest_framework import serializers
# Importante no olvidar importar los modelos.
from .models import User  

# Aca creo el traductor para obtener el token 
class MyTokenObtainSerializer(TokenObtainPairSerializer):
  @classmethod # esto es para que se pueda crear el token
  def get_token(cls, user): # Esto es para obtener el token ya sea cliente o usuario.
    # Obtenemos el token base.
    token = super().get_token(user)
    # Agregamos nuestros campos personalizados al token para enviarlos al front.
    token['nombre'] = user.first_name # Como nuestro modelo y BD tiene first_name el campo nombre, entonces al poner token['nombre'] le decimos que en el paquete token quiero que se llame nombre el indice que guarda el nombre (first_name).
    token['rol'] = user.rol # Vamos a mandar el rol para mostrar el tipo de pagina al usuario.
    return token # Enviamos el token manipulado.
  


# Aca cremos el traductor para aceptar el token asi poder registrar un usuario.