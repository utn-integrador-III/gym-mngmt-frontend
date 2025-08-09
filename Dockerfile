# Etapa 1: build
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

# Para pasar variable build time (opcional)
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

# Etapa 2: servidor nginx
FROM nginx:alpine

# Copiar build generado
COPY --from=build /app/build /usr/share/nginx/html

# Copiar configuración nginx custom para variables runtime
COPY nginx.conf /etc/nginx/nginx.conf

# Script para inyectar variables runtime
COPY env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]