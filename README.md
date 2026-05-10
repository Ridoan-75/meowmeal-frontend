# MeowMeal — Food Delivery Frontend

> A modern, AI-powered food delivery web application built with Next.js 15, TypeScript, and TailwindCSS.

## 🌐 Live Demo

- **Frontend:** https://meowmeal-frontend.vercel.app
- **Backend API:** https://meowmeal-backend.onrender.com

## 🧪 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Customer | rahim@gmail.com | password123 |
| Provider | salamsbistro@gmail.com | password123 |
| Admin | admin@meowmeal.com | password123 |

---

## ✨ Features

### 👤 Customer
- Browse meals by category, search, and filter
- Add to cart with optimistic updates
- Place orders with delivery address
- Real-time order status notifications
- AI-powered meal recommendations
- Wishlist management
- AI chatbot for food assistance
- Review meals after delivery

### 🍳 Provider (Restaurant Owner)
- Manage meals (create, edit, delete, toggle availability)
- View and update incoming orders
- Analytics dashboard with revenue charts
- AI menu description generator
- AI review sentiment analyzer
- Real-time order notifications

### ⚙️ Admin
- Platform overview with live analytics
- User management (ban/unban)
- Category management
- Provider verification
- Newsletter subscriber management
- Real-time notifications for new orders

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | ShadCN UI |
| State Management | Zustand |
| Data Fetching | TanStack Query |
| Authentication | Better Auth |
| Real-time | Socket.io Client |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Font | Plus Jakarta Sans |
| Animations | Lenis (smooth scroll) |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (public)/
│   │   ├── meals/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── providers/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── layout.tsx
│   ├── dashboard/
│   │   ├── admin/
│   │   ├── provider/
│   │   └── customer/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── common/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── MealCard.tsx
│   │   ├── NotificationBell.tsx
│   │   ├── AIChatbot.tsx
│   │   ├── CustomSelect.tsx
│   │   └── PageLoader.tsx
│   ├── dashboard/
│   │   ├── Sidebar.tsx
│   │   └── DashboardNavbar.tsx
│   └── sections/
│       ├── HeroSection.tsx
│       ├── FeaturedMeals.tsx
│       ├── CategorySection.tsx
│       └── ...
├── lib/
│   ├── axios.ts
│   └── auth-client.ts
├── providers/
│   ├── AuthProvider.tsx
│   ├── ThemeProvider.tsx
│   ├── QueryProvider.tsx
│   └── LenisProvider.tsx
├── store/
│   ├── cartStore.ts
│   ├── wishlistStore.ts
│   └── notificationStore.ts
└── middleware.ts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/meowmeal-frontend.git

# Navigate to project
cd meowmeal-frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### Environment Variables

Create `.env.local` in the root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

---

## 🎨 Color System

| Variable | Value | Usage |
|----------|-------|-------|
| Primary | `#FF6B35` | Buttons, accents |
| Accent | `#FFB800` | Ratings, highlights |
| Dark BG | `#0F0F0F` | Dark mode background |
| Card | `#242424` | Dark mode cards |

---

## 📱 Pages

### Public
| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, featured meals, categories |
| `/meals` | Browse all meals with search & filter |
| `/meals/[id]` | Meal details with reviews |
| `/providers` | Browse all restaurants |
| `/providers/[id]` | Restaurant details with menu |

### Auth
| Route | Description |
|-------|-------------|
| `/login` | Login with demo accounts |
| `/register` | Register as Customer or Provider |

### Customer Dashboard
| Route | Description |
|-------|-------------|
| `/dashboard/customer` | Overview |
| `/dashboard/customer/orders` | Order history |
| `/dashboard/customer/cart` | Shopping cart |
| `/dashboard/customer/wishlist` | Saved meals |
| `/dashboard/customer/recommendations` | AI recommendations |
| `/dashboard/customer/profile` | Profile settings |

### Provider Dashboard
| Route | Description |
|-------|-------------|
| `/dashboard/provider` | Overview |
| `/dashboard/provider/meals` | Meal management |
| `/dashboard/provider/orders` | Order management |
| `/dashboard/provider/analytics` | Revenue & analytics |
| `/dashboard/provider/reviews` | Customer reviews |
| `/dashboard/provider/profile` | Profile settings |

### Admin Dashboard
| Route | Description |
|-------|-------------|
| `/dashboard/admin` | Platform overview |
| `/dashboard/admin/users` | User management |
| `/dashboard/admin/orders` | All orders |
| `/dashboard/admin/categories` | Category management |
| `/dashboard/admin/providers` | Provider management |
| `/dashboard/admin/newsletter` | Newsletter subscribers |

---

## 🤖 AI Features

| Feature | Description |
|---------|-------------|
| AI Chatbot | Food assistant powered by Gemini AI with real DB data |
| Meal Recommendations | Personalized suggestions based on order history |
| Menu Description Generator | Auto-generate meal descriptions and tags |
| Review Sentiment Analyzer | Analyze customer reviews with AI insights |

---

## 🔔 Real-time Features

- **Socket.io** integration for live notifications
- Order status updates pushed to customers
- New order alerts for providers and admins
- Unread notification count badge

---

## 🚢 Deployment

### Vercel (Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Environment Variables on Vercel:**
```
NEXT_PUBLIC_API_URL=https://meowmeal-backend.onrender.com/api
NEXT_PUBLIC_APP_URL=https://meowmeal-frontend.vercel.app
```

---

## 📄 Related

- **Backend Repository:** [MeowMeal Backend](https://github.com/Ridoan-75/MeowMeal-Backend)
- **API Documentation:** https://meowmeal-backend.onrender.com/health

---

