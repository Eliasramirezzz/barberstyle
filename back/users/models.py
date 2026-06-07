from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
  # AbstractUser ya incluye: username, email, password, first_name, last_name, is_active, is_staff, date_joined. 
  email = models.EmailField(unique=True) # El campo email sera unico para cada usuario
  USERNAME_FIELD = 'email' # Esto le dice a Django: "Login con email"
  REQUIRED_FIELDS = ['username'] # El username pasa a ser secundario

  # Roles claros (Mejor que un Boolean)
  # Usar un Boolean (es_admin = True/False) te limita. 
  # Con Roles podés tener: Cliente, Barbero, Dueño.
  ROL_CHOICES = [
      ('admin', 'Administrador'),
      ('barbero', 'Barbero'),
      ('cliente', 'Cliente'),
  ]
  rol = models.CharField(max_length=10, choices=ROL_CHOICES, default='cliente')

  # El telefono necesario y muy importante
  telefono = models.CharField(max_length=20, blank=True) # El telefono para avisarle.

  # Por si algun dia manejamos foto de perfil
  # foto_perfil = models.ImageField(upload_to='perfiles/', blank=True, null=True)

  def __str__(self):
        return f"{self.email} ({self.rol})"

  class Meta:
      db_table = 'users_users' # Esto es para que la tabla se llame users_users, osea ponemos manulamente el nombre de la app y el nombre de la tabla, otro ejemplo seria "peluqueria_users"





