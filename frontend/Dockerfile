# Étape 1 : Construction
FROM node:20-alpine AS build

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./
RUN npm install

# Copie du reste du code
COPY . .

# Build de l'application
RUN npm run build

# Étape 2 : Serveur de production (Nginx)
FROM nginx:stable-alpine

# Copie du build vers le dossier nginx
# Rsbuild génère par défaut dans le dossier 'dist'
COPY --from=build /app/dist /usr/share/nginx/html

# Copie d'une config nginx simple pour gérer le routing React (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]