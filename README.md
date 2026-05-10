# Pro Access VIP Hub

Premium Next.js 16 SaaS platform with dynamic MongoDB CMS, advanced payment manager, and a professional admin dashboard.

## 🚀 Technology Stack
- **Framework**: Next.js 16 (App Router)
- **Database**: MongoDB (Mongoose)
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Authentication**: NextAuth.js
- **Package Manager**: pnpm

## 📦 Getting Started

### 1. Prerequisites
- Node.js 18+
- pnpm installed (`npm install -g pnpm`)
- MongoDB instance (local or Atlas)

### 2. Environment Setup
Create a `.env.local` file in the root and add the following:
```env
MONGODB_URI=your_mongodb_uri
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Installation
```bash
pnpm install
```

### 4. Run Development Server
```bash
pnpm dev
```

### 5. Production Build
```bash
pnpm build
pnpm start
```

## 🛠️ CMS Architecture
The entire platform is powered by a dynamic CMS.
- **Auto-Seeding**: The database initializes itself with professional default content on first load.
- **Admin Dashboard**: Accessible via `/admin` (Default: `admin@proaccess.com` / `pro_access_23`).
- **Payment Manager**: Fully configurable payment methods (bKash, Nagad, etc.) with per-method instructions.

## 📁 Folder Structure
- `src/app`: Next.js pages and API routes.
- `src/components`: Reusable UI components.
- `src/sections`: Landing page modules.
- `src/models`: Mongoose database schemas.
- `src/services`: API data fetching layer.
- `src/lib`: Shared utilities and database connection.
- `src/seed`: Default platform data.

## 🔒 Security
- Protected Admin routes via Next.js Middleware.
- JWT-based authentication.
- Password hashing with bcrypt.

---
Built with ❤️ by Pro Access Hub Team.
