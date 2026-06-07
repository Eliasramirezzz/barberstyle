from django.db import models
from users.models import User
# Modelo de Barbero
class Barbero(models.Model):
  nombre = models.CharField(max_length=20)
  is_active = models.BooleanField(default=True)

  # Diseño para el panel
  def __str__(self):
    return self.nombre
  
# Creamos el Modelo Servicios, aca va l relacion con el barbero.
class Servicio(models.Model):
  # Relación profesional: Si se borra un barbero, no borramos el servicio (SET_NULL)
  barbero = models.ForeignKey(Barbero, on_delete=models.SET_NULL, null=True, related_name='servicios') # El related_name es para poder acceder a los servicios de un barbero es igual a barbero.objects.all() pero con el indice services.
  # Importante saber que barbero es un campo que tiene un valor que proviene de otro modelo en este caso de Barbero, y esta guardando un valor numerico que es el id del barbero.
  nombre = models.CharField(max_length=20)
  precio = models.PositiveIntegerField() # Manejamos enteros como tu JSON (8000, 5000)
  descripcion = models.TextField()
  duracion = models.IntegerField(help_text="Duracion en minutos")
  destacado = models.BooleanField(default=False)
  # Campo profesional para imágenes. Las guarda en la carpeta media/servicios/
  imagen = models.ImageField(upload_to='servicios/', null=True, blank=True)

  # Diseño para el panel
  def __str__(self):
        return f"{self.nombre} - ${self.precio}"

class Turno(models.Model):
    Estados = [
        ('pendiente','Pendiente'),
        ('confirmado', 'Confirmado'),
        ('finalizado', 'Finalizado'),
        ('cancelado', 'Cancelado')
    ]

    cliente = models.ForeignKey( User, on_delete=models.PROTECT, related_name='turnos')
    servicio = models.ForeignKey(Servicio, on_delete=models.PROTECT, related_name='turnos')

    fecha = models.DateField()
    hora = models.TimeField()

    telefono = models.CharField(max_length=12, blank=True)

    estado = models.CharField(max_length=20, choices=Estados, default='pendiente')

    def __str__(self):
      return f'{self.cliente} {self.servicio} {self.fecha} {self.hora} {self.estado}'
    
    class Meta():
      ordering = ['fecha', 'hora']

      