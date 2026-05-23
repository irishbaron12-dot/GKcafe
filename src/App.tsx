/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuDisplay from './components/MenuDisplay';
import Cart from './components/Cart';
import AuthModal from './components/AuthModal';
import CustomerDashboard from './components/CustomerDashboard';

// Dynamically lazy-loaded heavy sub-views to optimize bundle size and load speed dramatically
const BookingForm = lazy(() => import('./components/BookingForm'));
const AboutView = lazy(() => import('./components/AboutView'));
const ContactView = lazy(() => import('./components/ContactView'));
const TestimonialsList = lazy(() => import('./components/TestimonialsList'));
const FAQView = lazy(() => import('./components/FAQView'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));

// GK Premium minimal loading fallback
const DelayedFallback = () => (
  <div className="py-16 flex flex-col items-center justify-center space-y-4">
    <div className="w-8 h-8 rounded-full border-4 border-[#8c6239] border-t-transparent animate-spin" />
    <span className="text-[10px] uppercase font-black tracking-[0.2em] text-[#8c6239] animate-pulse">Preparing Premium View...</span>
  </div>
);
import { MenuItem, Order, Booking, Testimonial, FAQItem, AppNotification, CartItem } from './types';
import { 
  Coffee, Shield, Sparkles, MapPin, Grid, ArrowRight, Heart, HeartHandshake, Star, Play,
  Megaphone
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Core Entity States
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [salesStats, setSalesStats] = useState<any>({
    totalOrders: 0,
    revenue: 0,
    pendingBookings: 0,
    approvedBookings: 0,
    allOrdersCount: 0,
    allBookingsCount: 0,
    usersCount: 0
  });

  // Modal Open Toggles
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Active Toast Status
  const [heroAlert, setHeroAlert] = useState<string | null>(null);

  // Active Broadcast Ticker from Admin Command Center
  const [activeBroadcast, setActiveBroadcast] = useState<any>(() => {
    const saved = localStorage.getItem('gk_active_broadcast');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Sync state broadcast updates from admin commands
  useEffect(() => {
    (window as any).onBroadcastUpdated = (payload: any) => {
      setActiveBroadcast(payload);
    };
    return () => {
      delete (window as any).onBroadcastUpdated;
    };
  }, []);

  // Initial Boot loader
  useEffect(() => {
    // 1. Attempt session recovery
    const savedToken = localStorage.getItem('gk_auth_token');
    const savedUser = localStorage.getItem('gk_user');
    if (savedToken && savedUser) {
      setAuthToken(savedToken);
      setCurrentUser(JSON.parse(savedUser));
    }

    // 2. Fetch public menu, FAQs, testimonials
    fetchMenu();
    fetchFAQs();
    fetchTestimonials();
  }, []);

  // Sync users details when token shifts
  useEffect(() => {
    if (authToken) {
      fetchOrders();
      fetchBookings();
      fetchNotifications();
      if (currentUser?.role === 'admin') {
        fetchSalesStats();
      }
    } else {
      setOrders([]);
      setBookings([]);
      setNotifications([]);
    }
  }, [authToken, currentUser]);

  // Handle Toast autohide
  useEffect(() => {
    if (heroAlert) {
      const timer = setTimeout(() => setHeroAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [heroAlert]);

  // --- API ROUTE AXIOS WRAPPERS ---
  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/menu');
      if (res.ok) {
        const data = await res.json();
        setMenuItems(data);
      }
    } catch (e) {
      console.error('Menu load error:', e);
    }
  };

  const fetchFAQs = async () => {
    try {
      const res = await fetch('/api/faqs');
      if (res.ok) {
        const data = await res.json();
        setFaqs(data);
      }
    } catch (e) {
      console.error('FAQs load error:', e);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials');
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      }
    } catch (e) {
      console.error('Testimonials load error:', e);
    }
  };

  const fetchOrders = async () => {
    if (!authToken) return;
    try {
      const res = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error('Orders fetch error:', e);
    }
  };

  const fetchBookings = async () => {
    if (!authToken) return;
    try {
      const res = await fetch('/api/bookings', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (e) {
      console.error('Bookings fetch error:', e);
    }
  };

  const fetchNotifications = async () => {
    if (!authToken) return;
    try {
      const res = await fetch('/api/notifications', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      console.error('Notifications fetch error:', e);
    }
  };

  const fetchSalesStats = async () => {
    if (!authToken || currentUser?.role !== 'admin') return;
    try {
      const res = await fetch('/api/admin/sales-stats', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSalesStats(data);
      }
    } catch (e) {
      console.error('Stats fetch error:', e);
    }
  };

  // Mark notification as read
  const handleMarkAsRead = async (id: string) => {
    if (!authToken) return;
    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- CART WORKLOWS ---
  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => {
      const exists = prev.find((c) => c.menuItemId === item.id);
      if (exists) {
        return prev.map((c) =>
          c.menuItemId === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [
        ...prev,
        {
          id: 'cart-' + Math.random().toString(36).substr(2, 9),
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl,
          quantity: 1
        }
      ];
    });
    setHeroAlert(`🛒 Placed "${item.name}" into your orders basket!`);
  };

  const handleUpdateQuantity = (menuItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.menuItemId === menuItemId) {
            const newQty = c.quantity + delta;
            return { ...c, quantity: newQty };
          }
          return c;
        })
        .filter((c) => c.quantity > 0)
    );
  };

  const handleRemoveItem = (menuItemId: string) => {
    setCart((prev) => prev.filter((c) => c.menuItemId !== menuItemId));
  };

  const handleCheckout = async (details: any) => {
    if (!authToken) return;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          items: cart,
          ...details
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Checkout parameters failed.');
      }

      setHeroAlert(`🎉 Perfect! Order assigned successfully! Tracking Code: ${data.order.id}`);
      setCart([]);
      setActiveTab('menu');
      fetchOrders();
      fetchNotifications();
    } catch (e: any) {
      alert(e.message || 'Error occurred checkout out order');
    }
  };

  // --- BOOKINGS INQUIRIES WORKFLOWS ---
  const handleBookingSubmit = async (details: any) => {
    if (!authToken) return;

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(details)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed scheduling banquet event.');
    }

    fetchBookings();
    fetchNotifications();
    if (currentUser?.role === 'admin') fetchSalesStats();
  };

  // --- REVIEW TESTIMONIAL SUBMISSIONS ---
  const handleReviewSubmit = async (details: { rating: number; comment: string }) => {
    if (!authToken) return;
    const res = await fetch('/api/testimonials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(details)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed transmitting testimonial.');
    }

    fetchTestimonials();
  };

  // --- ADMINISTRATOR SPECIFIC WRAPPERS ---
  const handleUpdateOrderStatus = async (id: string, status: any) => {
    if (!authToken) return;
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      fetchOrders();
      fetchSalesStats();
      fetchNotifications();
    }
  };

  const handleUpdateBookingStatus = async (id: string, status: any) => {
    if (!authToken) return;
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      fetchBookings();
      fetchSalesStats();
      fetchNotifications();
    }
  };

  const handleCreateMenuItem = async (payload: any) => {
    if (!authToken) return;
    const res = await fetch('/api/menu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      fetchMenu();
    }
  };

  const handleUpdateMenuItem = async (id: string, payload: any) => {
    if (!authToken) return;
    const res = await fetch(`/api/menu/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      fetchMenu();
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    if (!authToken) return;
    const res = await fetch(`/api/menu/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to delete product from database.');
    }
    fetchMenu();
  };

  // --- AUTH SEAMLESS ENTRY ---
  const handleLoginSuccess = (token: string, user: any) => {
    setAuthToken(token);
    setCurrentUser(user);
    setHeroAlert(`👋 Welcome back, ${user.name}! Enjoy Prime access.`);
  };

  const handleLogout = () => {
    localStorage.removeItem('gk_auth_token');
    localStorage.removeItem('gk_user');
    setAuthToken(null);
    setCurrentUser(null);
    setCart([]);
    setIsCartOpen(false);
    setActiveTab('home');
    setHeroAlert('🔐 Logged out out of portals. Good day!');
  };

  // Filter features
  const bestSellers = menuItems.filter((m) => m.category === 'bilao' || m.category === 'delivery_meals').slice(0, 3);

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col justify-between selection:bg-[#c4a484]/30 selection:text-[#5c4033]">
      
      {/* 1. Global Navigation Frame */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        notifications={notifications}
        onMarkNotificationAsRead={handleMarkAsRead}
      />

      {/* Dynamic Global Bulletin Announcement from Command Center */}
      {activeBroadcast && (
        <div id="global-broadcast-banner" className={`transition-all duration-300 border-b select-none overflow-hidden ${
          activeBroadcast.theme === 'red'
            ? 'bg-rose-50 border-rose-200 text-rose-950 font-bold'
            : activeBroadcast.theme === 'green'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-bold'
            : 'bg-amber-50 border-amber-200 text-amber-950 font-bold'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center text-xs">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <Megaphone className={`w-4 h-4 shrink-0 animate-bounce ${
                activeBroadcast.theme === 'red'
                  ? 'text-rose-700'
                  : activeBroadcast.theme === 'green'
                  ? 'text-emerald-700'
                  : 'text-amber-700'
              }`} />
              <span className="truncate">{activeBroadcast.message}</span>
            </div>
            <button
              id="close-broadcast-btn"
              onClick={() => setActiveBroadcast(null)}
              className="text-stone-450 hover:text-stone-700 bg-transparent border-0 cursor-pointer text-xs p-1 h-5 w-5 flex items-center justify-center font-bold font-sans"
              title="Close Ticker"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* 2. Feedback Alert Slide Toast */}
      {heroAlert && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="bg-[#8c6239] border border-[#eadaaf] text-white text-xs font-bold py-3.5 px-6 rounded-2xl shadow-2xl flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#faf6f0]" />
            <span>{heroAlert}</span>
          </div>
        </div>
      )}

      {/* 3. Conditional Layout Engine Router */}
      <main className="flex-1">
        
        {/* -- TAB: HOME VIEW -- */}
        {activeTab === 'home' && (
          <div className="space-y-16 pb-16">
            
            {/* Elegant Hero Frame */}
            <Hero
              onOrderNow={() => {
                setActiveTab('menu');
                setTimeout(() => {
                  document.getElementById('menu-section-anchor')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              onBookCatering={() => {
                setActiveTab('menu');
                setTimeout(() => {
                  document.getElementById('banquet-calendar-panel')?.scrollIntoView({ behavior: 'smooth' });
                }, 150);
              }}
            />

            {/* Quick Promo Banner Bento Layout */}
            <section className="bg-[#faf6f0] border-y border-[#e3dcd5] py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                <div className="lg:col-span-4 space-y-4">
                  <span className="text-[10px] font-black tracking-widest text-[#8c6239] uppercase">GK FIESTA PLATTERS</span>
                  <h3 className="text-2xl font-serif text-[#5c4033]">Celebrate over our traditional Filipino Bilaos</h3>
                  <p className="text-xs text-[#8c6239] leading-relaxed font-semibold">
                    Perfect for gatherings and milestones, our woven Bilaos feature fresh pancit, crunchy spring rolls, and authentic local Kakanin sweet matrices.
                  </p>
                  <button
                    onClick={() => {
                      setActiveTab('menu');
                      setTimeout(() => {
                        const btn = document.getElementById('menu-filter-btn-bilao');
                        if (btn) btn.click();
                      }, 100);
                    }}
                    className="flex items-center space-x-1 text-xs font-bold text-[#8c6239] hover:underline hover:translate-x-1 transition-all bg-transparent border-0 cursor-pointer"
                  >
                    <span>Browse Fiesta Platters Catalog</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="h-60 rounded-2xl overflow-hidden relative shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=30&w=600&auto=format&fit=crop"
                      alt="Traditional Pancit Bilao"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                    <span className="absolute bottom-4 left-4 text-[#faf6f0] text-xs font-black tracking-wider uppercase">FIESTA NOODLES PLATTER</span>
                  </div>

                  <div className="h-60 rounded-2xl overflow-hidden relative shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1514517604298-cf80e0fb7f1e?q=30&w=600&auto=format&fit=crop"
                      alt="Fresh Kakanin treats"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                    <span className="absolute bottom-4 left-4 text-[#faf6f0] text-xs font-black tracking-wider uppercase">LOCAL SWEET KAKANINS</span>
                  </div>
                </div>

              </div>
            </section>

            {/* Best Sellers segment */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="space-y-4 text-center">
                <span className="text-[10px] font-black tracking-[0.25em] text-[#8c6239] uppercase">
                  CRAVED BY REGULATION CUSTOMERS
                </span>
                <h3 className="text-3xl font-serif text-[#5c4033]">Fiesta Platters & Hot Meals</h3>
                <p className="text-xs text-[#8c6239]/80 max-w-sm mx-auto leading-relaxed">
                  Browse standard client-favorite hot portions dispatched freshly with internal thermal couriers.
                </p>
              </div>

              {/* Grid of food dishes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                {bestSellers.map((item) => (
                  <div key={item.id} className="bg-white rounded-3xl border border-[#efebe9] overflow-hidden p-3.5 hover:border-[#8c6239]/40 hover:shadow-xs transition-all flex flex-col justify-between">
                    <div className="h-48 rounded-2xl overflow-hidden relative">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-black text-[#5c4033]">
                        ₱{item.price}
                      </span>
                    </div>

                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <h4 className="text-xs font-extrabold text-[#5c4033]">{item.name}</h4>
                        <p className="text-[11px] text-[#8c6239] leading-relaxed font-semibold line-clamp-2">{item.description}</p>
                      </div>

                      <button
                        onClick={() => handleAddToCart(item)}
                        className="w-full py-2 rounded-xl bg-[#8c6239] hover:bg-[#5c4033] text-[#faf6f0] text-[10px] font-black uppercase tracking-wider border-0 cursor-pointer"
                      >
                        ⚡ Add to basket
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Client Testimonials Carousel */}
            <section className="bg-zinc-50 border-y border-zinc-200 py-12">
              <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
                <span className="text-[10px] font-black tracking-widest text-[#8c6239] uppercase">CLIENT ELEVATIONS</span>
                <p className="text-lg font-serif italic text-[#3c2a1e]">
                  "GK Cafe by Primo completely redefined our wedding banquet. The coffee station was the main topic of conversation, and the staffing details looked extraordinarily executive. Thank you!"
                </p>
                <div>
                  <p className="text-[11px] font-black text-[#2d1b15]">Christina Reyes</p>
                  <p className="text-[9px] text-[#8c6239] uppercase font-bold mt-0.5">Wedding Catering Client</p>
                </div>

                <button
                  onClick={() => setActiveTab('contact')}
                  className="px-6 py-2.5 rounded-xl border border-stone-300 text-xs font-bold uppercase transition-colors hover:bg-stone-100 cursor-pointer"
                >
                  Write Your Review / Feedback
                </button>
              </div>
            </section>

            {/* FAQs Accordion preview */}
            <section className="max-w-3xl mx-auto px-4">
              <Suspense fallback={<DelayedFallback />}>
                <FAQView faqs={faqs.slice(0, 3)} />
              </Suspense>
              <div className="text-center mt-6">
                <button
                  onClick={() => {
                    setActiveTab('menu');
                    setTimeout(() => {
                      document.getElementById('menu-section-anchor')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="text-xs font-bold text-[#8c6239] underline uppercase"
                >
                  See Menu Categories
                </button>
              </div>
            </section>

          </div>
        )}

        {/* -- TAB: MENU DISPLAY (AND SERVICES COFFEE CART) -- */}
        {activeTab === 'menu' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#8c6239] block mb-1">
                KITCHEN & COUNTER DISPATCH
              </span>
              <h2 className="text-3xl font-serif text-[#5c4033]">Specialty Drink Lists & Package Plates</h2>
              <p className="text-xs text-[#8c6239] mt-1">
                From morning caffeine double-shots to corporate buffet packages, choose what matches your state.
              </p>
            </div>

            {/* Dynamic visual category matrices */}
            <MenuDisplay
              menuItems={menuItems}
              onAddToCart={handleAddToCart}
              onBookCateringClick={() => {
                setActiveTab('contact');
                setTimeout(() => {
                  document.getElementById('banquet-calendar-panel')?.scrollIntoView({ behavior: 'smooth' });
                }, 150);
              }}
            />

            {/* Dynamic Event Booking Scheduler Anchor */}
            <div className="pt-10 border-t border-[#e3dcd5]" id="banquet-calendar-panel">
              <div className="max-w-3xl mx-auto w-full">
                <Suspense fallback={<DelayedFallback />}>
                  <BookingForm
                    cateringPackages={[]}
                    onSubmitBooking={handleBookingSubmit}
                    currentUser={currentUser}
                    onOpenAuth={() => setIsAuthOpen(true)}
                  />
                </Suspense>
              </div>
            </div>

          </div>
        )}

        {/* -- TAB: ABOUT VIEW US -- */}
        {activeTab === 'about' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <Suspense fallback={<DelayedFallback />}>
              <AboutView />
            </Suspense>
          </div>
        )}

        {/* -- TAB: CONTACT & TESTIMONIAL AUDITS -- */}
        {activeTab === 'contact' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
            
            <Suspense fallback={<DelayedFallback />}>
              <ContactView />
            </Suspense>

            {/* Testimonials Registry block */}
            <div className="pt-12 border-t border-[#e3dcd5]" id="banquet-reviews-block">
              <div className="space-y-4 mb-8">
                <span className="text-[10px] font-black tracking-widest text-[#8c6239] uppercase block text-center">COMMUNITY FEEDBACK INTEGRITY</span>
                  <h3 className="text-2xl font-serif text-[#5c4033] text-center">Check Out Our Reviews</h3>
                <p className="text-xs text-[#8c6239] text-center max-w-sm mx-auto leading-relaxed">
                  Real commentaries from corporate seminar coordinators or casual iced macchiato customers.
                </p>
              </div>

              <Suspense fallback={<DelayedFallback />}>
                <TestimonialsList
                  testimonials={testimonials}
                  onSubmitReview={handleReviewSubmit}
                  currentUser={currentUser}
                  onOpenAuth={() => setIsAuthOpen(true)}
                />
              </Suspense>
            </div>

          </div>
        )}

        {/* Tracker component removed as per user request */}

        {/* -- TAB: ADMIN BOARD CONTROL -- */}
        {activeTab === 'admin' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {currentUser?.role === 'admin' ? (
              <Suspense fallback={<DelayedFallback />}>
                <AdminDashboard
                  menuItems={menuItems}
                  orders={orders}
                  bookings={bookings}
                  salesStats={salesStats}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onUpdateBookingStatus={handleUpdateBookingStatus}
                  onCreateMenuItem={handleCreateMenuItem}
                  onUpdateMenuItem={handleUpdateMenuItem}
                  onDeleteMenuItem={handleDeleteMenuItem}
                />
              </Suspense>
            ) : (
              <div className="text-center py-20 bg-white border border-[#efebe9] rounded-3xl max-w-md mx-auto space-y-4">
                <span className="text-4xl">⚠️</span>
                <h3 className="text-sm font-bold text-[#8c6239]">Access Refused. Private Administration Path.</h3>
                <p className="text-[11px] text-[#5c4033] max-w-xs mx-auto">
                  Only verified GK Cafe Prim Banquets Administrators can access active dispatch databases. Please log in using verified admin access.
                </p>
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="px-6 py-2 rounded-xl bg-[#8c6239] hover:bg-[#5c4033] text-white text-xs font-black uppercase"
                >
                  Sign In As Administrator
                </button>
              </div>
            )}
          </div>
        )}

        {/* -- TAB: CUSTOMER DASHBOARD & REALTIME TRACKING -- */}
        {activeTab === 'dashboard' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {currentUser ? (
              <CustomerDashboard 
                currentUser={currentUser}
                orders={orders}
                bookings={bookings}
                onReloadOrders={fetchOrders}
                onReloadBookings={fetchBookings}
                setActiveTab={setActiveTab}
              />
            ) : (
              <div className="text-center py-20 bg-white border border-[#efebe9] rounded-3xl max-w-md mx-auto space-y-4">
                <span className="text-4xl">🔒</span>
                <h3 className="text-sm font-bold text-[#8c6239]">Login Required to track orders</h3>
                <p className="text-[11px] text-[#5c4033] max-w-xs mx-auto">
                  Please sign in to access your personal dashboard, track live deliveries in real-time, and leave reviews for your past food orders.
                </p>
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="px-6 py-2 rounded-xl bg-[#8c6239] hover:bg-[#5c4033] text-white text-xs font-black uppercase"
                >
                  Sign In / Create Account
                </button>
              </div>
            )}
          </div>
        )}

      </main>

      {/* 4. Global Themed Footer */}
      <footer className="bg-[#faf6f0] text-[#5c4033] border-t border-[#e3dcd5] pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#e3dcd5]">
          
          {/* Brand col */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-lg bg-[#8c6239] text-white flex items-center justify-center font-black">
                GK
              </div>
              <div>
                <span className="block text-sm font-extrabold tracking-widest text-[#faf6f0]">GK CAFE</span>
                <span className="block text-[9px] font-bold tracking-widest text-amber-200 uppercase">BY PRIMO</span>
              </div>
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed font-semibold">
              Combining original Batangas Barako coffee, homemade Filipino delicacies, express home deliveries, and luxurious catering layouts designed for your dream milestones.
            </p>
          </div>

          {/* Links 1 */}
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Products & Services</p>
            <ul className="text-xs space-y-1.5 font-bold">
              <li><button onClick={() => { setActiveTab('menu'); }} className="hover:text-amber-200 text-left bg-transparent border-0 cursor-pointer">☕ Premium Coffee Lists</button></li>
              <li><button onClick={() => { setActiveTab('menu'); }} className="hover:text-amber-200 text-left bg-transparent border-0 cursor-pointer">🍱 Filipino Bilaos</button></li>
              <li><button onClick={() => { setActiveTab('menu'); }} className="hover:text-amber-200 text-left bg-transparent border-0 cursor-pointer">🏆 Executive Cateringブルー</button></li>
              <li><button onClick={() => { setActiveTab('menu'); }} className="hover:text-amber-200 text-left bg-transparent border-0 cursor-pointer">🍳 Online Hot Food Delivery</button></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Cafe Portals & Help</p>
            <ul className="text-xs space-y-1.5 font-bold">
              <li><button onClick={() => setIsAuthOpen(true)} className="hover:text-amber-200 text-left bg-transparent border-0 cursor-pointer">🔐 Customer Gate</button></li>
              <li><button onClick={() => { setActiveTab('contact'); }} className="hover:text-amber-200 text-left bg-transparent border-0 cursor-pointer">📅 Banquet Advisors</button></li>
              <li><button onClick={() => { setActiveTab('about'); }} className="hover:text-amber-200 text-left bg-transparent border-0 cursor-pointer">🥇 Our Sourcing Heritage</button></li>
            </ul>
          </div>

          {/* Contact coordinates */}
          <div className="space-y-3 font-semibold text-xs text-stone-400">
            <p className="text-[10px] font-black uppercase tracking-widest text-white">Central Advisors Point</p>
            <p>📍 Brgy. Maahas, Los Baños, Laguna, Philippines</p>
            <p>📞 +63 917 123 4567 • (02) 8888 7777</p>
            <p>✉ hello@gkcafe.com</p>
          </div>

        </div>

        {/* Tiny foot line */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-stone-500 font-bold uppercase tracking-wider gap-4">
          <span>📅 Office Operations: 07:00 AM — 10:00 PM Daily</span>
          <div className="flex space-x-4">
            <span>© 2026 Primo Group of Restaurants</span>
            <span>•</span>
            <span>All rights reserved</span>
          </div>
        </div>
      </footer>

      {/* 5. SIDE DRAWER CART COMPONENT */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* 6. AUTHENTICATION CREDENTIALS MODAL */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}
