# 🌀 Resonance - Chat en temps réel

**Resonance** est une application de chat en temps réel développée avec **React**, **NestJS**. Elle permet aux utilisateurs de s'inscrire, se connecter, et discuter en direct dans une interface élégante et moderne.

---

## 🚀 Fonctionnalités

- ✅ Authentification avec JWT (inscription et connexion sécurisée)
- 💬 Chat en temps réel via WebSockets
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
- [bcrypt](https://www.npmjs.com/package/bcrypt)

---

## ⚙️ Lancer le projet en local

### 1. Cloner le dépôt

```bash
git clone https://github.com/ton-utilisateur/resonance-chat.git
cd resonance-chat
```

### 2. Configurer les variables d’environnement
Crée un fichier .env à la racine du dossier frontend/ et du dossier backend/.

.env – Backend (/backend/.env)
```bash
PORT=3000
JWT_SECRET=anaxagoras
JWT_EXPIRES_IN=1d
DATABASE_PATH=./db.sqlite
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