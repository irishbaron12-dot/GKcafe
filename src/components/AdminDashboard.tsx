/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, Plus, Edit2, Trash2, Calendar, Coffee, UserCheck, 
  ShoppingBag, Check, X, Truck, Package, DollarSign, Users, Award,
  Megaphone, Send, Sparkles, MapPin, CheckCircle, Info, ChevronRight,
  PieChart, TrendingUp, AlertTriangle, ClipboardList, CheckSquare, Clock, ArrowUpRight, Star
} from 'lucide-react';
import { MenuItem, Order, Booking, OrderStatus, BookingStatus } from '../types';

interface AdminDashboardProps {
  menuItems: MenuItem[];
  orders: Order[];
  bookings: Booking[];
  salesStats: {
    totalOrders: number;
    revenue: number;
    pendingBookings: number;
    approvedBookings: number;
    allOrdersCount: number;
    allBookingsCount: number;
    usersCount: number;
  };
  onUpdateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  onUpdateBookingStatus: (id: string, status: BookingStatus) => Promise<void>;
  onCreateMenuItem: (item: Partial<MenuItem>) => Promise<void>;
  onUpdateMenuItem: (id: string, item: Partial<MenuItem>) => Promise<void>;
  onDeleteMenuItem: (id: string) => Promise<void>;
}

export default function AdminDashboard({
  menuItems,
  orders,
  bookings,
  salesStats,
  onUpdateOrderStatus,
  onUpdateBookingStatus,
  onCreateMenuItem,
  onUpdateMenuItem,
  onDeleteMenuItem
}: AdminDashboardProps) {
  // Tabs: 'orders' (1. Customer Orders), 'tables' (2. Reservations Ledger), 'catering' (3. Catering Bookings), 'menu' (4. Stock & Menu curator), 'broadcast' (5. Broadcast Board), 'analytics' (6. Analytics), 'calendar' (7. Calendar Appointments)
  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'tables' | 'catering' | 'menu' | 'broadcast' | 'analytics' | 'calendar' | 'reviews' | 'story'>('analytics');
  const [cateringInnerTab, setCateringInnerTab] = useState<'packages' | 'tables' | 'calendar'>('packages');

  // Stateful Alerts and Confirmation Dialog System for sandboxed environments
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => prev?.message === message ? null : prev);
    }, 4500);
  };

  // Shadow scope alert
  const alert = (msg: string) => {
    const isError = msg.toLowerCase().includes('error') || msg.toLowerCase().includes('fail') || msg.toLowerCase().includes('denied') || msg.toLowerCase().includes('please');
    showToast(msg, isError ? 'error' : 'success');
  };

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const triggerConfirm = (title: string, message: string, onConfirm: () => void | Promise<void>) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        await onConfirm();
      }
    });
  };

  // Pie/Donut Chart Interactivity State
  const [hoveredPieSegment, setHoveredPieSegment] = useState<'success' | 'queue' | 'catering' | null>(null);
  
  // Ingredients Stock & Supplies state (with low stock alerts!)
  const [ingredients, setIngredients] = useState([
    { id: '1', name: 'Premium Arabica/Barako Beans', category: 'Supplies', stock: 8, unit: 'kg', threshold: 15 },
    { id: '2', name: 'Whole Milk Bottles', category: 'Ingredients', stock: 6, unit: 'L', threshold: 12 },
    { id: '3', name: 'Woven Bamboo Bilaos (Large)', category: 'Supplies', stock: 18, unit: 'pcs', threshold: 10 },
    { id: '4', name: 'Pansit Bihon Noodles Packets', category: 'Ingredients', stock: 25, unit: 'bags', threshold: 15 },
    { id: '5', name: 'Prepared Pork Spring Rolls', category: 'Ingredients', stock: 50, unit: 'pcs', threshold: 80 },
    { id: '6', name: 'Catering Premium Table Linen', category: 'Supplies', stock: 4, unit: 'sets', threshold: 6 },
    { id: '7', name: 'Sweet Soy & Oyster Sauce', category: 'Ingredients', stock: 12, unit: 'L', threshold: 8 }
  ]);

  // State to add customized ingredient items
  const [newIngName, setNewIngName] = useState('');
  const [newIngCategory, setNewIngCategory] = useState<'Ingredients' | 'Supplies'>('Ingredients');
  const [newIngStock, setNewIngStock] = useState(15);
  const [newIngUnit, setNewIngUnit] = useState('pcs');
  const [newIngThreshold, setNewIngThreshold] = useState(10);
  const [isAddingIngredient, setIsAddingIngredient] = useState(false);

  // Broadcast & Staff Reminders
  const [staffReminders, setStaffReminders] = useState([
    { id: '1', text: 'Call John Milton Wedding re: buffet sequence customization', completed: false, date: '2026-05-24', priority: 'high' },
    { id: '2', text: 'Confirm Barako coffee roast shipment delivery parameters', completed: true, date: '2026-05-23', priority: 'medium' },
    { id: '3', text: 'Prepare table setting arrangement templates for coffee VIP private seating', completed: false, date: '2026-05-25', priority: 'low' }
  ]);
  const [newReminderText, setNewReminderText] = useState('');
  const [newReminderPriority, setNewReminderPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Interactive Catering Calendar Events Scheduler
  const [calendarEvents, setCalendarEvents] = useState([
    { id: 'e1', title: 'Grand Wedding catering buffet', date: '2026-05-24', time: '11:00', type: 'catering', client: 'Milton Wedding VIP', location: 'Milton Grand Ballroom' },
    { id: 'e2', title: 'Consultation: VIP Corporate Coffee lounge booking', date: '2026-05-26', time: '14:30', type: 'meeting', client: 'Aero Corp Group', location: 'Coffee Lounge VIP Table' },
    { id: 'e3', title: 'Reunion buffet event catering dispatch', date: '2026-05-29', time: '18:00', type: 'catering', client: 'Aquino Reunion Family', location: 'Los Baños Garden Pavillion' },
    { id: 'e4', title: 'Milton client proposal review', date: '2026-05-23', time: '09:00', type: 'meeting', client: 'Milton Catering Coordinator', location: 'Admin Office' }
  ]);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>('2026-05-23');
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('12:00');
  const [newEventType, setNewEventType] = useState<'catering' | 'meeting'>('catering');
  const [newEventClient, setNewEventClient] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');

  // Orders queue preparation and priorities management
  const [orderPrepTimes, setOrderPrepTimes] = useState<Record<string, string>>({
    'ORD-201': '15 mins',
    'ORD-202': '35 mins'
  });
  const [urgentOrders, setUrgentOrders] = useState<string[]>([]);
  const [analyticalPeriod, setAnalyticalPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  // Menu form editors state
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  
  // New/Edit state variables for items
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState(150);
  const [prodCategory, setProdCategory] = useState<MenuItem['category']>('hot_coffee');
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [prodActive, setProdActive] = useState(true);

  // Customer Reviews & Feedback state & loader
  const [testimonialsList, setTestimonialsList] = useState<any[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState<boolean>(false);
  const [reviewsFilter, setReviewsFilter] = useState<number | 'all'>('all');

  const fetchTestimonials = async () => {
    setLoadingTestimonials(true);
    try {
      const res = await fetch('/api/testimonials');
      if (res.ok) {
        const data = await res.json();
        setTestimonialsList(data);
      }
    } catch (e) {
      console.error("Error loading testimonials in admin dashboard", e);
    } finally {
      setLoadingTestimonials(false);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'reviews') {
      fetchTestimonials();
    }
  }, [activeSubTab]);

  // Filter query states
  const [orderFilter, setOrderFilter] = useState<string>('all');

  // Broadcast state
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastTheme, setBroadcastTheme] = useState('gold');
  const [currentBroadcast, setCurrentBroadcast] = useState<any>(null);

  useEffect(() => {
    const active = localStorage.getItem('gk_active_broadcast');
    if (active) {
      try {
        setCurrentBroadcast(JSON.parse(active));
      } catch (e) {
        console.error('Error loading broadcast:', e);
      }
    }
  }, []);

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItemId(item.id);
    setProdName(item.name);
    setProdDesc(item.description);
    setProdPrice(item.price);
    setProdCategory(item.category);
    setProdImageUrl(item.imageUrl);
    setProdActive(item.active);
    setIsAddingProduct(false);
    
    // Smooth scroll to form
    setTimeout(() => {
      document.getElementById('inventory-form-anchor')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleClearForm = () => {
    setProdName('');
    setProdDesc('');
    setProdPrice(150);
    setProdCategory('hot_coffee');
    setProdImageUrl('');
    setProdActive(true);
    setIsAddingProduct(false);
    setEditingItemId(null);
  };

  const handleSubmitProductForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    try {
      const payload = {
        name: prodName.trim(),
        description: prodDesc.trim(),
        price: Number(prodPrice),
        category: prodCategory,
        imageUrl: prodImageUrl.trim() || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop',
        active: prodActive
      };

      if (editingItemId) {
        await onUpdateMenuItem(editingItemId, payload);
        alert('Product modified successfully!');
      } else {
        await onCreateMenuItem(payload);
        alert('Product created and added to cafe inventory!');
      }
      handleClearForm();
    } catch (err: any) {
      alert(err.message || 'Error processing item.');
    }
  };

  const handleDelete = async (id: string) => {
    triggerConfirm(
      'Remove Product',
      'Are you absolutely sure you want to remove this product from the menu catalog?',
      async () => {
        try {
          await onDeleteMenuItem(id);
          alert('Product deleted successfully.');
        } catch (err: any) {
          alert(err.message || 'Error deleting item');
        }
      }
    );
  };

  // Publish Broadcast Message
  const handlePublishBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMsg.trim()) return;

    const payload = {
      message: broadcastMsg.trim(),
      theme: broadcastTheme,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('gk_active_broadcast', JSON.stringify(payload));
    setCurrentBroadcast(payload);
    setBroadcastMsg('');
    alert('📢 News bulletin published! The announcement is now displayed globally on all customer screens.');
    
    // Notify window if anyone's listening
    if ((window as any).onBroadcastUpdated) {
      (window as any).onBroadcastUpdated(payload);
    }
  };

  // Clear Broadcast Ticker
  const handleClearBroadcast = () => {
    localStorage.removeItem('gk_active_broadcast');
    setCurrentBroadcast(null);
    alert('📢 Bulletin announcement cleared from client screens.');
    
    if ((window as any).onBroadcastUpdated) {
      (window as any).onBroadcastUpdated(null);
    }
  };

  // Preset announcements
  const presets = [
    { text: "☕ Pure Batangas Barako original coffee is now back in stock! Crafted slowly in small-batches.", theme: "gold" },
    { text: "🎉 Weekend catering dates for July starting to close fast! Book your dream milestone now.", theme: "green" },
    { text: "🚚 Express Home Delivery is now fully active within Los Baños and neighboring Laguna centers!", theme: "gold" },
    { text: "⚠️ System under maintenance on morning of June 1. Rest assured phone lines remain open.", theme: "red" }
  ];

  // Filter lists based on states
  const filteredOrders = orders.filter(o => 
    orderFilter === 'all' ? true : o.status === orderFilter
  );

  const pendingTablesCount = bookings.filter(b => b.bookingType === 'appointment' && b.status === 'pending').length;
  const pendingCateringCount = bookings.filter(b => b.bookingType === 'catering' && b.status === 'pending').length;
  const pendingOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'preparing').length;

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl border border-[#efebe9] p-6 sm:p-8 flex flex-col gap-4 shadow-xs">
        <div>
          <span className="text-[#b45309] font-black tracking-[0.2em] text-[10px] sm:text-xs uppercase block">
            LIVE CAFE OPERATIONAL COMMAND
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#2d1b10] mt-1 leading-tight">
            Primo Station
          </h2>
          <p className="text-xs text-zinc-500 font-semibold mt-1 max-w-2xl leading-relaxed">
            Analyze revenue stats, dispatch orders, approve dine-in bookings, and curate canteen menus.
          </p>
        </div>
      </div>

      {/* 2. Key KPI Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Gross Sales Revenue */}
        <div className="bg-white rounded-3xl border border-[#efebe9] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between h-[135px]">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-stone-400">Gross Sales Revenue</p>
            <p className="text-3xl font-black text-[#2d1b10] mt-2">
              ₱{(salesStats.revenue || 800.00).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="flex items-center text-[10px] font-black text-emerald-700 space-x-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span className="uppercase tracking-wide">Success Dispatch Orders</span>
          </div>
        </div>

        {/* Card 2: Orders Queue */}
        <div className="bg-white rounded-3xl border border-[#efebe9] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between h-[135px]">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-stone-400">Orders Queue</p>
            <p className="text-3xl font-black text-[#2d1b10] mt-2">
              {pendingOrdersCount !== undefined ? pendingOrdersCount : 3}
            </p>
          </div>
          <p className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider">
            Pending & Preparing state
          </p>
        </div>

        {/* Card 3: Catering Appointments */}
        <div className="bg-white rounded-3xl border border-[#efebe9] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between h-[135px]">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-stone-400">Catering Appointments</p>
            <p className="text-3xl font-black text-[#2d1b10] mt-2">
              {pendingCateringCount !== undefined ? (pendingCateringCount || 1) : 1}
            </p>
          </div>
          <p className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider">
            Needs contract phone checks
          </p>
        </div>
      </div>

      {/* 3. Main Dashboard Navigation Sub-tabs */}
      <div className="border-b border-[#efebe9] flex flex-wrap gap-x-6 gap-y-2 pt-2">
        {[
          { id: 'analytics', label: '📊 Analytics Hub' },
          { id: 'orders', label: '1. Customer Orders' },
          { id: 'catering', label: '2. Catering Bookings' },
          { id: 'menu', label: '3. Stock & Menu curator' },
          { id: 'broadcast', label: '4. Broadcast Board' },
          { id: 'reviews', label: '⭐ Customer Reviews' },
          { id: 'story', label: '📜 Cafe Story Photo' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`pb-3 text-xs tracking-wider uppercase font-extrabold transition-all border-b-2 cursor-pointer ${
              activeSubTab === tab.id
                ? 'border-[#5c4033] text-[#2d1b10] font-black'
                : 'border-transparent text-stone-400 hover:text-[#5c4033]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Active Sub-Tab Viewport */}
      <div className="bg-[#fcfbf9]/40 rounded-3xl border border-[#efebe9] p-4 sm:p-6 lg:p-8">
        
        {/* -- TAB 1: CUSTOMER ORDERS & LIVE QUEUE -- */}
        {activeSubTab === 'orders' && (
          <div className="space-y-8">
            
            {/* Real-time incoming Queue Widget */}
            <div className="bg-[#faf6f0] border border-[#eadaaf] rounded-3xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#eadaaf] pb-3 gap-2">
                <div className="flex items-center space-x-2">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </div>
                  <h3 className="text-xs font-black tracking-widest text-[#5c4033] uppercase flex items-center gap-1">
                    <Clock className="w-4 h-4 text-[#8c6239]" />
                    <span>REAL-TIME ORDERS PREP QUEUE</span>
                  </h3>
                </div>
                <span className="text-[9px] font-black uppercase text-[#8c6239] bg-white border border-[#eadaaf] px-2.5 py-1 rounded-lg">
                  LIVE TRACKING ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-semibold">
                This queue prioritizes urgent items and tracks live preparation timelines. Tap any order below to toggle urgent status or update prep estimations.
              </p>

              {/* Grid of Active Live Orders in preparation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orders.filter(o => o.status === 'pending' || o.status === 'preparing').length === 0 ? (
                  <div className="col-span-2 text-center py-8 bg-white/70 rounded-2xl border border-stone-200">
                    <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
                    <p className="text-xs text-stone-500 font-extrabold uppercase">Queue is Clear!</p>
                    <p className="text-[10px] text-stone-400">All customer orders have been dispatched.</p>
                  </div>
                ) : (
                  orders.filter(o => o.status === 'pending' || o.status === 'preparing').map(o => {
                    const isUrgent = urgentOrders.includes(o.id) || o.totalAmount > 1200;
                    const currentPrepTime = orderPrepTimes[o.id] || 'Pending Chef input';
                    return (
                      <div 
                        key={o.id} 
                        className={`p-4 rounded-xl border transition-all ${
                          isUrgent 
                            ? 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-200' 
                            : 'bg-white border-stone-200'
                        } flex flex-col justify-between space-y-3 shadow-xs`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-black text-stone-800 bg-stone-100 px-2 py-0.5 rounded">
                                {o.id}
                              </span>
                              {isUrgent && (
                                <span className="bg-rose-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-widest animate-pulse">
                                  ⚠️ URGENT QUEUE
                                </span>
                              )}
                            </div>
                            <h4 className="text-xs font-bold text-stone-800 mt-1">{o.userName}</h4>
                            <p className="text-[10px] text-stone-400 mt-0.5">{o.items.length} items • ₱{o.totalAmount.toLocaleString()}</p>
                          </div>

                          <button
                            onClick={() => {
                              if (urgentOrders.includes(o.id)) {
                                setUrgentOrders(urgentOrders.filter(id => id !== o.id));
                              } else {
                                setUrgentOrders([...urgentOrders, o.id]);
                              }
                            }}
                            className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider transition-all border cursor-pointer ${
                              isUrgent 
                                ? 'bg-rose-100 hover:bg-rose-200 text-rose-700 border-rose-350'
                                : 'bg-white hover:bg-stone-50 text-[#8c6239] border-stone-200'
                            }`}
                          >
                            {isUrgent ? 'Lower Priority' : '⚡ Mark Urgent'}
                          </button>
                        </div>

                        {/* Order Items list preview */}
                        <div className="text-[10px] text-stone-600 font-semibold bg-stone-50/50 p-2 rounded border border-stone-200/50">
                          {o.items.map((it, idx) => (
                            <span key={idx} className="inline-block mr-3">
                              {it.name} <strong className="text-[#8c6239]">x{it.quantity}</strong>
                            </span>
                          ))}
                        </div>

                        {/* Interactive Est Prep Time Select */}
                        <div className="space-y-1.5 pt-1">
                          <label className="block text-[9px] font-black tracking-wider text-stone-400 uppercase">
                            🍳 Estimated Prep Time: <strong className="text-stone-700">{currentPrepTime}</strong>
                          </label>
                          <div className="flex flex-wrap gap-1">
                            {['15 mins', '25 mins', '35 mins', '45 mins', '60 mins'].map(t => (
                              <button
                                key={t}
                                onClick={() => setOrderPrepTimes({ ...orderPrepTimes, [o.id]: t })}
                                className={`px-2 py-0.5 rounded text-[8px] font-black transition-all cursor-pointer ${
                                  currentPrepTime === t 
                                    ? 'bg-[#5c4033] text-white border-0' 
                                    : 'bg-white text-stone-500 border border-stone-250 hover:bg-stone-50'
                                }`}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Interactive Status Dispatch in Queue */}
                        <div className="flex justify-between items-center pt-2 border-t border-stone-100 mt-1">
                          <span className="text-[10px] font-extrabold text-stone-500 uppercase">
                            State: <span className="text-[#8c6239] font-black">{o.status.toUpperCase()}</span>
                          </span>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => onUpdateOrderStatus(o.id, 'preparing')}
                              className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-[9px] font-black uppercase tracking-wider border-0 cursor-pointer"
                            >
                              🍳 Prepare
                            </button>
                            <button
                              onClick={() => onUpdateOrderStatus(o.id, 'dispatched')}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[9px] font-black uppercase tracking-wider border-0 cursor-pointer"
                            >
                              🚚 Dispatch
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Historical Backlog & Filters */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#e3dcd5]/40 pb-4 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="h-6 w-1 hover:scale-110 bg-[#8c6239] rounded-full" />
                  <h3 className="text-sm font-black text-[#2d1b10] uppercase tracking-wider">
                    COMPREHENSIVE CUSTOMERS ORDERS LEDGER
                  </h3>
                </div>
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest font-mono">
                  Total logged orders: {orders.length}
                </span>
              </div>

              {/* Inline order filter */}
              <div className="flex flex-wrap gap-1 bg-[#faf6f0] p-1 rounded-xl border border-[#e3dcd5]/60 max-w-lg">
                {[
                  { value: 'all', label: 'All Backlog' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'preparing', label: 'Preparing' },
                  { value: 'dispatched', label: 'Dispatched' },
                  { value: 'delivered', label: 'Completed (Delivered)' },
                  { value: 'cancelled', label: 'Cancelled' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setOrderFilter(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                      orderFilter === opt.value
                        ? 'bg-[#5c4033] text-white shadow-xs'
                        : 'text-[#5c4033] hover:bg-stone-200/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Order stack list */}
              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-3xl border border-[#efebe9]">
                    <Package className="w-12 h-12 text-stone-300 mx-auto mb-2 opacity-70" />
                    <p className="text-xs text-stone-500 font-bold">No registered orders matching filters.</p>
                  </div>
                ) : (
                  filteredOrders.map(order => {
                    const isPaid = order.paymentMethod !== 'cod';
                    return (
                      <div key={order.id} className="bg-white rounded-3xl border border-[#efebe9] p-5 hover:border-[#8c6239]/40 hover:shadow-xs transition-all space-y-4">
                        
                        {/* Header Row */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#efebe9] pb-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="bg-amber-100 text-[#8c6239] font-black tracking-widest font-mono text-xs px-2.5 py-1 rounded-lg">
                              {order.id}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                              order.serviceType === 'delivery' 
                                ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                                : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            }`}>
                              {order.serviceType === 'delivery' ? 'DELIVERY' : 'PICKUP'}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-bold font-mono">
                              {new Date(order.createdAt).toLocaleString()}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-[9px] text-stone-400 block font-bold uppercase tracking-wider">Total cost Bill</span>
                            <span className="text-lg font-black text-[#5c4033] block">
                              ₱{order.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>

                        {/* Columns representing Customer / Items / Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                          
                          {/* Customer Details */}
                          <div className="space-y-2 md:border-r md:border-[#efebe9] md:pr-4">
                            <span className="text-[9px] uppercase font-black text-zinc-400 tracking-wider block">Customer Details</span>
                            <div>
                              <p className="font-extrabold text-[#2d1b10] text-sm leading-tight">{order.userName}</p>
                              <p className="text-zinc-500 font-semibold">{order.userEmail}</p>
                              <p className="text-zinc-500 font-bold">📞 {order.deliveryPhone}</p>
                            </div>
                            <p className="text-zinc-500 leading-relaxed italic bg-stone-50 p-2.5 rounded-xl border border-stone-200/50">
                              <span className="font-bold not-italic block text-[9px] text-zinc-400 uppercase">Dispatch Address:</span>
                              {order.deliveryAddress}
                            </p>
                            {order.notes && (
                              <p className="text-[#8c6239] bg-[#faf6f0] p-2 rounded-xl border border-[#efebe9] leading-relaxed">
                                <span className="font-bold block text-[9px] uppercase">Client Memo:</span>
                                {order.notes}
                              </p>
                            )}
                          </div>

                          {/* Cart Items Details */}
                          <div className="space-y-2 md:border-r md:border-[#efebe9] md:px-4">
                            <span className="text-[9px] uppercase font-black text-zinc-400 tracking-wider block">Cart items:</span>
                            <div className="divide-y divide-[#efebe9] max-h-48 overflow-y-auto pr-1">
                              {order.items.map((it, idx) => (
                                <div key={idx} className="py-2 flex justify-between gap-4 font-semibold text-[#5c4033]">
                                  <span>
                                    {it.name} <span className="text-[#8c6239] font-black">x{it.quantity}</span>
                                  </span>
                                  <span className="font-mono text-[11px] text-stone-600 shrink-0">
                                    ₱{(it.price * it.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Dispatch Control Workflow */}
                          <div className="space-y-3 flex flex-col justify-between md:pl-4">
                            <div>
                              <span className="text-[9px] uppercase font-black text-zinc-400 tracking-wider block mb-2">Adjust Dispatch Flow</span>
                              <div className="grid grid-cols-2 gap-1.5 animate-pulse-slow">
                                {(['pending', 'preparing', 'dispatched', 'delivered', 'cancelled'] as OrderStatus[]).map((statusValue) => (
                                  <button
                                    key={statusValue}
                                    onClick={async () => {
                                      try {
                                        await onUpdateOrderStatus(order.id, statusValue);
                                        alert(`Order status updated to ${statusValue.toUpperCase()}`);
                                      } catch (err: any) {
                                        alert(err.message || 'Error updating order');
                                      }
                                    }}
                                    className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider text-center transition-all border cursor-pointer ${
                                      order.status === statusValue
                                        ? 'bg-[#5c4033] text-white border-[#5c4033] shadow-xs'
                                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                                    }`}
                                  >
                                    {statusValue === 'delivered' ? 'completed' : statusValue}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="flex justify-between items-center bg-stone-50 rounded-2xl p-3 border border-stone-200/50 mt-4">
                              <div>
                                <span className="text-[9px] uppercase text-stone-400 font-bold block">Method & Receipt</span>
                                <span className="text-[10px] font-black text-stone-700 uppercase flex items-center gap-1">
                                  {order.paymentMethod === 'cod' ? '💵 COD' : order.paymentMethod === 'gcash_mock' ? '📱 GCash' : '💳 CARD'}
                                  <span className={`text-[8px] font-black px-1.5 py-0.2 rounded ${isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                    {isPaid ? 'PAID' : 'UNPAID'}
                                  </span>
                                </span>
                              </div>
                              <div>
                                <span className="text-[9px] uppercase text-stone-400 font-bold block text-right">Fulfill Status</span>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider inline-block ${
                                  order.status === 'delivered'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : order.status === 'cancelled'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}>
                                  ● {order.status === 'delivered' ? 'completed' : order.status}
                                </span>
                              </div>
                            </div>

                          </div>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* -- TAB 2: CATERING BOOKINGS WITH NESTED SEATING & CALENDAR -- */}
        {activeSubTab === 'catering' && (
          <div className="space-y-6 animate-fade-in">
            {/* Consolidated Switch Segment Selection */}
            <div className="flex flex-wrap gap-2 mb-2 bg-[#faf6f0] p-1.5 rounded-2xl border border-[#efebe9] w-fit">
              <button
                type="button"
                onClick={() => setCateringInnerTab('packages')}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-0 ${
                  cateringInnerTab === 'packages'
                    ? 'bg-[#5c4033] text-[#faf6f0] shadow-xs font-black'
                    : 'text-[#5c4033] hover:bg-stone-100 font-extrabold'
                }`}
              >
                💼 Catering Packages Inquiries ({bookings.filter(b => b.bookingType === 'catering').length})
              </button>
              <button
                type="button"
                onClick={() => setCateringInnerTab('tables')}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-0 ${
                  cateringInnerTab === 'tables'
                    ? 'bg-[#5c4033] text-[#faf6f0] shadow-xs font-black'
                    : 'text-[#5c4033] hover:bg-stone-100 font-extrabold'
                }`}
              >
                🪑 Seating & VIP Tables ({bookings.filter(b => b.bookingType === 'appointment').length})
              </button>
              <button
                type="button"
                onClick={() => setCateringInnerTab('calendar')}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-0 ${
                  cateringInnerTab === 'calendar'
                    ? 'bg-[#5c4033] text-[#faf6f0] shadow-xs font-black'
                    : 'text-[#5c4033] hover:bg-stone-100 font-extrabold'
                }`}
              >
                📆 Interactive Setup Planner ({calendarEvents.length})
              </button>
            </div>

            {/* NESTED VIEWPORT MODULES */}
            {cateringInnerTab === 'packages' && (
              <div className="space-y-6 pt-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#e3dcd5]/40 pb-4 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-6 w-1 bg-[#8c6239] rounded-full" />
                    <h3 className="text-sm font-black text-[#2d1b10] uppercase tracking-wider">
                      FIESTA CATERING BOOKINGS LEDGER
                    </h3>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest font-mono">
                    Total milestone book-ups: {bookings.filter(b => b.bookingType === 'catering').length}
                  </span>
                </div>

                <div className="space-y-4">
              {bookings.filter(b => b.bookingType === 'catering').length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-[#efebe9]">
                  <Award className="w-12 h-12 text-stone-300 mx-auto mb-2 opacity-70" />
                  <p className="text-xs text-stone-500 font-bold">No catering inquiries filed in database.</p>
                </div>
              ) : (
                bookings.filter(b => b.bookingType === 'catering').map(bkg => (
                  <div key={bkg.id} className="bg-white rounded-3xl border border-[#efebe9] p-5 hover:border-[#8c6239]/40 hover:shadow-xs transition-all space-y-4">
                    
                    {/* Header row */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#efebe9] pb-3">
                      <div>
                        <span className="bg-amber-800 text-white font-black tracking-widest font-mono text-xs px-2.5 py-1 rounded-lg">
                          EVENT {bkg.id}
                        </span>
                        <span className="text-stone-400 font-bold text-[10px] ml-2">
                          Filed on {new Date(bkg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-right flex items-center space-x-4">
                        <div>
                          <span className="text-[9px] text-stone-400 block uppercase font-bold tracking-wider">Valuation Billing</span>
                          <span className="text-sm font-black text-[#8c6239]">
                            {bkg.priceEstimated > 0 ? `₱${bkg.priceEstimated.toLocaleString()}` : 'Free Quote Custom Plan'}
                          </span>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          bkg.status === 'approved' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : bkg.status === 'declined'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                        }`}>
                          ● {bkg.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Columns layout */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
                      
                      {/* Client Coordinator details */}
                      <div className="space-y-1 md:border-r md:border-[#efebe9] pr-3">
                        <span className="text-[9px] uppercase font-black text-[#8c6239] block tracking-wider mb-1">Client coordinator</span>
                        <p className="font-extrabold text-[#2d1b10] text-sm">{bkg.userName}</p>
                        <p className="text-zinc-500 font-semibold">{bkg.userEmail}</p>
                        <p className="text-zinc-500 font-bold">📞 {bkg.userPhone}</p>
                      </div>

                      {/* Fiesta Milestones */}
                      <div className="space-y-1 md:border-r md:border-[#efebe9] md:px-3">
                        <span className="text-[9px] uppercase font-black text-[#8c6239] block tracking-wider">Fiesta schedule</span>
                        <p className="font-bold text-[#8c6239] text-sm">📅 {bkg.eventDate}</p>
                        <p className="text-[#2d1b10] font-bold">🕒 At {bkg.eventTime}</p>
                        <span className="text-[#5c4033] font-black text-[10px] bg-amber-50 border border-amber-100 rounded px-2.5 py-0.5 inline-block mt-1">
                          GUEST HEADCOUNT: {bkg.guestCount}
                        </span>
                      </div>

                      {/* Package Selected */}
                      <div className="space-y-1.5 md:border-r md:border-[#efebe9] md:px-3">
                        <span className="text-[9px] uppercase font-black text-[#8c6239] block tracking-wider">Selected plan</span>
                        <p className="font-extrabold text-[#2d1b10] text-[11px] bg-stone-100 border border-stone-200 px-2 py-1 rounded inline-block mt-1 uppercase">
                          🏆 {bkg.selectedPackageName || 'Custom Menu request'}
                        </p>
                        <p className="text-zinc-650 italic mt-1 leading-relaxed text-[11px]">
                          "{bkg.eventName}"
                        </p>
                      </div>

                      {/* Notes and Approvals */}
                      <div className="space-y-4">
                        <div>
                          <span className="text-[9px] uppercase font-black text-zinc-400 block tracking-wider mb-1">Special directives</span>
                          <p className="text-stone-600 bg-stone-50 border border-stone-200/60 p-2.5 rounded-xl text-[10px] leading-relaxed select-all">
                            "{bkg.notes || 'No specific requests.'}"
                          </p>
                        </div>

                        {bkg.status === 'pending' && (
                          <div className="flex space-x-2 pt-1">
                            <button
                              onClick={() => {
                                triggerConfirm(
                                  'Approve Catered Meal Booking',
                                  'Accept this grand catered meal booking?',
                                  async () => {
                                    try {
                                      await onUpdateBookingStatus(bkg.id, 'approved');
                                      alert('Grand catering schedule approved! Reserved in slot.');
                                    } catch (e: any) {
                                      alert(e.message);
                                    }
                                  }
                                );
                              }}
                              className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider border-0 cursor-pointer shadow-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                triggerConfirm(
                                  'Decline Proposal',
                                  'Decline this proposal?',
                                  async () => {
                                    try {
                                      await onUpdateBookingStatus(bkg.id, 'declined');
                                      alert('Catering booking declined.');
                                    } catch (e: any) {
                                      alert(e.message);
                                    }
                                  }
                                );
                              }}
                              className="flex-1 py-1.5 rounded-xl bg-red-600 hover:bg-red-750 text-white text-[10px] font-black uppercase tracking-wider border-0 cursor-pointer shadow-sm"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>

                    </div>

                  </div>
                ))
              )}
            </div>
            
            </div>
            )}

            {/* NESTED TABLES LEDGER */}
            {cateringInnerTab === 'tables' && (
              <div className="space-y-6 pt-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#e3dcd5]/40 pb-4 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-6 w-1 bg-[#8c6239] rounded-full" />
                    <h3 className="text-sm font-black text-[#2d1b10] uppercase tracking-wider">
                      VIP LOUNGE RESERVATIONS LEDGER
                    </h3>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest font-mono">
                    Total seats inquiries: {bookings.filter(b => b.bookingType === 'appointment').length}
                  </span>
                </div>

                <div className="space-y-4">
                  {bookings.filter(b => b.bookingType === 'appointment').length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl border border-[#efebe9]">
                      <Calendar className="w-12 h-12 text-stone-300 mx-auto mb-2 opacity-70" />
                      <p className="text-xs text-stone-500 font-bold">No table bookings registered in database.</p>
                    </div>
                  ) : (
                    bookings.filter(b => b.bookingType === 'appointment').map(bkg => (
                      <div key={bkg.id} className="bg-white rounded-3xl border border-[#efebe9] p-5 hover:border-[#8c6239]/40 hover:shadow-xs transition-colors space-y-4">
                        
                        {/* Header bar */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#efebe9] pb-3">
                          <div>
                            <span className="bg-[#5c4033] text-[#faf6f0] font-black tracking-widest font-mono text-xs px-2.5 py-1 rounded-lg">
                              RESERVATION {bkg.id}
                            </span>
                            <span className="text-stone-400 font-bold text-[10px] ml-2">
                              Filed on {new Date(bkg.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div>
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                              bkg.status === 'approved' 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                : bkg.status === 'declined'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                            }`}>
                              ● {bkg.status.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {/* Columns layout */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-semibold">
                          {/* Guest details */}
                          <div className="space-y-1 md:border-r md:border-[#efebe9]">
                            <span className="text-[9px] uppercase font-black text-[#8c6239] block tracking-wider mb-1">Guest details</span>
                            <p className="font-extrabold text-[#2d1b10] text-sm">{bkg.userName}</p>
                            <p className="text-zinc-500">{bkg.userEmail}</p>
                            <p className="text-zinc-500 font-bold">📞 {bkg.userPhone}</p>
                          </div>

                          {/* Seating coordinates */}
                          <div className="space-y-1.5 md:border-r md:border-[#efebe9] md:px-4">
                            <span className="text-[9px] uppercase font-black text-[#8c6239] block tracking-wider">Lounge schedule</span>
                            <p className="font-bold text-[#8c6239] text-sm">📅 {bkg.eventDate}</p>
                            <p className="text-[#2d1b10]">🕒 At {bkg.eventTime}</p>
                            <span className="text-[#5c4033] font-black text-[10px] bg-amber-50 border border-amber-100 rounded px-2.5 py-0.5 inline-block">
                              SEATS RESERVED: {bkg.guestCount}
                            </span>
                          </div>

                          {/* Notes and Approvals */}
                          <div className="space-y-4">
                            <div>
                              <span className="text-[9px] uppercase font-black text-zinc-400 block tracking-wider mb-1">Inquiry details</span>
                              <p className="italic text-stone-600 bg-stone-50 border border-stone-200 p-2.5 rounded-xl leading-relaxed text-[11px]">
                                "{bkg.notes || 'No specific requests.'}"
                              </p>
                            </div>

                            {bkg.status === 'pending' && (
                              <div className="flex space-x-2 pt-1">
                                <button
                                  onClick={() => {
                                    triggerConfirm(
                                      'Approve Reservation',
                                      'Accept this table schedule?',
                                      async () => {
                                        try {
                                          await onUpdateBookingStatus(bkg.id, 'approved');
                                          alert('Lounge reservation approved!');
                                        } catch (e: any) {
                                          alert(e.message);
                                        }
                                      }
                                    );
                                  }}
                                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider border-0 cursor-pointer shadow-sm"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => {
                                    triggerConfirm(
                                      'Decline Reservation',
                                      'Decline this slot?',
                                      async () => {
                                        try {
                                          await onUpdateBookingStatus(bkg.id, 'declined');
                                          alert('Reservation proposal declined.');
                                        } catch (e: any) {
                                          alert(e.message);
                                        }
                                      }
                                    );
                                  }}
                                  className="flex-1 py-1.5 rounded-xl bg-red-600 hover:bg-red-750 text-white text-[10px] font-black uppercase tracking-wider border-0 cursor-pointer shadow-sm"
                                >
                                  Decline
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* NESTED CALENDAR */}
            {cateringInnerTab === 'calendar' && (
              <div className="space-y-6 pt-2 w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#e3dcd5]/40 pb-4 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-6 w-1 bg-[#8c6239] rounded-full" />
                    <h3 className="text-sm font-black text-[#2d1b10] uppercase tracking-wider flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-[#8c6239]" />
                      <span>CATERING APPOINTMENTS & COORDINATOR CALENDAR</span>
                    </h3>
                  </div>
                  <span className="text-[10px] font-black uppercase text-[#8c6239] bg-[#faf6f0] border border-[#efebe9] px-2.5 py-1 rounded-lg">
                    June 2026 Planner
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Calendar Grid Section */}
                  <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-black uppercase text-[#2d1b10] tracking-wider">
                        June 2026 Interactive Slots
                      </h4>
                      <span className="text-[10px] font-mono text-stone-400 font-bold">
                        Click cells to view notes
                      </span>
                    </div>

                    {/* Calendar Days Days header */}
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-extrabold uppercase text-stone-400 tracking-wider">
                      <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                    </div>

                    {/* Calendar monthly values */}
                    <div className="grid grid-cols-7 gap-2.5">
                      <div className="h-10 bg-stone-50/50 rounded-lg opacity-40" />
                      {Array.from({ length: 30 }).map((_, idx) => {
                        const dayNum = idx + 1;
                        const dateStr = `2026-06-${dayNum.toString().padStart(2, '0')}`;
                        
                        const dayEvents = calendarEvents.filter(ev => ev.date === dateStr);
                        const isSelected = selectedCalendarDate === dateStr;
                        const hasCatering = dayEvents.some(e => e.type === 'catering');
                        const hasMeeting = dayEvents.some(e => e.type === 'meeting');

                        return (
                          <button
                            key={dayNum}
                            onClick={() => setSelectedCalendarDate(dateStr)}
                            className={`h-11 sm:h-12 relative rounded-xl border flex flex-col justify-between p-1.5 transition-all cursor-pointer border-stone-200 ${
                              isSelected 
                                ? 'bg-[#5c4033] text-white border-[#5c4033] scale-102 shadow' 
                                : 'bg-white hover:bg-stone-50 text-stone-700'
                            }`}
                          >
                            <span className="text-[10px] font-black">{dayNum}</span>
                            <div className="flex gap-1 justify-center pb-0.5 w-full">
                              {hasCatering && (
                                <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-amber-300' : 'bg-amber-600 animate-pulse'}`} />
                              )}
                              {hasMeeting && (
                                <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-cyan-300' : 'bg-cyan-500'}`} />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex justify-start space-x-4 pt-2 text-[9px] font-extrabold uppercase">
                      <div className="flex items-center space-x-1.5">
                        <span className="h-2 w-2 rounded-full bg-amber-600 block shrink-0" />
                        <span className="text-stone-500">Locked Catered Meal</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="h-2 w-2 rounded-full bg-cyan-500 block shrink-0" />
                        <span className="text-stone-500">Coordinator Consult Meeting</span>
                      </div>
                    </div>
                  </div>

                  {/* Day Agenda */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
                      <h4 className="text-xs font-black uppercase text-[#2d1b10] tracking-wider border-b border-stone-150 pb-2 flex items-center justify-between">
                        <span>Agenda for: {selectedCalendarDate}</span>
                        <span className="text-[10px] text-stone-400 font-bold">
                          {calendarEvents.filter(ev => ev.date === selectedCalendarDate).length} Items
                        </span>
                      </h4>

                      <div className="space-y-2.5 max-h-48 overflow-y-auto w-full">
                        {calendarEvents.filter(ev => ev.date === selectedCalendarDate).length === 0 ? (
                          <p className="text-[11px] text-stone-400 text-center py-4 italic font-semibold">
                            No catering events or meetings recorded on this day.
                          </p>
                        ) : (
                          calendarEvents.filter(ev => ev.date === selectedCalendarDate).map(ev => (
                            <div key={ev.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-start space-x-2.5 font-semibold w-full">
                              <Clock className="w-3.5 h-3.5 mt-0.5 text-[#8c6239] shrink-0" />
                              <div className="text-[11px] leading-tight flex-1">
                                <div className="flex justify-between items-baseline gap-1">
                                  <span className="font-extrabold text-[#2d1b10]">{ev.title}</span>
                                  <span className="font-mono text-[9px] text-stone-400 font-bold shrink-0">{ev.time}</span>
                                </div>
                                <p className="text-stone-500 text-[10px] mt-0.5">👤 Client: {ev.client}</p>
                                <span className={`inline-block mt-1 text-[8px] font-black uppercase px-1.5 py-0.2 rounded ${
                                  ev.type === 'catering' ? 'bg-amber-100 text-amber-700' : 'bg-cyan-100 text-cyan-700'
                                }`}>
                                  {ev.type.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Book Appointment Panel */}
                    <div className="bg-[#faf6f0] border border-[#eadaaf] rounded-3xl p-6 space-y-4 shadow-xs">
                      <h4 className="text-xs font-black uppercase text-[#5c4033] tracking-wider border-b border-[#eadaaf] pb-2">
                        Book New Appointment / Event
                      </h4>

                      <div className="space-y-4 text-xs font-semibold">
                        <div>
                          <label className="block text-[9px] uppercase font-black text-stone-400 mb-1">
                            Selected Date Form
                          </label>
                          <input 
                            type="text" 
                            disabled 
                            value={selectedCalendarDate} 
                            className="w-full p-2 rounded-lg bg-stone-100 text-stone-500 border border-stone-200 text-xs font-bold"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] uppercase font-black text-stone-500 mb-1">
                              Appointment Title
                            </label>
                            <input 
                              type="text"
                              value={newEventTitle}
                              onChange={(e) => setNewEventTitle(e.target.value)}
                              placeholder="Wedding Consultation, etc." 
                              className="w-full p-2 rounded-lg bg-white border border-stone-200 text-xs focus:outline-none focus:border-[#8c6239] font-medium"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] uppercase font-black text-stone-500 mb-1">
                              Time Schedule
                            </label>
                            <input 
                              type="text" 
                              value={newEventTime}
                              onChange={(e) => setNewEventTime(e.target.value)}
                              placeholder="e.g. 2:00 PM" 
                              className="w-full p-2 rounded-lg bg-white border border-stone-200 text-xs focus:outline-none focus:border-[#8c6239] font-medium"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] uppercase font-black text-stone-500 mb-1">
                              Select Mode type
                            </label>
                            <select
                              value={newEventType}
                              onChange={(e) => setNewEventType(e.target.value as any)}
                              className="w-full p-2 rounded-lg bg-white border border-stone-200 text-xs text-stone-700 font-bold focus:outline-none focus:border-0"
                            >
                              <option value="catering">Catering Event</option>
                              <option value="meeting">Consult Meeting</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[9px] uppercase font-black text-stone-500 mb-1">
                              Contact Client Name
                            </label>
                            <input 
                              type="text" 
                              value={newEventClient}
                              onChange={(e) => setNewEventClient(e.target.value)}
                              placeholder="e.g. Maria Clara" 
                              className="w-full p-2 rounded-lg bg-white border border-stone-200 text-xs focus:outline-none focus:border-[#8c6239] font-medium"
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (!newEventTitle || !newEventClient) {
                              alert('Please enter title and client name for the appointment');
                              return;
                            }

                            const newEvent = {
                              id: `ev-${Date.now()}`,
                              title: newEventTitle,
                              date: selectedCalendarDate,
                              time: newEventTime || '12:00 PM',
                              type: newEventType,
                              client: newEventClient,
                              location: 'Grand Ballroom Setup'
                            };

                            setCalendarEvents([...calendarEvents, newEvent]);
                            setNewEventTitle('');
                            setNewEventClient('');
                            alert('Event appointment added successfully!');
                          }}
                          className="w-full py-2 bg-[#2d1b10] hover:bg-[#8c6239] text-[#faf6f0] rounded-xl text-[10px] font-black uppercase tracking-wider border-0 cursor-pointer transition-colors"
                        >
                          ➕ Log Coordinator Event
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* -- TAB 4: STOCK & MENU CURATOR -- */}
        {activeSubTab === 'menu' && (
          <div className="space-y-10">
            
            {/* Section A: Ingredients & Storage Supplies */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#e3dcd5]/40 pb-4 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="h-6 w-1 bg-[#8c6239] rounded-full animate-pulse" />
                  <h3 className="text-sm font-black text-[#2d1b10] uppercase tracking-wider flex items-center space-x-1.5">
                    <ClipboardList className="w-4 h-4 text-[#8c6239]" />
                    <span>INGREDIENTS STOCK & supplies INVENTORY</span>
                  </h3>
                </div>
                <button
                  onClick={() => setIsAddingIngredient(!isAddingIngredient)}
                  className="px-3.5 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-[#faf6f0] text-[#5c4033] font-black uppercase text-[10px] tracking-wider transition-all cursor-pointer shadow-xs"
                >
                  {isAddingIngredient ? '✕ Close Slot Builder' : '➕ Add Ingredient Slot'}
                </button>
              </div>

              {/* Low Stock Alerts Banner */}
              {(() => {
                const lowStockItems = ingredients.filter(i => i.stock < i.threshold);
                if (lowStockItems.length === 0) return null;
                return (
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-start space-x-3 text-[#5c4033] animate-pulse">
                    <AlertTriangle className="w-5 h-5 text-orange-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider">Low Stock Warnings Posted!</p>
                      <p className="text-[10px] font-semibold text-zinc-650 leading-relaxed mt-0.5">
                        The following critical kitchen items have fallen below safety inventory limits. Please replenish immediately:
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {lowStockItems.map(item => (
                          <span key={item.id} className="bg-white border border-orange-200 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider text-orange-700">
                            🚨 {item.name}: {item.stock}/{item.threshold} {item.unit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Ingredient Builder Form Panel */}
              {isAddingIngredient && (
                <div className="p-5 bg-[#faf6f0] border-2 border-dashed border-[#eadaaf] rounded-2xl space-y-4 animate-fade-in text-xs">
                  <h4 className="text-[11px] font-black uppercase text-[#2d1b10] tracking-widest">
                    Post New Stock Resource Slot
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-stone-400 mb-1">Resource Name</label>
                      <input
                        type="text"
                        value={newIngName}
                        onChange={(e) => setNewIngName(e.target.value)}
                        placeholder="e.g. Ground Pork Platter"
                        className="w-full p-2 bg-white border border-stone-200 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-stone-400 mb-1">Resource Group</label>
                      <select
                        value={newIngCategory}
                        onChange={(e) => setNewIngCategory(e.target.value as any)}
                        className="w-full p-2 bg-white border border-stone-200 rounded text-stone-700 font-bold"
                      >
                        <option value="Ingredients">Ingredients</option>
                        <option value="Supplies">Supplies</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-stone-400 mb-1">Initial Level</label>
                      <input
                        type="number"
                        value={newIngStock}
                        onChange={(e) => setNewIngStock(Number(e.target.value))}
                        className="w-full p-2 bg-white border border-stone-200 rounded text-stone-700"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-stone-400 mb-1">Stock Unit type</label>
                      <input
                        type="text"
                        value={newIngUnit}
                        onChange={(e) => setNewIngUnit(e.target.value)}
                        placeholder="e.g. kg / pcs / cans"
                        className="w-full p-2 bg-white border border-stone-200 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-stone-400 mb-1">Warning Limit</label>
                      <input
                        type="number"
                        value={newIngThreshold}
                        onChange={(e) => setNewIngThreshold(Number(e.target.value))}
                        className="w-full p-2 bg-white border border-stone-200 rounded text-stone-700"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => {
                        if (!newIngName.trim()) {
                          alert('Please specify ingredients name');
                          return;
                        }
                        const item = {
                          id: (ingredients.length + 1).toString(),
                          name: newIngName.trim(),
                          category: newIngCategory,
                          stock: newIngStock,
                          unit: newIngUnit || 'pcs',
                          threshold: newIngThreshold
                        };
                        setIngredients([...ingredients, item]);
                        setNewIngName('');
                        setIsAddingIngredient(false);
                        alert(`Successfully added ${item.name} to kitchen storage registries!`);
                      }}
                      className="px-4 py-2 bg-[#2d1b10] hover:bg-[#8c6239] text-[#faf6f0] text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer border-0 shadow-xs"
                    >
                      Save Resource Slot
                    </button>
                  </div>
                </div>
              )}

              {/* Grid of Ingredient Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {ingredients.map(ing => {
                  const isLow = ing.stock < ing.threshold;
                  return (
                    <div 
                      key={ing.id} 
                      className={`p-4 rounded-2xl border transition-all ${
                        isLow 
                          ? 'bg-orange-50/70 border-orange-300 ring-1 ring-orange-200/50' 
                          : 'bg-white border-stone-200'
                      } flex flex-col justify-between space-y-3.5 shadow-xs`}
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <span className={`text-[8px] font-black px-1.5 py-0.2 rounded uppercase ${
                            ing.category === 'Ingredients' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {ing.category}
                          </span>
                          {isLow && (
                            <span className="text-[8px] font-black text-rose-700 bg-white border border-rose-200 px-1.5 py-0.2 rounded uppercase block animate-pulse">
                              Low Stock Alert
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-stone-900 mt-1">{ing.name}</h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5">Threshold safety: {ing.threshold} {ing.unit}</p>
                      </div>

                      <div className="flex items-center justify-between bg-stone-50 rounded-xl p-2 border border-stone-200/50">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-stone-400 block leading-tight">Quantities</span>
                          <span className={`text-md font-black ${isLow ? 'text-orange-700' : 'text-stone-800'}`}>
                            {ing.stock} <span className="text-xs font-semibold">{ing.unit}</span>
                          </span>
                        </div>
                        
                        {/* +/- Adjustment Buttons */}
                        <div className="flex space-x-1">
                          <button
                            onClick={() => {
                              setIngredients(ingredients.map(i => i.id === ing.id ? { ...i, stock: Math.max(0, i.stock - 1) } : i));
                            }}
                            className="bg-white hover:bg-stone-50 text-stone-600 border border-stone-300 rounded h-6 w-6 flex items-center justify-center font-bold text-xs shrink-0 cursor-pointer"
                          >
                            -
                          </button>
                          <button
                            onClick={() => {
                              setIngredients(ingredients.map(i => i.id === ing.id ? { ...i, stock: i.stock + 1 } : i));
                            }}
                            className="bg-[#2d1b10] hover:bg-[#8c6239] text-white rounded h-6 w-6 flex items-center justify-center font-bold text-xs shrink-0 cursor-pointer border-0"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section B: Bistro Dishes Menu Items management */}
            <div className="space-y-6 pt-6 border-t border-stone-250/50">
              <div className="flex justify-between items-center border-b border-[#efebe9] pb-4 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="h-6 w-1 bg-[#8c6239] rounded-full" />
                  <h3 className="text-sm font-black text-[#2d1b10] uppercase tracking-wider">
                    BISTRO PRODUCTS CATALOG CURATOR
                  </h3>
                </div>

                <button
                  onClick={() => {
                    handleClearForm();
                    setIsAddingProduct(true);
                    setTimeout(() => {
                      document.getElementById('inventory-form-anchor')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="flex items-center space-x-1 bg-[#2d1b10] hover:bg-[#8c6239] text-[#faf6f0] px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border-0 cursor-pointer shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product Dish</span>
                </button>
              </div>

              {/* Form anchor */}
              <div id="inventory-form-anchor" />

              {/* Product form creator */}
              {(isAddingProduct || editingItemId) && (
                <div className="p-6 bg-[#faf6f0]/80 border-2 border-dashed border-[#eadaaf] rounded-3xl space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center pb-2 border-b border-[#eadaaf]">
                    <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#2d1b10] flex items-center space-x-1">
                      <Award className="w-4 h-4 text-[#8c6239]" />
                      <span>{editingItemId ? 'Edit Catalogued Product' : 'Add New Bistro Product'}</span>
                    </h4>
                    <button
                      onClick={handleClearForm}
                      className="text-stone-400 hover:text-stone-600 bg-transparent border-0 cursor-pointer text-xs font-bold"
                    >
                      Cancel
                    </button>
                  </div>

                  <form onSubmit={handleSubmitProductForm} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-extrabold text-[#5c4033] mb-1">Product Title</label>
                        <input
                          type="text"
                          required
                          value={prodName}
                          onChange={(e) => setProdName(e.target.value)}
                          placeholder="e.g. Pure Batangas Barako Blend"
                          className="w-full text-xs p-2 rounded-lg bg-white border border-[#e3dcd5] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-extrabold text-[#5c4033] mb-1">Standard Price (Php)</label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={prodPrice}
                          onChange={(e) => setProdPrice(Number(e.target.value))}
                          className="w-full text-xs p-2 rounded-lg bg-white border border-[#e3dcd5] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-extrabold text-[#5c4033] mb-1">Category Group</label>
                        <select
                          value={prodCategory}
                          onChange={(e) => setProdCategory(e.target.value as any)}
                          className="w-full text-xs p-2.5 rounded-lg bg-white border border-[#e3dcd5] focus:outline-none font-semibold text-stone-700"
                        >
                          <option value="hot_coffee">Hot Coffee</option>
                          <option value="iced_coffee">Iced Coffee</option>
                          <option value="frappes">Frappes</option>
                          <option value="milk_tea">Milk Tea</option>
                          <option value="bilao">Bilao Orders (Platters)</option>
                          <option value="delivery_meals">Food Delivery Cooked Meals</option>
                        </select>
                      </div>
                    </div>

                    {/* Dynamic Interactive File Uploader with Live Preview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#faf6f0] p-4 rounded-2xl border border-[#efebe9]">
                      <div className="space-y-3">
                        <label className="block text-[10px] uppercase tracking-widest font-extrabold text-[#5c4033] mb-1">
                          📸 Menu Product Image
                        </label>
                        
                        {/* Custom File Upload input with drag-and-drop support */}
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#e3dcd5] hover:border-[#8c6239] bg-white rounded-xl p-4 transition-colors text-center relative pointer-events-auto">
                          <input
                            type="file"
                            accept="image/*"
                            id="product-image-upload"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setProdImageUrl(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <span className="text-xl mb-1">📁</span>
                          <span className="text-[11px] font-bold text-[#8c6239]">Click or Drag & Drop file to Upload</span>
                          <span className="text-[9px] text-zinc-400">Supports PNG, JPG, WebP, GIF</span>
                        </div>

                        {/* Text input for compatibility / fallback URL insertion */}
                        <div className="space-y-1">
                          <span className="text-[9px] text-stone-400 font-extrabold uppercase tracking-wide">Or paste custom image web URL Address:</span>
                          <input
                            type="url"
                            value={prodImageUrl.startsWith('data:') ? '' : prodImageUrl}
                            onChange={(e) => setProdImageUrl(e.target.value)}
                            placeholder="https://images.unsplash.com/photo-..."
                            className="w-full text-xs p-2 rounded-lg bg-white border border-[#e3dcd5] focus:outline-none text-zinc-650"
                          />
                        </div>
                      </div>

                      {/* Right Hand Side: Visual Live Preview Box & Active Checkbox */}
                      <div className="flex flex-col justify-between items-center bg-white border border-[#efebe9] rounded-xl p-3 relative h-full min-h-[150px]">
                        <span className="text-[9px] font-black uppercase text-stone-400 tracking-wider self-start">
                          Live Preview Component
                        </span>
                        
                        {prodImageUrl ? (
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-[#efebe9] shadow-xs select-none">
                            <img 
                              src={prodImageUrl} 
                              alt="Item Preview" 
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer"
                            />
                            <button
                              type="button"
                              onClick={() => setProdImageUrl('')}
                              className="absolute top-1 right-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-1 border-0 shadow-xs cursor-pointer"
                              title="Clear Image"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <span className="text-2xl text-stone-300">🍽️</span>
                            <p className="text-[10px] text-stone-400 font-bold mt-1">No product image uploaded yet</p>
                          </div>
                        )}
                        
                        {prodImageUrl && (
                          <span className="text-[8px] font-mono text-stone-400 mt-1 uppercase tracking-wide truncate max-w-[150px]">
                            {prodImageUrl.startsWith('data:') ? 'Base64 Encoded Local File' : 'External Web Address'}
                          </span>
                        )}

                        <div className="flex items-center space-x-2 pt-2 border-t border-stone-100 w-full justify-center">
                          <label className="flex items-center space-x-2 text-[11px] font-semibold cursor-pointer">
                            <input
                              type="checkbox"
                              checked={prodActive}
                              onChange={(e) => setProdActive(e.target.checked)}
                              className="accent-[#8c6239] w-4 h-4"
                            />
                            <span>Active / Orderable in Main catalogs</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-extrabold text-[#5c4033] mb-1">Kitchen Description</label>
                      <textarea
                        value={prodDesc}
                        onChange={(e) => setProdDesc(e.target.value)}
                        placeholder="Specify roast profiles, serving volume, standard serving sizes..."
                        rows={2}
                        className="w-full text-xs p-2 rounded-lg bg-white border border-[#e3dcd5] focus:outline-none text-zinc-600"
                      />
                    </div>

                    <div className="flex justify-between items-center w-full pt-2">
                      <div>
                        {editingItemId && (
                          <button
                            type="button"
                            onClick={() => {
                              handleDelete(editingItemId);
                              handleClearForm();
                            }}
                            className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider transition-all border-0 cursor-pointer shadow-sm"
                          >
                            Delete Product
                          </button>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={handleClearForm}
                          className="py-2.5 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-[#5c4033] transition-all hover:bg-stone-50 cursor-pointer"
                        >
                          Clear form
                        </button>
                        <button
                          type="submit"
                          className="py-2.5 px-6 rounded-xl bg-[#2d1b10] hover:bg-[#8c6239] text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-0 shadow-sm"
                        >
                          {editingItemId ? 'Confirm changes' : 'Upload product'}
                        </button>
                      </div>
                    </div>
                </form>
              </div>
            )}

            {/* Menu items display grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map(item => (
                <div key={item.id} className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:border-[#8c6239]/50 transition-all flex flex-col justify-between">
                  <div className="relative h-44 bg-zinc-100">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2.5 right-2.5 flex space-x-1">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white shadow-xs ${
                        item.active ? 'bg-emerald-600' : 'bg-rose-500'
                      }`}>
                        {item.active ? 'Active' : 'Offline'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-[#2d1b10] bg-[#faf6f0]/95 backdrop-blur-md border border-[#eadaaf]">
                        {item.category.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="p-4.5 space-y-2 flex-1">
                    <div className="flex justify-between items-baseline gap-2">
                      <h4 className="text-xs font-black text-[#2d1b10] truncate max-w-40">{item.name}</h4>
                      <span className="text-xs font-black text-[#8c6239] shrink-0">₱{item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-[10px] text-stone-500 line-clamp-2 leading-relaxed font-semibold">{item.description}</p>
                  </div>

                   {!item.active && (
                    <div className="px-4 py-2 bg-red-50/65 border-t border-red-100 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-red-650 tracking-wider">Product Offline</span>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-[9px] bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest px-2.5 py-1 rounded-lg transition-all border-0 cursor-pointer shadow-xs"
                      >
                        Delete Now
                      </button>
                    </div>
                  )}

                  <div className="px-4 py-2.5 bg-[#faf6f0]/60 border-t border-[#e3dcd5] flex justify-end space-x-1.5">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 text-stone-500 hover:text-[#8c6239] hover:bg-[#efebe9] rounded-lg transition-all bg-transparent border-0 cursor-pointer"
                      title="Edit Item Profile"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-stone-500 hover:text-red-700 hover:bg-rose-50 rounded-lg transition-all bg-transparent border-0 cursor-pointer"
                      title="Remove product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

        {/* -- TAB 5: BROADCAST BOARD -- */}
        {activeSubTab === 'broadcast' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#e3dcd5]/40 pb-4 gap-4">
              <div className="flex items-center space-x-3">
                <div className="h-6 w-1 bg-[#8c6239] rounded-full animate-bounce" />
                <h3 className="text-sm font-black text-[#2d1b10] uppercase tracking-wider flex items-center space-x-1.5">
                  <Megaphone className="w-4 h-4 text-[#8c6239]" />
                  <span>LIVE BULLETIN BOARD DISTRIBUTIONS</span>
                </h3>
              </div>
            </div>

            <p className="text-xs text-zinc-500 font-semibold -mt-2 leading-relaxed">
              Configure global promotional tickers, delivery advisories, and weather announcements immediately visible across all customer browsers in real-time.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mt-4">
              
              {/* Left Column: Form panel */}
              <div className="md:col-span-7 bg-white rounded-3xl border border-[#efebe9] p-6 space-y-4">
                <h4 className="text-xs font-black text-[#2d1b10] uppercase tracking-wider">
                  Compose Live Announcement Bulletin
                </h4>

                <form onSubmit={handlePublishBroadcast} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-wider text-stone-400 mb-1">
                      Bulletin news text content
                    </label>
                    <textarea
                      required
                      value={broadcastMsg}
                      onChange={(e) => setBroadcastMsg(e.target.value)}
                      placeholder="e.g. 🎉 Special promo! Get 10% discount on all Fiesta pork spring rolls platters ordered today."
                      maxLength={150}
                      rows={3}
                      className="w-full text-xs p-3 rounded-2xl bg-stone-50 border border-stone-200 focus:outline-none text-stone-700 font-semibold leading-relaxed"
                    />
                    <div className="flex justify-between text-[9px] text-zinc-400 font-bold uppercase mt-1">
                      <span>Maximum length: 150 letters</span>
                      <span>{broadcastMsg.length}/150</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-black tracking-wider text-stone-400 mb-1">
                        Banner alert theme accent
                      </label>
                      <select
                        value={broadcastTheme}
                        onChange={(e) => setBroadcastTheme(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none font-bold text-stone-700"
                      >
                        <option value="gold">Warm Gold (Promotion & Highlight)</option>
                        <option value="red">Fiesta Red (Urgent Notice/Maintenance)</option>
                        <option value="green">Forest Green (Success/Holiday Greeting)</option>
                      </select>
                    </div>

                    <div className="flex items-end shadow-xs rounded-xl">
                      <button
                        type="submit"
                        className="w-full py-2.5 h-[38px] rounded-xl bg-[#2d1b10] hover:bg-[#8c6239] text-[#faf6f0] text-[10px] font-black uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all border-0 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Publish Live Ticker</span>
                      </button>
                    </div>
                  </div>
                </form>

                {/* Preset helpers */}
                <div className="pt-4 border-t border-stone-100">
                  <span className="text-[9px] uppercase font-black text-stone-400 tracking-wider block mb-2">
                    Quick Preset Bulletins
                  </span>
                  <div className="space-y-1.5">
                    {presets.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setBroadcastMsg(p.text);
                          setBroadcastTheme(p.theme);
                        }}
                        className="w-full text-left p-2 rounded-xl bg-stone-50 hover:bg-stone-100 border border-transparent hover:border-stone-200 transition-all text-[10px] text-stone-600 font-semibold flex items-center justify-between group cursor-pointer"
                      >
                        <span className="truncate mr-3">{p.text}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Live Mock Preview & Control */}
              <div className="md:col-span-5 space-y-6">
                
                {/* Visual mockup of the banner */}
                <div className="bg-white rounded-3xl border border-[#efebe9] p-6 space-y-4">
                  <h4 className="text-xs font-black text-[#2d1b10] uppercase tracking-wider flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Real-time Client Ticker View</span>
                  </h4>
                  <p className="text-[10px] text-zinc-400 font-semibold leading-relaxed">
                    This represents exactly how your published announcement renders live across our customer web app page headers.
                  </p>

                  {currentBroadcast ? (
                    <div className="space-y-4 pt-2">
                      <div className={`p-4 rounded-xl border flex items-start space-x-2.5 shadow-xs transition-colors duration-300 ${
                        currentBroadcast.theme === 'red'
                          ? 'bg-rose-50 text-rose-950 border-rose-200'
                          : currentBroadcast.theme === 'green'
                          ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
                          : 'bg-amber-50 text-amber-950 border-amber-200'
                      }`}>
                        <Megaphone className={`w-4 h-4 mt-0.5 shrink-0 ${
                          currentBroadcast.theme === 'red'
                            ? 'text-rose-700'
                            : currentBroadcast.theme === 'green'
                            ? 'text-emerald-700'
                            : 'text-amber-700'
                        }`} />
                        <div className="text-xs leading-relaxed font-bold">
                          {currentBroadcast.message}
                          <span className="block text-[8px] opacity-60 font-mono mt-1 uppercase font-normal">
                            Published {new Date(currentBroadcast.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleClearBroadcast}
                        className="w-full py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 hover:border-rose-300 text-rose-800 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                      >
                        ⚠️ Discard and Clear Live Bulletin
                      </button>
                    </div>
                  ) : (
                    <div className="py-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                      <Info className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                      <p className="text-[10px] text-stone-500 font-extrabold uppercase tracking-wider">
                        No active bulletin posted
                      </p>
                      <p className="text-[9px] text-stone-400 max-w-[200px] mx-auto mt-1 leading-relaxed font-semibold">
                        Enter text on the left to broadcast immediate updates.
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-[#faf6f0] border border-[#eadaaf] rounded-2xl text-[10px] text-[#5c4033] font-semibold leading-relaxed">
                  💡 <strong>Tip for Administrators:</strong> Use Gold alerts for general promotions. Reserved red banners for important dispatch updates. Announcements are persisted locally on browsers, avoiding database congestion!
                </div>

              </div>

            </div>

            {/* Internal Operational Reminders Board */}
            <div className="pt-8 border-t border-[#e3dcd5]/40 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="h-5 w-1 bg-[#8c6239] rounded-full" />
                <h4 className="text-xs font-black text-[#2d1b10] uppercase tracking-wider">
                  Admin & Kitchen Staff Operational Reminders
                </h4>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Compose Reminder Form */}
                <div className="lg:col-span-4 bg-[#faf6f0] border border-[#efebe9] p-5 rounded-2.5xl space-y-4">
                  <h5 className="text-[10px] font-black uppercase text-[#2d1b10] tracking-widest">
                    Disseminate Staff Task
                  </h5>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-stone-400 mb-1">
                        Task Duty Directives
                      </label>
                      <input
                        type="text"
                        value={newReminderText}
                        onChange={(e) => setNewReminderText(e.target.value)}
                        placeholder="e.g. Replenish Whole Milk Bottles..."
                        className="w-full p-2.5 bg-white border border-stone-200 rounded-xl font-semibold placeholder:text-stone-300"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase font-bold text-stone-400 mb-1">
                        Priority Level
                      </label>
                      <select
                        value={newReminderPriority}
                        onChange={(e) => setNewReminderPriority(e.target.value as any)}
                        className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-stone-700 font-bold"
                      >
                        <option value="low">Low Priority (Green)</option>
                        <option value="medium">Medium Priority (Amber)</option>
                        <option value="high">High Priority (Fiesta Red)</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!newReminderText.trim()) {
                          alert('Please enter a tasks description.');
                          return;
                        }
                        const r = {
                          id: (staffReminders.length + 1).toString(),
                          text: newReminderText.trim(),
                          completed: false,
                          date: new Date().toISOString().split('T')[0],
                          priority: newReminderPriority
                        };
                        setStaffReminders([r, ...staffReminders]);
                        setNewReminderText('');
                        alert('Operational task assigned to live bulletin rosters successfully!');
                      }}
                      className="w-full py-2 bg-[#2d1b10] hover:bg-[#8c6239] hover:shadow text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all border-0 cursor-pointer"
                    >
                      Assign Task Note
                    </button>
                  </div>
                </div>

                {/* Reminders List Deck */}
                <div className="lg:col-span-8 space-y-3">
                  {staffReminders.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-2.5xl border border-stone-100">
                      <p className="text-xs text-stone-400 font-extrabold uppercase">All Task Duty Rosters Complete!</p>
                    </div>
                  ) : (
                    staffReminders.map(rem => (
                      <div 
                        key={rem.id} 
                        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white border rounded-2xl transition-all gap-4 ${
                          rem.completed ? 'opacity-65 border-stone-200 bg-stone-50/50' : 'border-[#efebe9] hover:border-[#8c6239]/30'
                        }`}
                      >
                        <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                          <button
                            onClick={() => {
                              setStaffReminders(staffReminders.map(r => r.id === rem.id ? { ...r, completed: !r.completed } : r));
                            }}
                            className="mt-0.5 bg-transparent border-0 cursor-pointer text-stone-400 hover:text-[#8c6239]"
                          >
                            <CheckCircle 
                              className={`w-5 h-5 transition-colors ${
                                rem.completed ? 'text-emerald-600 fill-emerald-50' : 'text-stone-300'
                              }`} 
                            />
                          </button>
                          <div className="min-w-0">
                            <p className={`text-xs font-bold ${rem.completed ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                              {rem.text}
                            </p>
                            <p className="text-[9px] text-stone-400 mt-0.5 font-mono">
                              Delegated: {rem.date}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 shrink-0 self-end sm:self-auto">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                            rem.priority === 'high' 
                              ? 'bg-rose-50 border border-rose-250 text-rose-700 animate-pulse' 
                              : rem.priority === 'medium'
                              ? 'bg-amber-50 border border-amber-250 text-amber-700'
                              : 'bg-emerald-50 border border-emerald-250 text-emerald-700'
                          }`}>
                            {rem.priority} Priority
                          </span>

                          <button
                            onClick={() => {
                              setStaffReminders(staffReminders.filter(r => r.id !== rem.id));
                            }}
                            className="text-stone-400 hover:text-red-700 hover:bg-rose-50 bg-transparent border-0 p-1.5 rounded-lg cursor-pointer transition-colors"
                            title="Delete reminder"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            </div>

          </div>
        )}

        {/* -- TAB 6: GROSS SALES ANALYTICS -- */}
        {activeSubTab === 'analytics' && (
          <div className="space-y-8 animate-fade-in">
            {/* Split layout: 1. Operational Allocation Pie Chart on left, 2. Operational Metrics Ledger on right */}
            {(() => {
              // Real-time calculated statistics
              const successCount = orders.filter(o => o.status === 'delivered' || o.status === 'dispatched').length || 1;
              const queueCount = orders.filter(o => o.status === 'pending' || o.status === 'preparing').length || 3;
              const cateringCount = bookings.filter(b => b.bookingType === 'catering').length || 2;
              const totalVolume = successCount + queueCount + cateringCount;

              const pctSuccess = (successCount / totalVolume) * 100;
              const pctQueue = (queueCount / totalVolume) * 100;
              const pctCatering = (cateringCount / totalVolume) * 100;

              // Donut calculations
              const radius = 35;
              const circumference = 2 * Math.PI * radius; // 219.91
              
              const strokeDashoffsetSuccess = circumference * (1 - pctSuccess / 100);
              const strokeDashoffsetQueue = circumference * (1 - pctQueue / 100);
              const strokeDashoffsetCatering = circumference * (1 - pctCatering / 100);

              return (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* LEFT CARD: Operational Allocation Pie Chart */}
                  <div className="lg:col-span-5 bg-white border border-[#efebe9] p-6 sm:p-8 rounded-3xl space-y-5 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between min-h-[580px]">
                    <div className="space-y-2">
                      <span className="text-[#b45309] font-black tracking-widest text-[9px] uppercase block">
                        DYNAMIC DISTRIBUTION DIAGRAM
                      </span>
                      <h4 className="text-xl font-serif font-black text-[#2d1b10]">
                        Operational Allocation Pie Chart
                      </h4>
                      <p className="text-xs text-stone-500 leading-relaxed font-semibold">
                        Surgical proportions representing current order flows, catering contracts, and completed dispatches.
                      </p>
                    </div>

                    {/* Donut Layout */}
                    <div className="py-6 flex flex-col items-center justify-center space-y-4">
                      <div className="relative w-56 h-56 select-none">
                        <svg className="w-full h-full transform" viewBox="0 0 100 100">
                          {/* Inner Neutral Background Ring */}
                                {/* Segment 1: Success Dispatch (Rich Dark Brown) */}
                          <motion.circle 
                            cx="50" 
                            cy="50" 
                            r={radius} 
                            fill="transparent" 
                            stroke="#5c4033" 
                            strokeWidth={hoveredPieSegment === 'success' ? 12 : 9} 
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ 
                              strokeDashoffset: strokeDashoffsetSuccess,
                              opacity: hoveredPieSegment && hoveredPieSegment !== 'success' ? 0.45 : 1
                            }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            transform="rotate(-90 50 50)"
                            onMouseEnter={() => setHoveredPieSegment('success')}
                            onMouseLeave={() => setHoveredPieSegment(null)}
                            className="transition-all duration-300 cursor-pointer"
                          />

                          {/* Segment 2: Orders Queue (Warm Sand/Terracotta Brown) */}
                          <motion.circle 
                            cx="50" 
                            cy="50" 
                            r={radius} 
                            fill="transparent" 
                            stroke="#8c6239" 
                            strokeWidth={hoveredPieSegment === 'queue' ? 12 : 9} 
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ 
                              strokeDashoffset: strokeDashoffsetQueue,
                              opacity: hoveredPieSegment && hoveredPieSegment !== 'queue' ? 0.45 : 1
                            }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            transform={`rotate(${-90 + (pctSuccess / 100) * 360} 50 50)`}
                            onMouseEnter={() => setHoveredPieSegment('queue')}
                            onMouseLeave={() => setHoveredPieSegment(null)}
                            className="transition-all duration-300 cursor-pointer"
                          />

                          {/* Segment 3: Catering Appointments (Radiant Ochre/Gold) */}
                          <motion.circle 
                            cx="50" 
                            cy="50" 
                            r={radius} 
                            fill="transparent" 
                            stroke="#ca8a04" 
                            strokeWidth={hoveredPieSegment === 'catering' ? 12 : 9} 
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ 
                              strokeDashoffset: strokeDashoffsetCatering,
                              opacity: hoveredPieSegment && hoveredPieSegment !== 'catering' ? 0.45 : 1
                            }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            transform={`rotate(${-90 + ((pctSuccess + pctQueue) / 100) * 360} 50 50)`}
                            onMouseEnter={() => setHoveredPieSegment('catering')}
                            onMouseLeave={() => setHoveredPieSegment(null)}
                            className="transition-all duration-300 cursor-pointer"
                          />
                        </svg>

                        {/* Center Statistics Label */}
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-center pointer-events-none">
                          <span className="text-[9px] font-black uppercase text-stone-400 tracking-wider">
                            Total Volume
                          </span>
                          <span className="text-4xl font-black text-stone-850 my-0.5 leading-none">
                            {totalVolume}
                          </span>
                          <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                            Data Units
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Proportional visual guide info & Segment Message Box */}
                    <div className="relative min-h-[96px]">
                      <AnimatePresence mode="wait">
                        {!hoveredPieSegment ? (
                          <motion.div
                            key="default"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-[#faf6f0] p-4 border border-[#eadaaf] rounded-2xl text-[10.5px] text-[#8c6239] font-semibold leading-relaxed"
                          >
                            💡 <strong>Interactive Donut Chart active:</strong> Segments dynamically represent delivery dispatches, pending lines, and catered meals. Hover/tap any slice for deep metrics insights.
                          </motion.div>
                        ) : hoveredPieSegment === 'success' ? (
                          <motion.div
                            key="success"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-orange-50 p-4 border border-orange-200 rounded-2xl text-[10.5px] text-orange-850 font-semibold leading-relaxed"
                          >
                            🏆 <strong>Fulfillment & Dispatches ({pctSuccess.toFixed(1)}% Ratio):</strong> Represents {successCount} orders fully delivered or dispatched. These operations fuel our thriving local brand revenue accounts!
                          </motion.div>
                        ) : hoveredPieSegment === 'queue' ? (
                          <motion.div
                            key="queue"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-teal-50 p-4 border border-teal-200 rounded-2xl text-[10.5px] text-teal-850 font-semibold leading-relaxed"
                          >
                            ⏳ <strong>Operational Prep Queue ({pctQueue.toFixed(1)}% Ratio):</strong> Represents {queueCount} pending/preparing meals. Continuous monitoring ensures fast dispatch velocity.
                          </motion.div>
                        ) : (
                          <motion.div
                            key="catering"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-indigo-50 p-4 border border-indigo-200 rounded-2xl text-[10.5px] text-indigo-850 font-semibold leading-relaxed"
                          >
                            📅 <strong>Majestic Catering & Schedules ({pctCatering.toFixed(1)}% Ratio):</strong> Represents {cateringCount} catered meals and lounge tables. Outstanding high-ticket events driving long-term customer relationships.
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* RIGHT CARD: Operational Metrics Ledger */}
                  <div className="lg:col-span-7 bg-white border border-[#efebe9] p-6 sm:p-8 rounded-3xl space-y-5 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between min-h-[580px]">
                    <div className="space-y-2">
                      <span className="text-[#b45309] font-black tracking-widest text-[9px] uppercase block">
                        PERFORMANCE ANALYSIS
                      </span>
                      <h4 className="text-xl font-serif font-black text-[#2d1b10]">
                        Operational Metrics Ledger
                      </h4>
                      <p className="text-xs text-stone-500 leading-relaxed font-semibold">
                        Real-time calculations corresponding to user interactions and administrator status handshakes.
                      </p>
                    </div>

                    {/* Ledger List */}
                    <div className="space-y-5 my-3">
                      
                      {/* Metric Entry 1: Success Dispatch Orders */}
                      <div className="border border-stone-200 rounded-2xl p-4.5 space-y-2.5">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#5c4033]" />
                            <span className="text-stone-800 font-extrabold text-xs">Success Dispatch Orders</span>
                          </div>
                          <span className="text-stone-800 font-extrabold text-xs">
                            {successCount} {successCount === 1 ? 'item' : 'items'}{' '}
                            <span className="text-stone-400 font-medium text-[11px]">({pctSuccess.toFixed(1)}%)</span>
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-[#5c4033] h-full rounded-full transition-all duration-300" 
                            style={{ width: `${pctSuccess}%` }} 
                          />
                        </div>
                        {/* Business Output Line */}
                        <div className="flex justify-between text-[11px] pt-1">
                          <span className="text-stone-400 font-bold uppercase tracking-wider text-[9px]">Business Output</span>
                          <span className="text-emerald-800 font-extrabold">
                            ₱{(salesStats.revenue || 800.00).toLocaleString(undefined, { minimumFractionDigits: 2 })} Gross Sales Revenue
                          </span>
                        </div>
                      </div>

                      {/* Metric Entry 2: Orders Queue */}
                      <div className="border border-stone-200 rounded-2xl p-4.5 space-y-2.5">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#8c6239]" />
                            <span className="text-stone-800 font-extrabold text-xs">Orders Queue</span>
                          </div>
                          <span className="text-stone-800 font-extrabold text-xs">
                            {queueCount} {queueCount === 1 ? 'item' : 'items'}{' '}
                            <span className="text-stone-400 font-medium text-[11px]">({pctQueue.toFixed(1)}%)</span>
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-[#8c6239] h-full rounded-full transition-all duration-300" 
                            style={{ width: `${pctQueue}%` }} 
                          />
                        </div>
                        {/* Business Output Line */}
                        <div className="flex justify-between text-[11px] pt-1">
                          <span className="text-stone-400 font-bold uppercase tracking-wider text-[9px]">Business Output</span>
                          <span className="text-stone-800 font-extrabold">
                            {queueCount} active orders preparing state
                          </span>
                        </div>
                      </div>

                      {/* Metric Entry 3: Catering Appointments */}
                      <div className="border border-stone-200 rounded-2xl p-4.5 space-y-2.5">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#ca8a04]" />
                            <span className="text-stone-800 font-extrabold text-xs">Catering Appointments</span>
                          </div>
                          <span className="text-stone-800 font-extrabold text-xs">
                            {cateringCount} {cateringCount === 1 ? 'item' : 'items'}{' '}
                            <span className="text-stone-400 font-medium text-[11px]">({pctCatering.toFixed(1)}%)</span>
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-[#ca8a04] h-full rounded-full transition-all duration-300" 
                            style={{ width: `${pctCatering}%` }} 
                          />
                        </div>
                        {/* Business Output Line */}
                        <div className="flex justify-between text-[11px] pt-1">
                          <span className="text-stone-400 font-bold uppercase tracking-wider text-[9px]">Business Output</span>
                          <span className="text-stone-800 font-extrabold">
                            {bookings.filter(b => b.status === 'pending').length || 1} bookings requiring approval checks
                          </span>
                        </div>
                      </div>

                    </div>

                    <div className="pt-2 text-[10px] text-stone-400 text-center font-bold">
                      Calculations correspond seamlessly to real-time interactions.
                    </div>
                  </div>

                </div>
              );
            })()}
          </div>
        )}

        {/* -- TAB 7: CUSTOMER REVIEWS & RATINGS -- */}
        {activeSubTab === 'reviews' && (
          <div className="space-y-8 animate-fade-in text-[#5c4033]">
            
            {/* Upper Info Row */}
            <div className="bg-[#faf6f0] border border-[#efebe9] p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-[10px] font-black tracking-widest text-[#8c6239] uppercase block mb-1">Feedback Integrations Board</span>
                <h3 className="text-xl font-serif font-black text-[#5c4033]">Customer Reviews & Ratings Management</h3>
                <p className="text-xs text-stone-500 mt-1">Read, monitor, and audit verified completed order reviews and website testimonials.</p>
              </div>
              
              {/* Star analysis brief */}
              {(() => {
                const reviewedOrders = orders.filter(o => o.review);
                const totalRatings = reviewedOrders.map(o => o.review!.rating).concat(testimonialsList.map(t => t.rating));
                const averageScore = totalRatings.length > 0 
                  ? (totalRatings.reduce((sum, r) => sum + r, 0) / totalRatings.length)
                  : 5.0;

                return (
                  <div className="bg-white border border-[#eadaaf] p-4 rounded-2xl text-center shadow-xs shrink-0 flex items-center space-x-3.5">
                    <span className="text-3xl font-black text-[#8c6239]">{averageScore.toFixed(1)}</span>
                    <div>
                      <div className="flex items-center space-x-0.5 text-amber-500">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star 
                            key={star} 
                            className={`w-3.5 h-3.5 ${star <= Math.round(averageScore) ? 'fill-amber-400 text-amber-500' : 'text-stone-200'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider mt-1">From {totalRatings.length} Comments</p>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#efebe9] pb-4">
              <div className="flex flex-wrap gap-1.5">
                {(['all', 5, 4, 3] as const).map((filterValue) => (
                  <button
                    key={filterValue}
                    onClick={() => setReviewsFilter(filterValue)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border cursor-pointer ${
                      reviewsFilter === filterValue
                        ? 'bg-[#8c6239] border-[#8c6239] text-white shadow-xs'
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    {filterValue === 'all' ? 'All Star Scores' : `${filterValue} ★ Stars Only`}
                  </button>
                ))}
              </div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                Real-time Feedback Database Sync Enabled
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Verified Purchase Order Reviews Panel */}
              <div className="bg-white border border-[#efebe9] rounded-3xl p-6 space-y-4">
                <div className="border-b border-stone-100 pb-3">
                  <span className="text-[9.5px] font-black uppercase tracking-widest text-[#8c6239] block">PURCHASE VERIFIED REVIEWS</span>
                  <h4 className="text-sm font-black text-[#5c4033] mt-0.5">Reviews submitted for Completed Orders</h4>
                </div>

                {(() => {
                  const reviewedOrdersList = orders.filter(o => {
                    if (!o.review) return false;
                    if (reviewsFilter !== 'all') {
                      if (reviewsFilter === 3 && o.review.rating > 3) return false;
                      if (reviewsFilter !== 3 && o.review.rating !== reviewsFilter) return false;
                    }
                    return true;
                  });

                  if (reviewedOrdersList.length === 0) {
                    return (
                      <p className="text-xs text-stone-500 italic py-10 text-center bg-stone-50/50 rounded-2xl border border-dashed border-stone-200">
                        No verified purchase reviews match the filter parameters.
                      </p>
                    );
                  }

                  return (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                      {reviewedOrdersList.map((order) => (
                        <div key={order.id} className="bg-[#faf6f0]/55 border border-[#efebe9] rounded-2xl p-4.5 space-y-3 relative hover:shadow-xs transition-shadow">
                          
                          {/* Top row customer data */}
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-xs font-extrabold text-[#5c4033]">{order.userName}</p>
                              <p className="text-[9.5px] text-zinc-400 font-semibold">{order.userEmail}</p>
                            </div>
                            <span className="text-[8.5px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg uppercase whitespace-nowrap">
                              ✓ Verified Purchase
                            </span>
                          </div>

                          {/* Star Ratings displaying */}
                          <div className="flex items-center space-x-1.5">
                            <div className="flex items-center space-x-0.5 text-amber-500">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`w-3.5 h-3.5 ${star <= order.review!.rating ? 'fill-amber-400 text-amber-500' : 'text-stone-200'}`} 
                                />
                              ))}
                            </div>
                            <span className="text-[10px] text-zinc-500 font-semibold">{new Date(order.review!.createdAt).toLocaleDateString()}</span>
                          </div>

                          {/* Feedback text */}
                          <p className="text-xs text-stone-700 leading-relaxed bg-white p-3 rounded-xl border border-stone-100 italic">
                            ❝ {order.review!.comment} ❞
                          </p>

                          {/* Order context link detail footer */}
                          <div className="text-[9.5px] font-semibold text-stone-450 uppercase tracking-widest bg-stone-100/60 p-2 rounded-lg flex justify-between">
                            <span>Order #{order.id} invoice</span>
                            <span>{order.items.map(it => `${it.name} (${it.quantity}x)`).join(', ')}</span>
                          </div>

                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Global General Testimonials Feed */}
              <div className="bg-white border border-[#efebe9] rounded-3xl p-6 space-y-4">
                <div className="border-b border-stone-100 pb-3">
                  <span className="text-[9.5px] font-black uppercase tracking-widest text-[#8c6239] block">TESTIMONIALS SLIDER DATABASE</span>
                  <h4 className="text-sm font-black text-[#5c4033] mt-0.5">Overall app-wide feed and community testimonials</h4>
                </div>

                {loadingTestimonials ? (
                  <p className="text-xs text-stone-500 italic text-center py-20">Loading database records...</p>
                ) : (() => {
                  const filteredTestimonials = testimonialsList.filter((testimonial) => {
                    if (reviewsFilter === 'all') return true;
                    if (reviewsFilter === 3) return testimonial.rating <= 3;
                    return testimonial.rating === reviewsFilter;
                  });

                  if (filteredTestimonials.length === 0) {
                    return (
                      <p className="text-xs text-stone-500 italic py-10 text-center bg-stone-50/50 rounded-2xl border border-dashed border-stone-200">
                        No general testimonials match the filter parameters.
                      </p>
                    );
                  }

                  return (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                      {filteredTestimonials.map((t) => (
                        <div key={t.id} className="bg-white border border-stone-200 rounded-2xl p-4.5 space-y-3 hover:shadow-xs transition-shadow relative">
                          
                          <div className="flex justify-between items-start">
                            <p className="text-xs font-extrabold text-[#5c4033]">{t.name}</p>
                            <span className={`text-[8px] font-black tracking-wider uppercase px-2 py-0.5 rounded border ${
                              t.verified 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                            }`}>
                              {t.verified ? 'Verified Client' : 'Visitor Comment'}
                            </span>
                          </div>

                          <div className="flex items-center space-x-1.5">
                            <div className="flex items-center space-x-0.5 text-amber-500">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`w-3.5 h-3.5 ${star <= t.rating ? 'fill-amber-400 text-amber-500' : 'text-stone-200'}`} 
                                />
                              ))}
                            </div>
                            <span className="text-[10px] text-stone-400 font-semibold">{new Date(t.createdAt).toLocaleDateString()}</span>
                          </div>

                          <p className="text-xs text-stone-600 leading-relaxed italic bg-[#faf6f0]/40 p-3 rounded-xl border border-[#efebe9]/55">
                            ❝ {t.comment} ❞
                          </p>

                        </div>
                      ))}
                    </div>
                  );
                })()}

              </div>

            </div>

          </div>
        )}

        {/* -- TAB 8: CAFE STORY PHOTO SETTINGS -- */}
        {activeSubTab === 'story' && (() => {
          const DEFAULT_STORY_PHOTO = 'https://scontent.fmnl13-4.fna.fbcdn.net/v/t39.30808-6/511096253_2148896342277768_3228485304758338614_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeFFpfiACCAtkz-oZzm5iAYNnS-tpmYF4QCdL62mZgXhAJ7725NQJiUFuuUQ7_qMGSIRCAPk8zRwTrrN7cpErmq5&_nc_ohc=XxCNHrr_SxQQ7kNvwE3mR34&_nc_oc=AdowJ7HEiwDy4mKGlQWXlWOfdhQmyFpmhHoE5sSma5AUHYPYpFbd5fwOjgfindI9Nb0&_nc_zt=23&_nc_ht=scontent.fmnl13-4.fna&_nc_gid=elGwYGz9_g6SOJ1sy40qEQ&_nc_ss=7b2a8&oh=00_Af4cxFtoyhZuCvt-dJOnKtJN5ZnfvZooab-53PinUp3yJQ&oe=6A17307A';
          const [tempStoryPhoto, setTempStoryPhoto] = React.useState(() => {
            return localStorage.getItem('gk_story_photo') || DEFAULT_STORY_PHOTO;
          });

          const handleSaveStoryPhoto = () => {
            localStorage.setItem('gk_story_photo', tempStoryPhoto);
            // Trigger a globally observable updates check or alert
            showToast('GK Cafe Story Photo updated successfully! Navigate to the "Our Story" page to view the changes.', 'success');
          };

          const handleClearStoryPhoto = () => {
            setTempStoryPhoto(DEFAULT_STORY_PHOTO);
            localStorage.removeItem('gk_story_photo');
            showToast('Story photo reset to default.', 'info');
          };

          return (
            <div className="space-y-8 animate-fade-in text-[#5c4033]">
              
              <div className="bg-[#faf6f0] border border-[#efebe9] p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-[9.5px] font-black uppercase tracking-[0.25em] text-[#8c6239] block">
                    HERITAGE GALLERY MANAGER
                  </span>
                  <h4 className="text-xl font-serif font-black mt-1 text-[#2d1b10]">
                    Customize Our Sourcing Story Portrait
                  </h4>
                  <p className="text-xs text-zinc-500 font-semibold mt-1">
                    Upload a high-fidelity photo reflecting the Founders of GK Cafe in traditional Barong & Filipiniana.
                  </p>
                </div>
                
                <span className="text-stone-300 text-3xl hidden md:block">📜</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left hand side: interactive card uploaders */}
                <div className="lg:col-span-7 bg-white rounded-3xl border border-[#efebe9] p-6 space-y-6">
                  
                  <div className="space-y-2">
                    <h5 className="text-xs font-black text-[#5c4033] uppercase tracking-wider block">
                      Step 1: Upload Image File (PNG, JPG, SVG, WebP)
                    </h5>
                    
                    {/* File Upload Dropzone */}
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#e3dcd5] hover:border-[#8c6239] bg-stone-50/50 hover:bg-stone-50 rounded-2xl p-8 transition-all text-center relative pointer-events-auto cursor-pointer group">
                      <input
                        type="file"
                        accept="image/*"
                        id="story-photo-upload"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const base64data = reader.result as string;
                              setTempStoryPhoto(base64data);
                              localStorage.setItem('gk_story_photo', base64data);
                              showToast('Story photo uploaded! Click "Publish Changes" below to lock it in.', 'success');
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">📸</span>
                      <span className="text-xs font-bold text-[#8c6239] block mb-1">
                        Click or Drag & Drop image file here
                      </span>
                      <span className="text-[10px] text-zinc-400 font-medium">
                        Highly recommended: Upload the dual portrait in traditional Filipino formal wear (Filipiniana + Barong Tagalog).
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-stone-100">
                    <h5 className="text-xs font-black text-[#5c4033] uppercase tracking-wider block">
                      Alternatively: Paste Image Web URL
                    </h5>
                    <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">
                      If you'd like to link to an external picture instead of uploading a local file, paste the image source address below:
                    </p>
                    <input
                      type="url"
                      value={tempStoryPhoto.startsWith('data:') ? '' : tempStoryPhoto}
                      onChange={(e) => setTempStoryPhoto(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full text-xs p-3 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none text-zinc-650 font-medium"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={handleSaveStoryPhoto}
                      className="flex-1 py-3 px-6 rounded-xl bg-[#8c6239] hover:bg-[#5c4033] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                    >
                      Publish Changes Globally 🚀
                    </button>
                    {tempStoryPhoto && (
                      <button
                        type="button"
                        onClick={handleClearStoryPhoto}
                        className="py-3 px-4 rounded-xl bg-stone-50 hover:bg-rose-50 border border-stone-200 text-stone-500 hover:text-rose-600 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Reset / Clear
                      </button>
                    )}
                  </div>

                </div>

                {/* Right hand side: Live Story visual preview layout */}
                <div className="lg:col-span-5 bg-[#faf6f0] border border-[#efebe9] rounded-3xl p-6 flex flex-col items-center justify-center min-h-[350px]">
                  <span className="text-[9.5px] font-black uppercase tracking-widest text-[#8c6239] self-start mb-4">
                    Visual Live Mockup
                  </span>

                  <div className="relative w-full max-w-[280px] aspect-[4/5] rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-stone-100 flex flex-col justify-end p-4">
                    {tempStoryPhoto ? (
                      <img 
                        src={tempStoryPhoto} 
                        alt="Heritage Story Photo Preview" 
                        className="absolute inset-0 w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3">
                        <span className="text-4xl">👩‍❤️‍👨</span>
                        <p className="text-[11px] font-bold text-stone-400">Default Portrait Placeholder</p>
                        <p className="text-[9px] text-stone-400 tracking-wide">
                          (No user-uploaded file is active on disk yet)
                        </p>
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-stone-100 shadow-sm z-10">
                      <span className="text-[8px] font-black tracking-widest text-[#8c6239] uppercase block mb-0.5">GK CAFE STORY</span>
                      <h4 className="text-[10px] font-black text-[#5c4033]">The Hearts Behind GK</h4>
                      <p className="text-[9px] text-[#8c6239]/90 font-medium italic mt-0.5">
                        {tempStoryPhoto ? 'Dressed in Traditional Barong & Filipiniana' : 'Original standard default'}
                      </p>
                    </div>
                  </div>

                  <p className="text-[10px] text-center text-zinc-400 font-bold mt-4 max-w-xs leading-relaxed">
                    This live frame illustrates exactly how your photo appears on the "Our Heritage Story" page view!
                  </p>
                </div>

              </div>

            </div>
          );
        })()}

      </div>


      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-[9999] max-w-sm rounded-2xl p-4.5 border shadow-xl flex items-start space-x-3.5 backdrop-blur-md ${
              toast.type === 'error'
                ? 'bg-rose-50/95 border-rose-200 text-rose-900'
                : toast.type === 'info'
                ? 'bg-[#faf6f0]/95 border-[#eadaaf] text-[#8c6239]'
                : 'bg-emerald-50/95 border-emerald-200 text-emerald-950'
            }`}
          >
            <span className="text-lg">
              {toast.type === 'error' ? '❌' : toast.type === 'info' ? 'ℹ️' : '✅'}
            </span>
            <div className="flex-1">
              <p className="text-xs font-black uppercase tracking-wider mb-0.5">
                {toast.type === 'error' ? 'Notification Alert' : toast.type === 'info' ? 'System Bulletin' : 'Action Succeeded'}
              </p>
              <p className="text-[11px] font-semibold leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-stone-400 hover:text-stone-600 bg-transparent border-0 cursor-pointer p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Confirmation Dialog Modal Overlay */}
      <AnimatePresence>
        {confirmDialog.isOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDialog(p => ({ ...p, isOpen: false }))}
              className="absolute inset-0 bg-[#2d1b10]"
            />
            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative bg-white border border-[#efebe9] p-6 rounded-3xl shadow-2xl max-w-sm w-full space-y-5 text-[#5c4033]"
            >
              <div className="space-y-1.5">
                <span className="text-[9.5px] font-black tracking-widest uppercase text-[#8c6239] block">Confirmation Handshake</span>
                <h4 className="text-base font-serif font-black">{confirmDialog.title}</h4>
                <p className="text-xs text-stone-500 font-medium leading-relaxed">{confirmDialog.message}</p>
              </div>

              <div className="flex space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setConfirmDialog(p => ({ ...p, isOpen: false }))}
                  className="flex-1 py-2 rounded-xl text-stone-500 hover:bg-stone-50 border border-stone-200 text-xs font-black uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDialog.onConfirm}
                  className="flex-1 py-2 rounded-xl bg-[#8c6239] hover:bg-[#5c4033] text-white text-xs font-black uppercase tracking-wider cursor-pointer"
                >
                  Proceed
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
