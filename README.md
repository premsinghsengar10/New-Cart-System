# 🚀 Scan & Bill System

A modern, high-performance web application for retail store management, featuring a seamless "Scan & Checkout" experience for customers and a powerful ecosystem for administrators.

![Status](https://img.shields.io/badge/Status-Active-success)
![Stack](https://img.shields.io/badge/Stack-MERN%2BSpring-blue)

## ✨ key Features

### 🛍️ Customer Experience
- **Instant Scan**: Add items to cart by scanning barcodes (or entering serial numbers).
- **Fast Checkout**: Secure and idempotent checkout process.
- **Order History**: View past transactions instantly.

### 🏢 Store Administration (Super Admin)
- **Ecosystem Overview**: Manage multiple store nodes from a single dashboard.
- **Node Provisioning**: fast on-boarding of new stores (`/signup`).
- **Drill-Down Management**: "Inspect" any store to access its specific admin panel.

### 📦 Inventory & Operations (Admin)
- **Product Catalog**: Add, Edit, and specialized pricing (Cost/Tax).
- **Stock Control**: Generate and release inventory serials.
- **Real-Time Analytics**: Monitor Revenue and Order volume live.

## 🛠️ Technology Stack
- **Frontend**: React (Vite), TailwindCSS, Framer Motion, Axios.
- **Backend**: Spring Boot 3 (Java 17), Spring Data MongoDB.
- **Database**: MongoDB (Atlas/Local).
- **Security**: BCrypt hashing, Role-Based Access Control (RBAC).

## 🚀 Getting Started

### Prerequisites
- JDK 17+
- Node.js 18+
- MongoDB

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/scan-bill.git
   ```

2. **Backend Setup**
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
   *Server runs on port 8081.*

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *Client runs on http://localhost:5173.*

## 📖 Usage Flow

1. **Register**: Go to `/signup` to create a new store.
2. **Login**: Use your admin credentials at `/login`.
3. **Super Admin**: Browse the Ecosystem, click "Inspect" to manage a store.
4. **Customer**: Customers at the store URL can scan items and checkout.

## 🛡️ Security
- **RBAC**: Strict separation between `USER`, `ADMIN`, and `SUPER_ADMIN`.
- **Encryption**: Passwords hashed with BCrypt.
- **Verification**: Admin actions require strict role validation.

---
*Built for speed, designed for scale.*
