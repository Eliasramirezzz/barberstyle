from django.shortcuts import render
from .serializers import BarberoSerializer, ServicioSerializer, TurnoSerializer # Estos son los traductores.
# Importamos del DRF el viewset, perrmision y status, son librerias de DRF que nos permite manejar mas sencillamente los endpoint.
from rest_framework import viewsets, permissions, status
from .models import Barbero, Servicio, Turno # Importamos los modelos
from datetime import datetime, timedelta # Nos importara las libreria para manejo de horarios.
from rest_framework.views import APIView # Es  para crear vistas personalizadas para el end-point.
from rest_framework.response import Response # Es para devolver respuestas personalizadas para el end-point
from rest_framework.decorators import action # Esta libreria nos permite crear rutas personalizadas para el end-point, nos servira para el registro de turnos.
from django.utils import timezone # Vamos a necesitar para obtener la fecha de hoy.
from django.db.models import Sum # Para realizar operaciond de Suma, viene de la libreria modelo.


# Aca estan las vistas personalizadas para el servicio
class ServicioViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Servicio.objects.all().order_by('id') # Aca sencillamente le decimos que traiga todos los servicios activos.
    serializer_class = ServicioSerializer # Le decimos que use el traductor de servicio.
    permission_classes = [permissions.AllowAny] # Aca le decimos que se pueda ver el servicio sin necesidad de estar logueado(tener un token), esto es porque la landing es publica y los servicios tambien.

# Aca estan las vistas personalizadas para el barbero
class BarberoViewSet(viewsets.ReadOnlyModelViewSet):
  queryset = Barbero.objects.filter(is_active= True) # Aca usamos el is_active que declaramos en el modelo, tambien le decimos que traiga todos los barberos activos.
  serializer_class = BarberoSerializer # Le decimos que use el traductor de barbero.
  permission_classes = [permissions.AllowAny] 

# Esta vista es para mostrar los horarios disponible.
class HorariosDisponiblesView(APIView):
    permission_classes = [permissions.AllowAny] 

    def get(self, request): # Acá usamos el método GET para consultar datos
        # Obtenemos la fecha y el id del servicio que nos envían por la URL desde el Front-End
        fecha_str = request.query_params.get("fecha") 
        servicio_id = request.query_params.get("servicio") 

        # Si el Front no nos manda alguno de estos dos datos, cortamos la ejecución y devolvemos error 400
        if not fecha_str or not servicio_id: 
            return Response({"error": "Falta la fecha o el id del servicio"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Buscamos el servicio en la base de datos para saber cuántos minutos dura el corte/estilo
            servicio = Servicio.objects.get(id=servicio_id) 
            duracion_servicio = servicio.duracion # Guardamos los minutos (ej: 40, 120)

            # Convertimos el string que viene de React ('YYYY-MM-DD') en un objeto de tipo fecha nativo de Python
            fecha_consulta = datetime.strptime(fecha_str, "%Y-%m-%d").date() 

        except Servicio.DoesNotExist: # Si el ID no coincide con ningún servicio, devolvemos error 404
            return Response({"error": "El servicio no existe"}, status=status.HTTP_404_NOT_FOUND)
        except ValueError: # Si la fecha viene con letras o un formato raro, devolvemos error 400
            return Response({"error": "Formato de fecha inválido. Use YYYY-MM-DD"}, status=status.HTTP_400_BAD_REQUEST)
        

        # CONTROL DE FIN DE SEMANA (SÁBADO Y DOMINGO)
        # .weekday() nos devuelve los dia de la semana en numero 0-6: 5 para Sábado y 6 para Domingo.
        # Si la fecha cae en alguno de esos dos días, devolvemos una lista vacía de inmediato.
        if fecha_consulta.weekday() in [5, 6]:
            # Retornamos un array vacío [] con un estado 200 OK. 
            # Así el Front entenderá perfectamente que "No hay horarios disponibles" para ese día.
            return Response([], status=status.HTTP_200_OK)

        # Definimos las franjas de apertura y cierre de la barbería para el día seleccionado
        # Combinamos la fecha de consulta con horas fijas de inicio y fin (Mañana y Tarde)
        intervalos_trabajo = [
            (datetime.combine(fecha_consulta, datetime.strptime("09:00", "%H:%M").time()), 
             datetime.combine(fecha_consulta, datetime.strptime("12:00", "%H:%M").time())), 
            (datetime.combine(fecha_consulta, datetime.strptime("17:00", "%H:%M").time()), 
             datetime.combine(fecha_consulta, datetime.strptime("21:00", "%H:%M").time()))
        ]

        # Traemos de la base de datos TODOS los turnos que YA estén reservados para este barbero específico en este día
        # Los ordenamos cronológicamente desde el más temprano al más tarde
        turnos_ocupado = Turno.objects.filter(
            fecha=fecha_consulta, 
            servicio__barbero=servicio.barbero 
        ).order_by("hora") 

        horarios_libres = [] # Array vacío donde iremos guardando los strings de las horas disponibles (ej: ["09:00", "09:30"])
        tiempo_changui = timedelta(minutes=10) # Margen de seguridad de 10 minutos entre turnos existentes para que el barbero respire
        intervalo_opciones = timedelta(minutes=30) # 🚀 PASO CLAVE: El reloj avanzará de a 30 minutos para ofrecer turnos intermedios facheritos

        # Empezamos a recorrer los bloques de la barbería (primero la mañana, después la tarde)
        for inicio_bloque, fin_bloque in intervalos_trabajo: 
            tiempo_actual = inicio_bloque # Ponemos el reloj virtual en la hora de inicio del bloque (ej: 09:00 hs)

            # El bucle corre mientras el horario actual MÁS lo que dura el servicio NO supere la hora de cierre del bloque
            while tiempo_actual + timedelta(minutes=duracion_servicio) <= fin_bloque: 
                turno_inicio = tiempo_actual # El turno hipotético empezaría en el minuto actual del reloj
                turno_fin = tiempo_actual + timedelta(minutes=duracion_servicio) # El turno hipotético terminaría al sumarle la duración del servicio
                
                cruzado = False # Bandera para marcar si este turno hipotético choca con un cliente real de la BD

                # Evaluamos el turno hipotético contra cada uno de los turnos ya agendados en la base de datos
                for turno in turnos_ocupado:
                    db_inicio = datetime.combine(fecha_consulta, turno.hora) # Cuándo empieza el turno viejo
                    db_fin = db_inicio + timedelta(minutes=turno.servicio.duracion) + tiempo_changui # Cuándo termina el turno viejo (sumando su changüí)
                
                    # Lógica matemática de superposición: si los rangos se cruzan en el tiempo, la bandera se vuelve True
                    if not (turno_fin <= db_inicio or turno_inicio >= db_fin):
                        cruzado = True
                        break # Si encontramos que choca con uno, rompemos este for porque ya no nos sirve este horario

                # Si ningún turno de la base de datos se interpuso en el camino
                if not cruzado:
                    # Control de seguridad: Si el cliente está consultando para el día de HOY, ocultamos las horas que ya pasaron
                    if datetime.combine(fecha_consulta, tiempo_actual.time()) > datetime.now():
                        horarios_libres.append(tiempo_actual.strftime('%H:%M')) # Guardamos la hora formateada (ej: "17:30")

                # 🚀 EL RELOJ AVANZA ACÁ: Movemos el puntero 30 minutos hacia adelante y volvemos a evaluar el ciclo while
                tiempo_actual += intervalo_opciones

        # Devolvemos la lista limpia con todos los horarios que pasaron la prueba de fuego
        return Response(horarios_libres, status=status.HTTP_200_OK)
    
# class TurnoView(viewsets.ModelViewSet): Esto lo porgramaremos cuando vamos a mostrar los turnos.

# Esta vista es para registrar el turno.
class RegistroTurnoView(viewsets.ModelViewSet):
    queryset = Turno.objects.all() # Le indicamos al ViewSet de dónde sacar los datos
    serializer_class = TurnoSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    #Registramos el turno con el usuario correspondiente.
    def perform_create(self, serializer):    # Esto asigna el usuario autenticado automáticamente al turno
    # Asignar automáticamente el cliente logueado
        serializer.save(cliente=self.request.user) # No me importa qué cliente te mande el Front-End en el JSON. Guardá el turno usando obligatoriamente el ID del usuario que está en el Token

    # El registro tiene una accion que es crear una ruta para poner el id del usuario, Endpoint extra: PATCH /api/turnos/:id/confirmar/
    @action(detail=True, methods=['patch'])
    # Aca lo que hicimos es crear un metodo para confirmar el turno, con una ruta de metodo patch que recibe el id del turno
    # Este metodo es el que confirma el usuario.
    def confirmar(self, request, pk=None):
        turno = self.get_object() # Obtenemos el turno por id
        turno.estado = 'confirmado' # Cambiamos el estado
        turno.save() # Guardamos
        return Response({'estado': turno.estado}) # Devolvemos el estado

    # Este metodo es para mostrar turnos de un cliente.
    def get_queryset(self):
        # Primero vamos a verificar si el usuario es admin o usuario.
        user = self.request.user # Atrapa quién es el usuario gracias al Token.

        # Listar turnos para admin lo guardamos en un queryset para usarlo luego
        if user.is_staff or getattr(user, 'rol', None) == 'admin': # Caso de que el usuario sea admin,  exivale a: getattr(objeto, nombre_del_atributo, valor_por_defectoo)
            queryset = Turno.objects.all() # Guardamos todos los turnos sin filtrar el tipo de usuario osea mandamos todo.
        # Caso que sea un usuario cliente entonces le listamos solo los suyos
        else:
            # filter(cliente=self.request.user) hace que el cliente común SOLO vea sus propios turnos.
            # .order_by('fecha', 'hora') te los deja ordenados del más viejo al más nuevo (así el último del array es realmente el último).
            queryset = Turno.objects.filter(cliente=self.request.user)

        # Vamos a obtener los filtros por parametros que viene del front.
        filtro_fecha = self.request.query_params.get('fecha', None) # el query_params permite obtener parametros de la consulta HTTP, en este caso obtenemos la fecha.
        filtro_estado = self.request.query_params.get('estado', None) # Aca obtenemos el estado y en ambos casos ponemos None por si no viene ninguno.

        # Filtramos la fecha 
        if filtro_fecha:
            queryset = queryset.filter(fecha=filtro_fecha) # al quiery que tiene todos los datos filtramos la fecha, y guardamos en una variable el valor de la fecha.
        
        if filtro_estado and filtro_estado != 'Todos los activos': # Quiere decir que aya una fecha y que el valor no sea pordefecto que definimos en el front.
            queryset = queryset.filter(estado=filtro_estado)
        
        # Port ultimo Ordenamos los turnos y lo enviamos al front.
        if (user.is_staff or getattr(user, 'rol', None) == 'admin'): # Caso de que el usuario sea admin
            return queryset.order_by('fecha', 'hora')
        return queryset.order_by('-fecha', '-hora')
    
    # Aca creamos una accion, es decir cuando se llame al backen intentando cancelar un turno vamos hacer lo siguiente
    @action(detail=True, methods=['patch'], url_path='cancelar')
    def cancelar_turno(self, request, pk=None): # Metodo para cancelar el turno ya sea para el admin u cliente.
        """
        ENDPOINT: /api/turnos/<id>/cancelar/
        Cualquiera (admin o el dueño del turno) puede cancelar
        """

        turno = self.get_object() # Agarra el turno por ID y valida que exista

        # Filtro de seguridad primero verificams que sea un admin y que sea dueño del turno.
        is_admin = request.user.is_staff or getattr(request.user, 'rol', None) == 'admin' # Lo que hacemos aca es guardar si es administrador o no osea True o False.

        # Verficiamos.
        if not is_admin or turno.cliente != request.user:
            return Response({'error': 'No tienes permiso para cancelar este turno.'}, status=status.HTTP_403_FORBIDDEN)

        # Corregir que el Cliente u Admin no pueda cancelar un turno ya cancelado o Finalizado
        if turno.estado in ['cancelado', 'finalizado']:
            return Response({'error': f'No se puede cancelar un turno que ya está {turno.estado}.'}, status=status.HTTP_400_BAD_REQUEST) # Mensaje de una mala respuesta.
        
        # Caso de que no este cancelado u finalizado lo cancelamos unicamente.
        turno.estado = 'cancelado'
        turno.save()
        return Response({"message": "Turno cancelado con éxito.", "estado": turno.estado}, status=status.HTTP_200_OK) # el estado 200 que significa que todo salio bien.
    
    # Volvemos a crear una accion unicamente para finalizar el turno
    @action(detail=True, methods=['patch'], url_path='finalizar') # Cambiamos solo la url por finalizar
    def finalizar_turno(self, request, pk=None):
        """
        ENDPOINT: /api/turnos/<id>/finalizar/
        ¡SOLO EL ADMIN puede finalizar el turno cuando termina de cortar el pelo!
        """
        # Nuevamente obtenemos el tipo de usuairo porque solo el admin puede cancelar.
        user = self.request.user
        if not (user.is_staff or getattr(user, 'rol', None) == 'admin'): # Ponemos entre parentecis porque es un operador ternario osea tenemos 2 variable para verificar si no es admin.
            return Response({'error': 'No tienes permiso para finalizar este turno.'}, status=status.HTTP_403_FORBIDDEN) # El estado correcto cuando no tiene permisos es 403.
        
        # Obtenemos todos los turnos de un cliente.
        turno = self.get_object() # Agarra el turno por ID 
        
        # Solo tiramos error si el turno YA se había cancelado o ya se había finalizado antes. Y tambien debe estar en confirmado para poder finalizar.
        if turno.estado.lower()  in ['cancelado', 'finalizado']: # El lower es para convertir todo a minuscula, evita si esta en mayuscula y tira error.
            return Response({"error": f"No se puede finalizar un turno que está en estado '{turno.estado}'."},
                status=status.HTTP_400_BAD_REQUEST) # Solo se pueden finalizar turnos que esten en estado pendiente
        
        # Finalizamos el turno,solo si es confirmado.
        turno.estado = 'finalizado'
        turno.save()
        return Response({"message": "Turno finalizado. ¡Buen laburo!", "estado": turno.estado}, status=status.HTTP_200_OK) # el estado 200 que significa que todo salio bien.

    # Esta accion es para calcular matrises y mostrar en el dasboar.
    @action(detail=False, methods=['get'], url_path='dashboard-stats')# Hora pusimos detail=false porque no vamos a recibir ningun id osea la url es /api/turnos/dashboard-stats ahora no incluye el id como tiene las demas.
    def dashboard_stats(self, request): # Metodo para obtener estadisticas del dashboard.
        """
        ENDPOINT: GET /api/turnos/dashboard-stats/
        Devuelve la cantidad de cortes finalizados hoy y la caja estimada del día.
        """
        user = self.request.user # Pasa sabe si el que pide la info es el admin.

        if not (user.is_staff or getattr(user, 'rol', None) == 'admin'):
            return Response({'error': 'No tienes permisos para ver las estadísticas.'}, status=status.HTTP_403_FORBIDDEN)

        # Obtenemos la fecha de hoy del servidor
        hoy = timezone.now().date()

        # Filtramos los turnos que pertenecen al día de hoy
        turnos_hoy = Turno.objects.filter(fecha=hoy)

        # Cortes de Hoy: Contamos solo los que ya fueron 'finalizados'
        cantidad_cortes_hoy = turnos_hoy.filter(estado='finalizado').count()

        # Caja Estimada: Sumamos el precio de los servicios de los turnos 'finalizados' hoy
        # Controlar el campo precio del modelo que sea correcto para calculuar.
        caja_total = turnos_hoy.filter(estado='finalizado').aggregate(
            total=Sum('servicio__precio') #  definimos 'total=' para que no falle el diccionario!
        )['total'] or 0

        # Caja Estimada: Sumamos el precio de los servicios de los turnos 'finalizados' hoy.
        # EXPLICACIÓN DEL ORM:
        # 1. Tomamos los turnos de hoy y filtramos los que tienen estado 'finalizado'.
        # 2. Usamos 'aggregate', que procesa todo el listado para devolver un único resumen/total.
        # 3. Dentro de aggregate, definimos una variable propia llamada 'total' y le asignamos la operación 'Sum'.
        # 4. La magia del ORM de Django: usando el doble guion bajo ('servicio__precio') viajamos automáticamente 
        #    desde el modelo Turno hasta la tabla Servicio para traer el campo 'precio' sin hacer consultas manuales.
        # 5. Finalmente, con ['total'] extraemos el número limpio del diccionario resultante. Si no hay turnos, usamos 'or 0'.

        return Response({
            "cortes_hoy": cantidad_cortes_hoy,
            "caja_estimada": float(caja_total)
        }, status=status.HTTP_200_OK)

