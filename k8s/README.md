# Despliegue en Kubernetes

Este directorio contiene los manifiestos de Kubernetes para desplegar la aplicación de Gestión de Inventario.

## Componentes

1. **ConfigMap**: Almacena la configuración de la aplicación
2. **Backend Deployment**: Gestionar la aplicación Flask
3. **Backend Service**: Exponer la API del backend
4. **Frontend Deployment**: Gestionar la aplicación React
5. **Frontend Service**: Exponer la aplicación React

## Requisitos Previos

- Kubernetes cluster (puede ser local con Minikube, Kind, o un cluster en la nube)
- `kubectl` configurado para interactuar con el cluster

## Instrucciones de Despliegue

1. Construir las imágenes de Docker para el frontend y backend:
   ```bash
   # Desde el directorio raíz del proyecto
   docker build -t backend:latest ./backend
   docker build -t frontend:latest ./frontend
   ```

2. Si estás usando un cluster local como Minikube, carga las imágenes:
   ```bash
   minikube image load backend:latest
   minikube image load frontend:latest
   ```

3. Aplicar los manifiestos de Kubernetes:
   ```bash
   kubectl apply -f k8s/configmap.yaml
   kubectl apply -f k8s/backend-deployment.yaml
   kubectl apply -f k8s/backend-service.yaml
   kubectl apply -f k8s/frontend-deployment.yaml
   kubectl apply -f k8s/frontend-service.yaml
   ```

4. Verificar que los pods estén corriendo:
   ```bash
   kubectl get pods
   ```

5. Obtener la URL del frontend (si estás usando Minikube):
   ```bash
   minikube service frontend-service --url
   ```

6. Acceder a la aplicación en tu navegador usando la URL proporcionada.

## Notas

- La aplicación utiliza una base de datos SQLite que se almacena en un volumen dentro del pod del backend.
- En un entorno de producción, se recomienda usar una base de datos externa como PostgreSQL o MySQL.
