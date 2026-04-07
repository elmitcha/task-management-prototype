# Étape 1 : Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/

# Installation des dépendances et génération du client Prisma
RUN npm install
RUN npx prisma generate

# Copie du reste du code et build TypeScript
COPY . .
RUN npm run build

# Étape 2 : Runtime
FROM node:20-alpine

WORKDIR /app

# Copie uniquement du nécessaire depuis le builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Copie du script d'entrée
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

# Commande de démarrage (on utilise node sur le dossier dist)
CMD ["node", "dist/index.js"]