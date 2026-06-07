from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView # Libreria para manejo del token con simplejwt
from .serializers import MyTokenObtainSerializer # Serializer del token personalizado.


# Creamos una vista personalizada, esta orientada al serializado(traductor) de nuestro token personal.
class MyTokenObtainPairView(TokenObtainPairView): # Esto es un traductor pero en ves de que sea para el modelo es para la vista.
  serializer_class = MyTokenObtainSerializer # aca referenciamos a nuestro token serializado pero para retornar ala url

