# 🌀 Resonance - Chat en temps réel

**Resonance** est une application de chat en temps réel développée en **NestJS** et **React**. 
Elle permet aux utilisateurs de discuter en direct dans une interface élégante et moderne.

> **Important** : Le design, les couleurs et certains éléments visuels de ce projet sont librement inspirés de l’univers graphique de **HoYoverse**, notamment du jeu **Genshin Impact**. Ce projet est entièrement personnel, à but non commercial, et ne revendique aucune affiliation officielle.

---

## 🚀 Fonctionnalités

- ✅ Authentification avec JWT (inscription et connexion sécurisée)
- 🔐 Réinitialisation de mot de passe via lien sécurisé par email
- ✅ Vérification de la force du mot de passe à l'inscription et à la réinitialisation
- 👤 Mise à jour du profil utilisateur (changement de pseudonyme, d'avatar et de couleur de pseudonyme)
- 🖼️ Support des photos de profil dans le chat
- 💬 Chat en temps réel via WebSocket
- 😊 Utilisation d'emojis avec autocompletion (exemple :smile:)
- 🕒 Affichage de l'historique des messages à la connexion
- 🎨 Couleur d'utilisateur générée aléatoirement à l'inscription

---

## 🛠️ Technologies utilisées

### Frontend

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Socket.IO Client](https://socket.io/)
- [TanStack Router](https://tanstack.com/router)

### Backend

- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [SQLite](https://www.sqlite.org/)
- [Socket.IO](https://socket.io/)
- [JWT](https://jwt.io/)
- [MailDev](https://github.com/maildev/maildev)
- [bcrypt](https://www.npmjs.com/package/bcrypt)

---

## ⚙️ Lancer le projet en local

### 1. Cloner le dépôt

```bash
git clone https://github.com/PedroDSS/resonance.git
cd resonance
```

### 2. Configurer les variables d’environnement
Crée un fichier .env à la racine du dossier frontend/ et du dossier backend/.

.env – Backend (/backend/.env)
```bash
PORT=3000
JWT_SECRET=anaxagoras
JWT_EXPIRES_IN=1d
DATABASE_PATH=./db.sqlite
MAIL_HOST=maildev
MAIL_PORT=1025
MAIL_FROM=no-reply@example.com
```

.env – Frontend (/frontend/.env)
```bash
VITE_API_URL=http://localhost:3000/auth
VITE_SOCKET_URL=http://localhost:3000
```

### 3. Lancer l'environnement Docker.
```bash
docker compose up --build -d
```