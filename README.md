# Movie Rental App

Une application web de location de films développée avec Node.js, Express et MySQL.

## Fonctionnalités

- Inscription et connexion des utilisateurs
- Consultation du catalogue de films
- Location de films
- Gestion des locations (actives et historiques)
- Visionnage des bandes-annonces

## Prérequis

- Node.js (v14 ou supérieur)
- MySQL
- npm ou yarn

## Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/votre-username/movie-rental-app.git
cd movie-rental-app
```

2. Installez les dépendances :
```bash
npm install
```

3. Configurez la base de données :
- Créez une base de données MySQL nommée `movie_rental`
- Copiez le fichier `.env.example` en `.env` et configurez les variables d'environnement

4. Initialisez la base de données :
```bash
npm run init-db
```

5. Démarrez l'application :
```bash
npm start
```

L'application sera accessible à l'adresse `http://localhost:3000`

## Structure du projet

```
movie-rental-app/
├── config/          # Configuration de la base de données
├── public/          # Fichiers statiques (HTML, CSS, images)
├── scripts/         # Scripts utilitaires
├── src/             # Code source
│   ├── controllers/ # Contrôleurs
│   ├── models/      # Modèles
│   ├── routes/      # Routes
│   └── middleware/  # Middleware
└── package.json     # Dépendances et scripts
```

## Technologies utilisées

- Node.js
- Express.js
- MySQL
- JWT pour l'authentification
- HTML/CSS/JavaScript

## Licence

MIT 