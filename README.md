# 🚀 CMS Backend API

## 📌 Overview

This is a scalable backend system for a Content Management System (CMS), built using Node.js and Express. It provides RESTful APIs for managing pages, categories, tools, authentication, and media uploads.

The system is production-ready and integrates with MongoDB Atlas and Cloudinary.

---

## ⚙️ Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* Cloudinary (Image Uploads)
* Session-based Authentication

---

## 📁 Project Structure

```
src/
 ├── controllers/
 ├── models/
 ├── routes/
 ├── services/
 ├── middlewares/
 ├── utils/
 ├── config/
 └── server.js
```

---

## 🔐 Environment Variables (.env)

Create a `.env` file in the root directory and add:

```
DEV=localhost

MONGO_URI=mongodb://localhost:27017/AI_Corner_Database?retryWrites=true&w=majority

ADMIN_EMAIL=admin@system.com
ADMIN_PASSWORD=admin123

FRONTEND_URL=https://aicorner.net
FRONTEND_URL_CMS=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 📦 Installation

```bash
npm install
```

---

## 🛠️ Available Scripts

```json
"start": "node src/server.js",
"dev": "nodemon src/server.js",
"setup": "node scripts/setup.js"
```

### 🔹 Script Explanation

* `npm run dev` → Run server in development mode
* `npm start` → Run server in production
* `npm run setup` → Initialize database with default admin

---

## ⚠️ Important Note (Setup Script)

The `setup` script will:

* Create a default admin user using:

  * ADMIN_EMAIL
  * ADMIN_PASSWORD

👉 Make sure MongoDB is running before executing:

```bash
npm run setup
```

---

## ▶️ Run the Server

```bash
npm run dev
```

Server will run on:

```
http://localhost:5000
```

---

## 🔗 API Base URL

```
http://localhost:5000/api
```

---

## ☁️ Deployment

* Backend deployed on Render
* MongoDB Atlas for production DB
* Environment variables configured securely

---

## 🚀 Features

* Authentication (session-based)
* Role-based access control
* CRUD operations (Pages, Categories, Tools)
* Cloudinary image upload
* Modular and scalable architecture

---

## 🧠 Author Notes

This backend is designed to work seamlessly with a React-based CMS frontend and follows production-level architecture for scalability and maintainability.
