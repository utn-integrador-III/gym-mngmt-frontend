# Docker - Gym Management Frontend (CRA)

Guía rápida para levantar el frontend de Gym Management con Docker Compose.

## Requisitos
- Docker y Docker Compose instalados
- Puerto disponible:
  - Frontend (CRA): 3000

## Contexto del proyecto
- Stack: React + TypeScript + Create React App (`react-scripts`)
- Puerto dev por defecto: `3000`
- Scripts: `npm start`, `npm run build`

## Archivos esperados en esta carpeta
- `Dockerfile` (desarrollo o producción)
- `docker-compose.yml`

Actualmente estos archivos están vacíos; más abajo se incluyen plantillas de referencia.

---

## Opción A: Desarrollo (hot reload con react-scripts)
Usa Node dentro del contenedor para correr `npm start` y exponer el puerto 3000.

Ejemplo de `Dockerfile` (dev):
```dockerfile
FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "start"]
```

Ejemplo de `docker-compose.yml` (dev):
```yaml
services:
  frontend:
    image: myorg/gym-frontend:dev
    container_name: gym-frontend-dev
    build:
      context: ..
      dockerfile: Docker/Dockerfile
    environment:
      - PORT=3000
      # Agrega aquí variables como REACT_APP_API_URL si las usas
      # - REACT_APP_API_URL=http://localhost:8000
    ports:
      - "3000:3000"
    volumes:
      - ..:/usr/src/app
      - /usr/src/app/node_modules
    restart: unless-stopped
```

Comandos (desde esta carpeta `Docker/`):
```bash
# build + up en primer plano
docker compose up --build

# en segundo plano
docker compose up -d

# logs
docker compose logs -f frontend

# detener
docker compose down
```

---

## Opción B: Producción (build estático servido con Nginx)
Compila con `npm run build` y sirve la carpeta `build/` mediante Nginx.

Ejemplo de `Dockerfile` (prod):
```dockerfile
# etapa de build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

# etapa de serve
FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/build .
# (Opcional) Copiar configuración personalizada de Nginx si existe
# COPY ../nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Ejemplo de `docker-compose.yml` (prod):
```yaml
services:
  frontend:
    image: myorg/gym-frontend:prod
    container_name: gym-frontend-prod
    build:
      context: ..
      dockerfile: Docker/Dockerfile
    ports:
      - "8080:80"
    restart: unless-stopped
```

Comandos (desde esta carpeta `Docker/`):
```bash
# build + up
docker compose up --build -d
# abrir http://localhost:8080
```

---

## Variables de entorno (opcional)
Si tu app consume una API, define `REACT_APP_*` en tiempo de build/ejecución.
- Ejemplo: `REACT_APP_API_URL=http://localhost:8000`
- En CRA, las variables deben empezar con `REACT_APP_` para estar disponibles en `process.env`.

En `docker-compose.yml` (dev):
```yaml
environment:
  - REACT_APP_API_URL=http://localhost:8000
```

---

## Consejos
- En desarrollo, el bind mount `..:/usr/src/app` permite hot reload.
- El volumen `/usr/src/app/node_modules` evita que los módulos del host sobrescriban los del contenedor.
- Si ya tienes `nginx.conf` en el root del proyecto (`gym-mngmt-frontend-dev/nginx.conf`), puedes usarlo en la imagen de producción.

---

## Nombres de imagen y contenedores
- Ejemplo (dev):
  - `image: myorg/gym-frontend:dev`
  - `container_name: gym-frontend-dev`
- Ejemplo (prod):
  - `image: myorg/gym-frontend:prod`
  - `container_name: gym-frontend-prod`

Alternativa: usar prefijo de proyecto
```bash
docker compose -p gymfront up -d
```
