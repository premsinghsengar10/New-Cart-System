# Scan & Bill: Enterprise Multi-Store Ecosystem

Scan & Bill is a robust, modular self-checkout ecosystem designed for multi-store coordination and enterprise-grade stability. It features individual unit tracking (Serial Numbers), a high-concurrency safe backend, and a cleanly modularized React architecture.

## 🚀 Key Features

- **Multi-Store RBAC Management**:
  - **Super Admin**: Full ecosystem dashboard to monitor all stores and provision new ones.
  - **Store Admin**: Dedicated control over unique inventory, staff, and store-specific products.
  - **User/Cashier**: Intuitive scanning and billing interface for rapid customer processing.
- **High-Stability Operations (Idempotency)**:
  - **Collusion-Free Backend**: Implemented **Optimistic Locking** and **Idempotency Keys** to prevent request collisions and duplicate orders during concurrent usage.
  - **Atomic Inventory**: Every physical unit is tracked by a unique serial number, ensuring absolute stock accuracy.
- **Modular Frontend Architecture**: Refactored into a scalable component-based structure (`/components` and `/pages`) for easy extending and lightning-fast maintenance.
- **Premium Monochrome UI**: High-contrast design system with glassmorphism effects and fluid Framer Motion transitions.

## 🛠️ Performance Tech Stack

### Backend (Java Spring Boot)
- **Framework**: Spring Boot 3.2
- **Database**: MongoDB (Scalable NoSQL)
- **Concurrency**: Versioned Optimistic Locking (Preventing data loss)
- **Logic Layer**: Robust Service-based architecture with idempotency verification.

### Frontend (React + Vite)
- **Design Architecture**: Modular Page & View pattern.
- **State Management**: Session-persistent authentication and global cart buffering.
- **Visuals**: Vanilla CSS Design Tokens + Framer Motion.

## 📦 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MongoDB running on `127.0.0.1:27017`

### Backend Setup
1. Navigate to `backend/`.
2. Recompile and start:
   ```bash
   mvn clean compile
   mvn spring-boot:run
   ```
   *The system will auto-seed with a default Super Admin (`super` / `super123`) and 3 demonstration store environments.*

### Frontend Setup
1. Navigate to `frontend/`.
2. Initialize:
   ```bash
   npm install && npm run dev
   ```
3. Open `http://localhost:5173`.

---

Built with ⚡ by **Prem Singh Sengar** & **Antigravity**
