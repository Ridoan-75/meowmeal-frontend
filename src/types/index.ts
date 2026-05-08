export interface User {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "PROVIDER" | "ADMIN";
  image?: string;
  phone?: string;
  address?: string;
  city?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
  isActive: boolean;
  _count?: { meals: number };
}

export interface ProviderProfile {
  id: string;
  userId: string;
  shopName: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  address: string;
  city: string;
  phone?: string;
  isVerified: boolean;
  isOpen: boolean;
  createdAt: string;
  _count?: { meals: number };
}

export interface Meal {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  tags: string[];
  prepTime: number;
  isAvailable: boolean;
  categoryId: string;
  providerId: string;
  createdAt: string;
  category: { id: string; name: string; slug: string };
  provider: {
    id: string;
    shopName: string;
    logo?: string;
    city: string;
    isOpen: boolean;
  };
  avgRating?: number;
  totalReviews?: number;
}

export interface CartItem {
  id: string;
  cartId: string;
  mealId: string;
  quantity: number;
  meal: {
    id: string;
    title: string;
    price: number;
    images: string[];
    isAvailable: boolean;
    provider: {
      id: string;
      shopName: string;
      isOpen: boolean;
    };
  };
}

export interface Cart {
  id: string;
  customerId: string;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

export interface Order {
  id: string;
  customerId: string;
  providerId: string;
  status: "PLACED" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";
  totalAmount: number;
  deliveryAddress: string;
  deliveryCity: string;
  note?: string;
  createdAt: string;
  items: {
    id: string;
    mealId: string;
    quantity: number;
    price: number;
    meal: { id: string; title: string; images: string[] };
  }[];
  customer?: { id: string; name: string };
}

export interface Review {
  id: string;
  customerId: string;
  mealId: string;
  rating: number;
  comment: string;
  sentiment?: string;
  createdAt: string;
  customer: { id: string; name: string; image?: string };
}

export interface Notification {
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  createdAt: Date;
  read: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}