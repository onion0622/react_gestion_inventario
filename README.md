# Sistema de Gestión de Inventario

Este proyecto es un sistema de gestión de inventario que utiliza React en el frontend y Flask en el backend. Implementa varios patrones de diseño para mejorar la mantenibilidad y escalabilidad del código.

## Características

- Gestión completa de productos (agregar, editar, eliminar)
- Búsqueda y filtrado de productos
- Seguimiento de stock bajo
- Cálculo de valor total del inventario
- Interfaz de usuario responsiva y moderna
- Formulario de contacto y gestión de mensajes

## Patrones de Diseño Implementados

### Backend (Flask)

1. **Patrón Repository**: Separa la lógica de acceso a datos del controlador. Se implementa en `backend/repository.py` y contiene métodos para realizar operaciones CRUD en la base de datos.

2. **Patrón Service**: Maneja la lógica de negocio en una capa separada. Se implementa en `backend/service.py` y actúa como intermediario entre los controladores y el repositorio.

3. **Patrón Singleton**: Se utiliza implícitamente con la instancia de la base de datos a través de SQLAlchemy, asegurando que solo exista una instancia de la base de datos en toda la aplicación.

4. **Patrón Factory**: Utilizado para crear instancias de productos en el repositorio.

### Frontend (React)

1. **Patrón Observer**: Implementado mediante el uso de Context API de React para manejar el estado de los productos. Se encuentra en `frontend/src/ProductsContext.js` y permite que múltiples componentes reaccionen a los cambios en el estado de los productos.

2. **Patrón Factory**: Utilizado para crear instancias de productos en el backend.

## Estructura del Proyecto

```
react_gestion_inventario/
├── backend/
│   ├── app.py          # Aplicación Flask principal
│   ├── models.py       # Modelos de datos
│   ├── repository.py    # Lógica de acceso a datos (Patrón Repository)
│   ├── service.py      # Lógica de negocio (Patrón Service)
│   ├── requirements.txt # Dependencias del backend
│   └── instance/       # Base de datos SQLite
└── frontend/
    ├── src/
    │   ├── App.js              # Componente principal
    │   ├── ProductsContext.js  # Contexto para manejar el estado de productos (Patrón Observer)
    │   ├── InventorySystem.js   # Componente del sistema de inventario
    │   ├── ContactForm.js       # Componente para el formulario de contacto
    │   ├── ContactMessages.js    # Componente para mostrar mensajes de contacto
    │   └── ...                 # Otros archivos del frontend
    └── public/
```

## Ejecución Sencilla (Sin Docker)

### Requisitos Previos

- Node.js y npm
- Python 3.6+
- Virtualenv (para el backend)

### Configuración del Backend

1. Navega al directorio del backend:
   ```
   cd backend
   ```

2. Crea un entorno virtual:
   ```
   python -m venv venv
   ```

3. Activa el entorno virtual:
   - En Windows:
     ```
     venv\Scripts\activate
     ```
   - En macOS/Linux:
     ```
     source venv/bin/activate
     ```

4. Instala las dependencias:
   ```
   pip install -r requirements.txt
   ```

5. Inicia el servidor:
   ```
   cd ..  # Navega al directorio raíz del proyecto
   python -m backend.app
   ```

### Configuración del Frontend

1. Navega al directorio del frontend:
   ```
   cd frontend
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Inicia la aplicación:
   ```
   npm start
   ```

### Uso

1. Asegúrate de que tanto el backend como el frontend estén corriendo.
2. Abre tu navegador y visita `http://localhost:3000`.
3. Comienza a gestionar tu inventario añadiendo, editando o eliminando productos.
4. Usa la pestaña "Contáctanos" para enviar mensajes de contacto.
5. Usa la pestaña "Mensajes" para ver y gestionar los mensajes de contacto recibidos.

## Ejecución con Docker (Opcional)

### Requisitos Previos

- Docker y Docker Compose

### Instrucciones

1. Asegúrate de tener Docker y Docker Compose instalados en tu máquina.

2. Navega al directorio raíz del proyecto:
   ```
   cd react_gestion_inventario
   ```

3. Construye y ejecuta los contenedores:
   ```
   docker-compose up --build
   ```

4. Accede a la aplicación en tu navegador:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:5000`

5. Para detener los contenedores, presiona `Ctrl + C` en la terminal donde se está ejecutando Docker Compose.

## API Endpoints

- `GET /api/products`: Obtiene todos los productos
- `POST /api/products`: Crea un nuevo producto
- `PUT /api/products/<id>`: Actualiza un producto existente
- `DELETE /api/products/<id>`: Elimina un producto
- `GET /api/contact-messages`: Obtiene todos los mensajes de contacto
- `POST /api/contact-messages`: Crea un nuevo mensaje de contacto
- `DELETE /api/contact-messages/<id>`: Elimina un mensaje de contacto

## Licencia

[MIT](https://choosealicense.com/licenses/mit/)
