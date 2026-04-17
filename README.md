# Anber - Maison de Parfums

Site e-commerce moderne pour une maison de parfums de luxe, avec intégrations de paiement Stripe et PayPal.

## 🚀 Fonctionnalités

- **Catalogue de parfums** avec images haute qualité
- **Panier d'achat** avec stockage local
- **Paiements intégrés** : Stripe Checkout et PayPal
- **Design responsive** et moderne
- **Interface mobile optimisée**

## 📁 Structure du Projet

```
anber/
├── index.html          # Page d'accueil
├── products.html       # Catalogue des produits
├── product.html        # Détail d'un produit
├── cart.html          # Panier d'achat
├── success.html       # Confirmation de paiement
├── contact.html       # Page de contact
├── about.html         # À propos
├── faq.html           # FAQ
├── shop.js            # Logique JavaScript
├── style.css          # Styles CSS
├── assets/            # Images et ressources
└── backend/           # Serveur backend (Node.js)
    ├── server.js      # Serveur Express
    ├── package.json   # Dépendances
    ├── .env          # Configuration (clés API)
    └── README.md     # Documentation backend
```

## 🛠 Installation et Configuration

### Frontend
1. Ouvrez `index.html` dans un navigateur web
2. Ou utilisez un serveur local comme Live Server (VS Code)

### Backend (Paiements)
1. Exécutez `setup-backend.bat` pour installer les dépendances
2. Configurez vos clés API dans `backend/.env`
3. Démarrez le serveur : `cd backend && npm start`

## 💳 Configuration des Paiements

### Stripe
1. Créez un compte sur [Stripe Dashboard](https://dashboard.stripe.com)
2. Obtenez vos clés API (test ou live)
3. Ajoutez-les dans `backend/.env`

### PayPal
1. Créez un compte sur [PayPal Developer](https://developer.paypal.com)
2. Créez une application
3. Ajoutez les credentials dans `backend/.env`

## 🎨 Technologies Utilisées

- **Frontend** : HTML5, CSS3, JavaScript ES6+
- **Backend** : Node.js, Express
- **Paiements** : Stripe API, PayPal SDK
- **Styling** : CSS Variables, Flexbox, Grid

## 📱 Fonctionnalités

- Catalogue de parfums avec filtres par catégorie
- Galerie d'images pour chaque produit
- Panier persistant avec localStorage
- Calcul automatique des totaux
- Intégrations de paiement sécurisées
- Interface responsive pour mobile et desktop

## 🚀 Déploiement

### Frontend
- Hébergez les fichiers statiques sur n'importe quel hébergeur (Netlify, Vercel, etc.)

### Backend
- Déployez sur Heroku, Railway, ou tout serveur Node.js
- Configurez les variables d'environnement
- Utilisez HTTPS en production

## 🔒 Sécurité

- Clés API stockées dans des variables d'environnement
- Validation des données côté serveur
- Redirections sécurisées pour les paiements

## 📞 Support

Pour toute question ou problème, contactez-nous via la page contact du site.