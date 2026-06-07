from django.contrib import admin
from .models import Barbero, Servicio, Turno

@admin.register(Barbero)
class BarberoAdmin(admin.ModelAdmin):
  list_display = ('nombre','is_active')

@admin.register(Servicio)
class ServicioAdmin(admin.ModelAdmin):
  # Columnas clave para ver rápido en la tabla principal
  list_display = ('nombre','precio', 'barbero','descripcion', 'duracion', 'destacado','imagen')
  # Filtros laterales súper cómodos para cuando tengas muchos servicios
  list_filter = ('destacado', 'barbero')
  # Campos por los que podés buscar un servicio rápidamente
  search_fields = ('nombre', 'descripcion')

@admin.register(Turno)
class TurnoAdmin(admin.ModelAdmin):
  list_display = ['cliente', 'servicio', 'fecha', 'hora', 'estado']
  list_filter = ['fecha', 'estado']
  