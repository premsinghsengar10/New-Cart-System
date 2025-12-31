# 🌐 Deployment Guide: Scan & Bill

This guide outlines how to host your Enterprise Multi-Store Ecosystem on the cloud.

## 🏗️ Option 1: Docker Compose (Best for VPS/DigitalOcean)
The most robust way to run the entire stack (Frontend + Backend + MongoDB) together.

1.  **Prerequisites**: Install Docker and Docker Compose on your server.
2.  **Deploy**:
    ```bash
    docker-compose up -d --build
    ```
3.  **Access**: Your app will be live on port `80` (Frontend) and `8081` (Backend).

---

## ☁️ Option 2: Cloud PaaS (Render / Railway) - Recommended
Easy, managed, and free/cheap for small projects.

### 1. Database (MongoDB Atlas)
Don't use the local MongoDB in the cloud. Use a managed service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- Create a Cluster.
- Get your **Connection String**.

### 2. Backend (Render.com)
- Create a new **Web Service**.
- Connect your GitHub repository.
- Set **Root Directory** to `backend/`.
- Set **Environment Variables**:
  - `MONGODB_URI`: *Paste your Atlas connection string here*
  - `PORT`: `8081`
- **Build Command**: `mvn clean package -DskipTests`
- **Start Command**: `java -jar target/*.jar`

### 3. Frontend (Vercel / Netlify)
- Create a new project.
- Connect your GitHub repository.
- Set **Root Directory** to `frontend/`.
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_BASE_URL`: *Paste your Render Backend URL here*

---

## 🛠️ Production Checks
- [ ] **CORS**: Ensure the backend allows the frontend's production URL. Current wildcard `*` allowed everything.
- [ ] **Environment**: Ensure `debug` modes are off.
- [ ] **Seeding**: The `DataSeeder` handles initial data. In production, you might want to disable it after the first run.

---

Built with ⚡ by **Antigravity**
