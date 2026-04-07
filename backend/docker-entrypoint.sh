#!/bin/sh

# Attendre que la DB soit accessible (optionnel mais recommandé)
echo "Vérification de la base de données..."

# Appliquer les migrations sans interaction
echo "Application des migrations Prisma..."
npx prisma migrate deploy

# Lancer l'application
echo "Démarrage du serveur..."
exec node dist/index.js