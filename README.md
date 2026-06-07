# Sistema de Gestión - Barbería "BARBERSTYLE" (Frontend & Backend)

Este proyecto es una aplicación full-stack diseñada para la gestión de una barbería. Cuenta con un backend desarrollado en **Django (Python)** y un frontend construido en **React**.

---

## 📋 Estructura del Proyecto

El repositorio está dividido en dos carpetas principales:
- `/back`: Servidor API, gestión de base de datos y lógica de negocio.
- `/front`: Interfaz de usuario y diseño interactivo.

---

## 🛠️ Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu sistema:
- [Node.js](https://nodejs.org/) (Versión LTS recomendada)
- [Python 3.x](https://www.python.org/)
- Gestor de bases de datos (si usas MySQL/PostgreSQL) o SQLite (incluido por defecto en Python).

---

## 🚀 Configuración del Backend (Django)

Sigue estos pasos para levantar el servidor de desarrollo del backend:

### 1. Navegar al directorio del backend
```bash
cd back

python -m venv venv
venv\Scripts\activate

python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt

```
## Configurar la Base de Datos y Credenciales

- Crea la base de datos en tu gestor (por ejemplo, MySQL) si no estás utilizando SQLite.
- Configura las variables de entorno o edita el archivo settings.py con las credenciales correspondientes:

```bash
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql', # O el motor que uses
        'NAME': 'nombre_de_tu_bd',
        'USER': 'tu_usuario',
        'PASSWORD': 'tu_contraseña',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```
mkdir media

# Ejecutar las migraciones

```bash
python manage.py makemigrations
python manage.py migrate
```

# Crear un superusuario (Administrador)
```bash
python manage.py createsuperuser
```

# Iniciar el servidor backend
```bash
python manage.py runserver
```

## Configuración del Frontend (React)

# Navegar al directorio del frontend

```bash
cd front
```

# Instalar los módulos de Node (node_modules)

```bash
npm install
```

# Configurar variables de entorno (Opcional)

```bash
REACT_APP_API_URL=[http://127.0.0.1:8000/api/](http://127.0.0.1:8000/api/)
```

# Iniciar el servidor de desarrollo (Si estás usando Vite en lugar de Create React App, el comando podría ser):

```bash
npm run dev
```




