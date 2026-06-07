from rest_framework import serializers
from .models import Barbero, Servicio, Turno
import re # Importamos expresiones regulares de Python, nos servira para validar datos.

#Definimos el traductor del barbero
class BarberoSerializer(serializers.ModelSerializer):
  class Meta:
    model = Barbero
    fields = ['id', 'nombre']

# Definimos el traductor del servicio y la relacion con el barbero
class ServicioSerializer(serializers.ModelSerializer):
  # Esto te permite mandar los datos del barbero legibles o simplemente mapear el ID
  id_barbero = serializers.ReadOnlyField(source='barbero.id')
  nombre_barbero = serializers.ReadOnlyField(source='barbero.nombre')

  class Meta:
    model = Servicio
    fields = ['id', 'barbero', 'nombre_barbero', 'id_barbero', 'nombre', 'precio', 'descripcion', 'duracion', 'destacado', 'imagen']

class TurnoSerializer(serializers.ModelSerializer):
  nombre_cliente = serializers.CharField(source= 'cliente.first_name', read_only = True)
  nombre_servicio = serializers.CharField(source= 'servicio.nombre', read_only = True)

  # Marcamos cliente como read_only para que el Front no esté obligado a mandarlo en el JSON el id.
  cliente = serializers.PrimaryKeyRelatedField(read_only=True)
  
  class Meta:
    model = Turno
    fields = ['id', 'cliente', 'nombre_cliente', 'nombre_servicio', 'servicio', 'fecha', 'hora', 'telefono', 'estado'] # Id creo que no va.

  # VALIDACIÓN DEL TELÉFONO EN DJANGO
  def validate_telefono(self, value):
    telefono = value.strip() # Le sacamos espacios por las dudas con strip()

    # Expresión regular en Python: Solo dígitos de principio a fin, de 8 a 15 de largo
    if not re.match(r'^\d{8,15}$', telefono): # re es la libreria, match es el metodo dentro tenemos dos parametros, el primero es la expresion regular y el segundo es el telefono.
    # con r se indica que es una expresion regular, luego ^ es para decir que es un inicio y \d son los dígitos y {8,15} es para decir que es de 8 a 15 dígitos y $ es para decir que es el final.
    # Entonces si la expresion regular se compara con el telefono osea segundo parametro. Si cumple retorna el telefono. Sino lanza un error.
     raise serializers.ValidationError("El teléfono debe contener solo números y tener entre 8 y 15 dígitos.")
    # El raise se utilzia para lanzar un error. serializers.ValidationError es un error de validación de datos.
    return telefono
