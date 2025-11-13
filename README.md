# TrackSure — Backend

Backend API + Realtime server for **TrackSure**, a wearable tracking and alert system.  
Handles **authentication**, **location storage**, **alert management**, and **realtime tracking** via **Socket.IO**.

---

## 🚀 Live Backend (Production)

**Base URL:**  
`https://tracksure-backend.onrender.com`

**API Base:**  
`https://tracksure-backend.onrender.com/api`

---

## ⭐ Features

- User Registration & Login (JWT Auth)
- Realtime GPS location updates (Socket.IO)
- Store & fetch recent device locations
- Alert logging system
- CORS support for the frontend
- Render deployment ready

---

## 🛠 Tech Stack

- **Node.js + Express**
- **MongoDB + Mongoose**
- **Socket.IO**
- **JWT Authentication**
- **dotenv for configuration**
- **Deployed on Render**

---

## 📦 Requirements

- Node.js 16+
- npm
- MongoDB Atlas or local MongoDB

---

## 🔐 Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/tracksure
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CORS_ALLOWED_ORIGIN=https://tracksure-frontend-svc.onrender.com
...
##git clone https://github.com/Theerthana12/TrackSure-backend.git
cd TrackSure-backend
npm install
npm run dev      # or npm start
http://localhost:5000
