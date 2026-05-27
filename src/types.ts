/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MenuItemSizeOption {
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'hot_coffee' | 'iced_coffee' | 'frappes' | 'milk_tea' | 'bilao' | 'delivery_meals';
  imageUrl: string;
  active: boolean;
  sizes?: MenuItemSizeOption[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  size?: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'dispatched' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'gcash_mock' | 'card_mock';
export type ServiceType = 'delivery' | 'pickup';

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  totalAmount: number;
  serviceType: ServiceType;
  deliveryAddress: string;
  deliveryPhone: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  status: OrderStatus;
  createdAt: string;
  review?: {
    rating: number;
    comment: string;
    createdAt: string;
  };
}

export type BookingStatus = 'pending' | 'approved' | 'declined' | 'completed';
export type BookingType = 'catering' | 'appointment';

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  bookingType: BookingType;
  eventName: string;
  eventDate: string;
  eventTime: string;
  guestCount: number;
  selectedPackageId?: string;
  selectedPackageName?: string;
  status: BookingStatus;
  notes?: string;
  priceEstimated: number;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number; // 1-5
  comment: string;
  verified: boolean;
  createdAt: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface AppNotification {
  id: string;
  message: string;
  read: boolean;
  forAdmin: boolean;
  userId?: string;
  createdAt: string;
}

export interface DBState {
  menuItems: MenuItem[];
  orders: Order[];
  bookings: Booking[];
  testimonials: Testimonial[];
  notifications: AppNotification[];
}
