# 🚀 Task Management System - Backend Pro (CodesGenius AI)

Ce projet est une API de gestion de tâches (To-Do List) hautement performante et strictement typée. Conçu pour démontrer une maîtrise de l'écosystème Node.js moderne, il met l'accent sur la **scalabilité**, la **sécurité des types** et l'**automatisation**.

---

## 🛠️ Stack Technique & Justifications

- **Runtime :** [Node.js v22+](https://nodejs.org/) (Utilisation de l'ESM natif).
- **Framework backend:** [Fastify](https://www.fastify.io/) - Choisi pour sa rapidité (overhead minimal) et son système de validation par JSON Schema intégré (AJV).
- **Framework frontend:** \*\* [Vite avec React](https://vite.dev/guide/) - Devenu le nouveau standard en 2026 pour le développement frontend, principalement pour sa vitesse exceptionnelle.
- **Langage :** [TypeScript 5](https://www.typescriptlang.org/) - Configuration `strict: true`. **Zéro `any` toléré** pour une maintenance prévisible.
- **ORM :** [Prisma 6](https://www.prisma.io/) - Pour un mapping base-de-données/code 1:1 et des migrations fluides.
- **Base de Données :** [PostgreSQL 15](https://www.postgresql.org/) - Choix de la robustesse relationnelle.
- **Documentation :** [Swagger/OpenAPI](https://swagger.io/) - Contrat d'interface auto-généré et interactif.
- **Validation :** [Zod](https://zod.dev/) pour la logique applicative + **JSON Schema** pour la couche de transport.

---

## 🏗️ Architecture des Couches (Layered Architecture)

Le projet respecte une séparation stricte des préoccupations (SoC) :

1.  **Controller Layer (`tasks.controller.ts`) :** Gère les requêtes HTTP, la validation des schémas d'entrée/sortie et la documentation Swagger.
2.  **Service Layer (`tasks.service.ts`) :** Contient la logique métier pure et interagit avec l'ORM Prisma.
3.  **Data Layer (Prisma) :** Gère la persistance et les relations complexes.
4.  **Common Layer :** Centralise la gestion des erreurs (`AppError`) et les middlewares globaux.

---

## 🌟 Concepts Avancés Implémentés

### 1. Pagination par Page (`page / limit`) ($O(n)$)

Contrairement à la pagination par **Cursor**, la pagination classique basée sur `page` et `limit` repose sur un mécanisme de type `OFFSET / LIMIT` :

- **Simplicité d'utilisation :** Facile à comprendre et à consommer côté client (ex : `?page=2&limit=10`).
- **Accès direct aux pages :** Permet de naviguer directement vers une page spécifique (utile pour les interfaces avec pagination numérotée).
- **Impact sur les performances :** La base de données doit parcourir les lignes précédentes (`OFFSET`), ce qui peut devenir coûteux sur de grandes volumétries.
- **Moins de stabilité :** Si des éléments sont ajoutés ou supprimés entre deux requêtes, cela peut entraîner des doublons ou des éléments manquants.
- **Implémentation :** Utilisation de `skip` et `take` avec Prisma (équivalent de `OFFSET` et `LIMIT`).

---

### 🔄 Cursor vs Page/Limit

| Critère           | Cursor Pagination | Page/Limit Pagination |
| ----------------- | ----------------- | --------------------- |
| Performance       | $O(1)$            | $O(n)$                |
| Stabilité         | Élevée            | Moyenne               |
| Accès direct page | ❌ Non            | ✅ Oui                |
| Simplicité        | Moyenne           | Élevée                |

### 2. Sérialisation de Sortie (Output Masking)

L'API utilise des **Response Schemas**. Cela garantit que :

- Le client reçoit exactement ce dont il a besoin.
- Les champs internes (ex: logs de suppression, métadonnées privées) ne sont jamais exposés, même par erreur de programmation.

### 3. Gestion d'Erreurs Centralisée

Un plugin global capture toutes les exceptions. Si une erreur survient (404, 400, 500), le client reçoit un JSON harmonisé avec un code d'erreur explicite, facilitant le travail du Frontend.

---

## 🚀 Guide d'Installation

### Option A : Lancement via Docker (Recommandé)

Tout est automatisé. Le backend attendra que la DB soit saine avant de migrer et de démarrer.

```bash
# 1. Cloner le projet
# 2. Configurer le fichier .env (voir .env.example)
# 3. Lancer l'infrastructure
docker-compose up --build
```

### Option B : Lancement Local (Sans Docker)

Si vous souhaitez exécuter l'application directement sur votre machine hôte (Windows, Mac ou Linux) sans passer par des conteneurs.

**1. Pré-requis système :**

- **Node.js :** v22.x ou supérieur (LTS recommandée).
- **PostgreSQL :** Une instance active (installée localement ou via un service tiers).
- **Gestionnaire de paquets :** npm (fourni avec Node.js).

**2. Installation des dépendances :**
Ouvrez votre terminal dans le dossier `backend/` et dans le dosser `frontend/` :

```bash
npm install
```

**3. Configuration de l'environnement :**

Créez un fichier `.env` à la racine du dossier `backend/` et configurez vos accès :

```env
PORT=3000
NODE_ENV=development
# Remplacez USER, PASSWORD et DATABASE_NAME par vos identifiants réels
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME?schema=public"
```

**4. Initialisation de la Base de Données :**

Ces étapes sont cruciales pour synchroniser le schéma Prisma avec votre base de données réelle.

```bash
# Générer le client Prisma (crée les types TypeScript basés sur votre schéma)
npx prisma generate

# Créer les tables et appliquer les migrations sur votre base locale
npx prisma migrate dev --name init
```

**5. Commandes de démarrage :**

```bash
# Mode Développement (avec rechargement automatique via tsx)
npm run dev

# Mode Production (Compilation TypeScript vers JS puis exécution)
npm run build
npm start
```

---

## 🧪 Stratégie de Tests

Le projet utilise **Vitest** pour garantir la fiabilité du code. La suite de tests est divisée en deux catégories pour maximiser la couverture sans sacrifier la performance.

### 1. Tests d'Intégration (`.spec.ts`)

Situés dans les dossiers `__tests__`, ils valident le flux complet de l'application (Routes -> Validation -> Service -> Prisma).

- **Outil :** `Fastify.inject()` est utilisé pour simuler des appels HTTP sans ouvrir de port réseau (gain de performance majeur).
- **Couverture :** Création, Récupération (ID & Liste), Pagination, Mise à jour et Suppression.

### 2. Tests Unitaires de Validation (`.schema.spec.ts`)

Ces tests isolent la logique de validation des schémas **Zod**.

- **Objectif :** Garantir que les contraintes métier (longueur du titre, énumérations de priorité, rejet des champs inconnus via `.strict()`) sont respectées.

### Lancer les tests :

```bash
# Lancer tous les tests
npm test

# Lancer les tests en mode "Watch" (pendant le développement)
npx vitest

# Générer un rapport de couverture (Coverage)
npx vitest run --coverage
```

## 🚦 Utilisation & Tests de l'API

### 🔍 Documentation Interactive (Swagger)

Une fois le serveur démarré, la documentation complète au format OpenAPI est disponible ici :
👉 **`http://localhost:3000/docs`**

Cette interface permet de :

- Consulter tous les schémas de données (`Task`, `Error`, `PaginationMeta`).
- Tester les points de terminaison en direct avec le bouton **"Try it out"**.
- Valider les codes de retour HTTP (201 Created, 400 Bad Request, 404 Not Found).

### 🛰️ Tests via REST Client (Fichier .http)

Le fichier `requests.http` situé à la racine du backend permet d'automatiser vos tests sans quitter VS Code :

1. Installez l'extension **REST Client** (par Huachao Mao).
2. Ouvrez `requests.http`.
3. Cliquez sur `Send Request` au-dessus de chaque bloc de test.
   - _Note : Les tests de pagination (3 et 5) utilisent des variables dynamiques pour simuler un parcours utilisateur réel._

### 📦 Visualisation des Données (Prisma Studio)

Si vous préférez une interface graphique pour explorer ou modifier vos données en base :

```bash
npx prisma studio
```

## 🛠️ Maintenance & Débogage

### Nettoyage de la Base de Données (Reset)

En phase de développement, si vous souhaitez remettre la base à zéro et ré-exécuter toutes les migrations (utile pour nettoyer les données de test) :

```bash
npx prisma migrate reset
```

### Gestion des Logs

Le projet utilise **Pino**, un logger ultra-performant intégré nativement à Fastify :

- **Développement :** Les logs sont formatés pour être parfaitement lisibles dans la console (via `pino-pretty`).
- **Production :** Les logs sont générés au format JSON structuré, permettant une ingestion et une analyse efficace par des outils tiers (ELK, Datadog, etc.).

---

## 💡 Choix Techniques Critiques

- **Type Safety :** Aucune utilisation du type `any`. Les types de retour de Prisma sont strictement respectés et propagés dans toute l'application pour une robustesse maximale.
- **Validation AJV :** Nous utilisons la coercition de type (type coercion) de Fastify pour transformer automatiquement les paramètres de l'URL (ex: `?take=10`) de chaînes de caractères en entiers (`integers`) valides.
- **Sécurité CORS :** Le middleware est pré-configuré pour autoriser les requêtes provenant du futur frontend (environnement de développement sur `localhost:5173`).

---

_Projet réalisé avec rigueur dans le cadre du test technique CodesGenius AI - Avril 2026._
