/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Clock, 
  Star, 
  CheckCircle2, 
  Truck, 
  ChefHat, 
  ClipboardList, 
  MessageSquare, 
  MapPin, 
  Sparkles, 
  Phone, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  X,
  Calendar,
  Coffee,
  User,
  Shield,
  Award,
  RefreshCw,
  Gift,
  QrCode,
  Check,
  Mail
} from 'lucide-react';
import { Order, OrderStatus, Booking, BookingStatus } from '../types';

interface CustomerDashboardProps {
  orders: Order[];
  bookings?: Booking[];
  onReloadOrders: () => Promise<void>;
  onReloadBookings?: () => Promise<void>;
  setActiveTab: (tab: string) => void;
  currentUser: { id: string; name: string; email: string; phone?: string } | null;
}

export default function CustomerDashboard({
  orders,
  bookings = [],
  onReloadOrders,
  onReloadBookings,
  setActiveTab,
  currentUser
}: CustomerDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'bookings' | 'account'>('orders');
  
  // Custom owner profile picture / avatar state loading from local storage
  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    return currentUser ? localStorage.getItem(`gk_avatar_${currentUser.id}`) || '' : '';
  });

  // Review form states
  const [reviewOrderId, setReviewOrderId] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Reload states trigger
  const [isReloading, setIsReloading] = useState<boolean>(false);

  // Filter orders and bookings for the logged-in customer
  const myOrders = orders.filter(o => o.userId === currentUser?.id);
  const myBookings = bookings.filter(b => b.userId === currentUser?.id);

  // Divide orders into Active and Completed
  const activeOrders = myOrders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  const pastOrders = myOrders.filter(o => o.status === 'delivered' || o.status === 'cancelled');

  // Divide bookings into Scheduled and Past Archived
  const activeBookings = myBookings.filter(b => b.status === 'pending' || b.status === 'approved');
  const pastBookings = myBookings.filter(b => b.status === 'declined' || b.status === 'completed');

  const handleGlobalReload = async () => {
    setIsReloading(true);
    try {
      await onReloadOrders();
      if (onReloadBookings) {
        await onReloadBookings();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setIsReloading(false), 800);
    }
  };

  const getStatusStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'pending': return 0;
      case 'preparing': return 1;
      case 'dispatched': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const steps = [
    { label: 'Order Received', icon: ClipboardList, color: 'text-blue-650', bg: 'bg-blue-50', desc: 'Cafe validated your incoming request.' },
    { label: 'Preparing Food', icon: ChefHat, color: 'text-amber-655', bg: 'bg-amber-50', desc: 'Canteen chefs are cooking your meal.' },
    { label: 'Out for Delivery', icon: Truck, color: 'text-indigo-650', bg: 'bg-indigo-50', desc: 'Rider is carrying your hot feast.' },
    { label: 'Delivered', icon: CheckCircle2, color: 'text-emerald-650', bg: 'bg-emerald-50', desc: 'Package arrived at destination.' }
  ];

  const toggleExpandOrder = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const handleOpenReview = (order: Order) => {
    setReviewOrderId(order.id);
    setRating(5);
    setComment('');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const submitReview = async (orderId: string) => {
    if (!comment.trim()) {
      setErrorMsg('Please leave a comment feedback description.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const response = await fetch(`/api/orders/${orderId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.id}`
        },
        body: JSON.stringify({ rating, comment })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setSuccessMsg('Thank you! Your feedback has been posted successfully.');
      await onReloadOrders();
      setTimeout(() => {
        setReviewOrderId(null);
        setSuccessMsg('');
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error uploading feedback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Financial Loyalty Tier calculation
  const totalSpend = myOrders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const totalBookingsPlaced = myBookings.length;

  // Tier level formula
  let tierName = '☕ GK Silver Enthusiast';
  let tierColor = 'from-stone-550 to-stone-750';
  let nextTierPrice = 2500 - totalSpend;
  let tierBenefits = ['Earn points on every snack bilao order', 'Receive weekly discount bulletin notifications', 'Standard table reservation support'];

  if (totalSpend >= 5000 || totalBookingsPlaced >= 5) {
    tierName = '👑 Diamond VIP Partner';
    tierColor = 'from-[#5c4033] via-[#8c6239] to-[#2d1b10]';
    nextTierPrice = 0;
    tierBenefits = [
      'Free Unlimited Kakanin upgrades on every meal',
      'Instant reservation priorities with zero slot waiting lists',
      'Personal chef consultations for custom catering banquets',
      '15% Flat Discount across the entire GK Cafe catalog'
    ];
  } else if (totalSpend >= 2500 || totalBookingsPlaced >= 3) {
    tierName = '🌟 Gold Elite Member';
    tierColor = 'from-[#8c6239] to-[#5c4033]';
    nextTierPrice = 5000 - totalSpend;
    tierBenefits = [
      '10% off on all single-origin Batangas coffee orders',
      'Guaranteed lounge slot review under 30 minutes',
      'Exclusive early tasting of brand new recipe batches',
      'Free premium delivery upgrades on orders above ₱500'
    ];
  }

  return (
    <div id="customer-orders-dashboard" className="space-y-8 animate-fade-in max-w-5xl mx-auto px-4 py-6">
      
      {/* Dashboard Top Header Banner */}
      <div className="bg-[#faf6f0] border border-[#efebe9] p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xs relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#8c6239]/5 rounded-full -mr-10 -mt-10 pointer-events-none" />
        
        <div className="z-10">
          <span className="text-[10px] font-black tracking-widest text-[#8c6239] uppercase block mb-1 font-sans">CUSTOMER ACCOUNT GATEWAY</span>
          <h2 className="text-2xl font-serif text-[#5c4033] font-black leading-tight">Mabuhay, {currentUser?.name || "Customer"}!</h2>
          <p className="text-xs text-stone-500 mt-1.5 leading-relaxed max-w-lg font-medium">
            Monitor meals tracking, review your banquet booking packages in real-time, and check your digital VIP Loyalty Card status.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 self-stretch md:self-auto justify-between bg-white px-4 py-3 rounded-2xl border border-[#efebe9] shadow-xs">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-[#8c6239]/10 text-[#8c6239] flex items-center justify-center font-serif font-black text-lg border border-[#8c6239]/20 shadow-xs">
              {currentUser?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-black text-[#5c4033]">{currentUser?.email}</p>
              <p className="text-[10px] text-stone-400 font-bold whitespace-nowrap">{currentUser?.phone || "No phone listed"}</p>
            </div>
          </div>
          <button
            onClick={handleGlobalReload}
            disabled={isReloading}
            className="p-1.5 rounded-lg text-[#8c6239] hover:bg-stone-50 transition-colors border-0 bg-transparent cursor-pointer ml-3"
            title="Reload live feeds"
          >
            <RefreshCw className={`w-4 h-4 ${isReloading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* CORE NAVIGATION BAR */}
      <div className="border-b border-[#efebe9] flex flex-wrap gap-x-2 gap-y-2 pb-0.5">
        <button
          onClick={() => setActiveSubTab('orders')}
          className={`pb-3 text-xs tracking-wider uppercase font-black transition-all border-b-2 px-4 cursor-pointer flex items-center space-x-1.5 ${
            activeSubTab === 'orders'
              ? 'border-[#8c6239] text-[#8c6239]'
              : 'border-transparent text-stone-450 hover:text-[#5c4033]'
          }`}
        >
          <ShoppingBag className="w-4 h-4 shrink-0" />
          <span>🍔 My Food Orders ({myOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('bookings')}
          className={`pb-3 text-xs tracking-wider uppercase font-black transition-all border-b-2 px-4 cursor-pointer flex items-center space-x-1.5 ${
            activeSubTab === 'bookings'
              ? 'border-[#8c6239] text-[#8c6239]'
              : 'border-transparent text-stone-450 hover:text-[#5c4033]'
          }`}
        >
          <Calendar className="w-4 h-4 shrink-0" />
          <span>📅 Catering & Lounge Bookings ({myBookings.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('account')}
          className={`pb-3 text-xs tracking-wider uppercase font-black transition-all border-b-2 px-4 cursor-pointer flex items-center space-x-1.5 ${
            activeSubTab === 'account'
              ? 'border-[#8c6239] text-[#8c6239]'
              : 'border-transparent text-stone-450 hover:text-[#5c4033]'
          }`}
        >
          <User className="w-4 h-4 shrink-0" />
          <span>👤 My Account & Loyalty Card</span>
        </button>
      </div>

      {/* RENDER DYNAMIC LAYOUT AREA */}
      <div className="min-h-[300px]">
        {/* -- TAB: MEAL ORDERS TRACKER -- */}
        {activeSubTab === 'orders' && (
          <div className="space-y-8 animate-fade-in">
            {/* Active Orders List */}
            <div className="space-y-4">
              <h3 className="text-xs font-black tracking-widest text-[#8c6239] uppercase flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#8c6239]" />
                <span>Active Food Deliveries ({activeOrders.length})</span>
              </h3>

              {activeOrders.length === 0 ? (
                <div className="border border-dashed border-[#e3dcd5] bg-white rounded-3xl p-10 text-center space-y-4 shadow-xs">
                  <div className="w-12 h-12 bg-[#8c6239]/5 text-[#8c6239] rounded-full flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-serif font-black text-stone-650">No active orders right now.</h4>
                  <p className="text-xs text-stone-450 max-w-sm mx-auto leading-relaxed font-semibold">
                    Ready to taste GK Cafe's famous original pansit bihon, Batangas espresso, or sweet bilao kakanin combinations?
                  </p>
                  <button 
                    onClick={() => setActiveTab('menu')}
                    className="px-5 py-2.5 bg-[#8c6239] hover:bg-[#5c4033] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer border-0 shadow-sm"
                  >
                    Explore Handcrafted Menu
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {activeOrders.map((order) => {
                    const currentStepIdx = getStatusStepIndex(order.status);
                    
                    return (
                      <div key={order.id} className="bg-white border border-[#efebe9] rounded-3xl p-6 shadow-xs hover:shadow-sm transition-all relative overflow-hidden">
                        
                        {/* Decorative bar accent */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#8c6239]" />

                        {/* Order basic metadata block */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-stone-100 pb-4 mb-6">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-black text-[#8c6239] uppercase bg-[#faf6f0] px-2.5 py-1 rounded-lg border border-[#efebe9]">
                                Order ID #{order.id}
                              </span>
                              <span className="text-[10px] text-stone-400 font-bold">
                                {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs text-[#5c4033] mt-3 font-bold leading-relaxed">
                              {order.items.map(it => `${it.name} (${it.quantity}x)`).join(', ')}
                            </p>
                          </div>

                          <div className="text-right flex flex-col items-start md:items-end">
                            <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-black">Subtotal Price</p>
                            <p className="text-lg font-black text-[#5c4033]">₱{(order.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            <span className="text-[8.5px] text-[#8c6239] font-black uppercase bg-[#faf6f0] border border-[#efebe9] tracking-wider mt-1 px-2 py-0.5 rounded">
                              {order.serviceType === 'delivery' ? '🚗 DELIVERED HOME' : '🏪 COUNTER PICKUP'} - {order.paymentMethod.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {/* Order STEPPER (Real-time tracking visualizer) */}
                        <div className="py-2">
                          <p className="text-[9.5px] font-black text-stone-450 uppercase tracking-widest mb-6">LIVE CANTEEN TRACKING FEED:</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                            
                            {/* Desktop horizontal progress line */}
                            <div className="hidden md:block absolute top-[22px] left-8 right-8 h-1 bg-[#efebe9] z-0">
                              <div 
                                className="h-full bg-emerald-500 transition-all duration-700"
                                style={{ width: `${(currentStepIdx / 3) * 100}%` }}
                              />
                            </div>

                            {steps.map((step, idx) => {
                              const StepIcon = step.icon;
                              const isCompleted = idx < currentStepIdx;
                              const isActive = idx === currentStepIdx;

                              return (
                                <div key={idx} className="flex md:flex-col items-center gap-3 md:text-center z-10 relative">
                                  {/* Visual Progress Node Circle */}
                                  <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shrink-0 ${
                                    isCompleted 
                                      ? 'bg-emerald-500 text-white shadow-sm ring-4 ring-emerald-50' 
                                      : isActive 
                                      ? 'bg-[#8c6239] text-white shadow-md ring-4 ring-amber-100 animate-pulse' 
                                      : 'bg-stone-50 text-stone-300 border border-stone-200'
                                  }`}>
                                    <StepIcon className="w-5 h-5" />
                                  </div>

                                  {/* Label descriptive section */}
                                  <div>
                                    <h4 className={`text-xs font-black tracking-tight ${
                                      isCompleted 
                                        ? 'text-emerald-600' 
                                        : isActive 
                                        ? 'text-[#8c6239] font-black' 
                                        : 'text-stone-400'
                                    }`}>
                                      {step.label}
                                    </h4>
                                    <p className="text-[10px] text-zinc-400 mt-0.5 leading-snug font-bold max-w-xs md:max-w-none">
                                      {isActive ? step.desc : isCompleted ? 'Step completed.' : 'Pending queue...'}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Delivery specifications details section dropdown */}
                        <div className="mt-8 pt-4 border-t border-dashed border-[#efebe9] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div className="flex flex-col space-y-1 text-[11px] text-stone-500 font-semibold">
                            <span className="flex items-center gap-1.5 grayscale shrink-0">
                              <MapPin className="w-3.5 h-3.5 text-[#8c6239]" />
                              <span>Destination: {order.deliveryAddress}</span>
                            </span>
                            {order.deliveryPhone && (
                              <span className="flex items-center gap-1.5 grayscale shrink-0">
                                <Phone className="w-3.5 h-3.5 text-[#8c6239]" />
                                <span>Courier Contact: {order.deliveryPhone}</span>
                              </span>
                            )}
                          </div>
                          {order.notes && (
                            <div className="bg-[#faf6f0] p-2.5 rounded-xl text-[10px] italic border border-[#eadaaf] text-[#5c4033] max-w-sm">
                              ❝ {order.notes} ❞
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Past Orders Archive */}
            <div className="space-y-4 pt-4">
              <h3 className="text-xs font-black tracking-widest text-stone-500 uppercase flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#8c6239]" />
                <span>Completed Purchase Records ({pastOrders.length})</span>
              </h3>

              {pastOrders.length === 0 ? (
                <div className="bg-white border border-[#efebe9] p-8 text-center rounded-2xl text-xs text-stone-450 font-semibold shadow-xs">
                  Your delivered meals and orders will accumulate here on final fulfillment.
                </div>
              ) : (
                <div className="space-y-4">
                  {pastOrders.map((order) => {
                    const isExpanded = expandedOrderId === order.id;

                    return (
                      <div key={order.id} className="bg-white border border-[#efebe9] rounded-2xl p-4 sm:p-5 transition-all shadow-xs hover:shadow-sm">
                        
                        {/* Summary Bar */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div>
                            <div className="flex items-center space-x-2.5">
                              <span className="text-[10px] font-black text-stone-700 bg-stone-50 px-2 py-0.5 rounded border border-stone-200 uppercase">
                                Order #{order.id}
                              </span>
                              <span className={`text-[10px] font-black tracking-widest uppercase border px-2 py-0.5 rounded ${
                                order.status === 'cancelled'
                                  ? 'text-rose-650 bg-rose-50 border-rose-100'
                                  : 'text-emerald-650 bg-emerald-50 border-emerald-100'
                              }`}>
                                {order.status === 'cancelled' ? '❌ CANCELLED' : '🎉 COMPLETED'}
                              </span>
                              <span className="text-[10px] text-zinc-400 font-bold">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-xs text-[#5c4033] mt-2 font-bold truncate max-w-sm sm:max-w-lg">
                              {order.items.map(it => `${it.name} (${it.quantity}x)`).join(', ')}
                            </p>
                          </div>

                          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
                            <div className="text-left sm:text-right">
                              <span className="text-[9px] text-zinc-400 uppercase font-black block">Bill Total Amount</span>
                              <span className="text-sm font-black text-[#5c4033]">₱{(order.totalAmount).toLocaleString()}</span>
                            </div>
                            <button
                              onClick={() => toggleExpandOrder(order.id)}
                              className="bg-[#faf6f0] hover:bg-[#efebe9] p-2 rounded-xl border border-[#efebe9] cursor-pointer text-[#8c6239] transition-colors"
                              title="Toggle view details"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Expanded View with items detailed listing + ratings system */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-stone-100 space-y-4 animate-fade-in">
                            <div className="bg-[#faf6f0]/55 p-4 rounded-xl border border-[#efebe9]">
                              <p className="text-[9px] font-black uppercase tracking-wider text-[#8c6239] mb-2 font-sans">Itemized Invoice Details:</p>
                              <div className="divide-y divide-zinc-150">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="py-2 flex justify-between text-xs text-[#5c4033] font-semibold">
                                    <span>{item.name} <span className="text-[#8c6239] font-black">x{item.quantity}</span></span>
                                    <span>₱{(item.price * item.quantity).toLocaleString()}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* REVIEW & RATINGS CONTAINER */}
                            <div className="border-t border-[#e3dcd5] pt-4 mt-2">
                              {order.status === 'cancelled' ? (
                                <p className="text-[10px] text-rose-550 font-bold italic">Order was cancelled and is not eligible for reviews and ratings.</p>
                              ) : order.review ? (
                                /* Render existing customer review */
                                <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-4">
                                  <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest flex items-center">
                                      <Sparkles className="w-3.5 h-3.5 text-amber-500 mr-1 shrink-0 animate-spin-slow" />
                                      <span>Your Posted Review & Rating</span>
                                    </span>
                                    <span className="text-[9px] text-zinc-400 font-bold whitespace-nowrap">
                                      {new Date(order.review.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>

                                  <div className="flex items-center space-x-1 py-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star 
                                        key={star} 
                                        className={`w-3.5 h-3.5 ${star <= (order.review?.rating || 0) ? 'text-amber-500 fill-amber-400' : 'text-zinc-200'}`} 
                                      />
                                    ))}
                                    <span className="text-[11px] font-black text-amber-900 ml-1">{(order.review.rating)}/5 Stars</span>
                                  </div>
                                  <p className="text-xs text-stone-600 mt-2 italic capitalize leading-relaxed">
                                    ❝ {order.review.comment} ❞
                                  </p>
                                </div>
                              ) : reviewOrderId === order.id ? (
                                /* Interactive star rating selection form */
                                <div className="bg-[#faf6f0] border border-[#eadaaf] rounded-xl p-4 space-y-3 relative">
                                  
                                  <button 
                                    onClick={() => setReviewOrderId(null)}
                                    className="absolute top-3 right-3 text-stone-400 hover:text-stone-700 bg-transparent border-0 cursor-pointer p-0.5"
                                    title="Cancel"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>

                                  <h4 className="text-xs font-black uppercase text-[#8c6239] tracking-widest">Rate and Review Food Quality:</h4>
                                  
                                  {/* Star interactive selection */}
                                  <div className="flex items-center space-x-1.5 py-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(null)}
                                        className="p-1 hover:scale-110 transition-transform bg-transparent border-0 cursor-pointer"
                                        type="button"
                                      >
                                        <Star 
                                          className={`w-5 h-5 transition-colors ${
                                            star <= (hoverRating !== null ? hoverRating : rating) 
                                              ? 'text-amber-500 fill-amber-400' 
                                              : 'text-stone-300'
                                          }`} 
                                        />
                                      </button>
                                    ))}
                                    <span className="text-xs font-bold text-stone-400 ml-2">Click to choose ({rating} Stars)</span>
                                  </div>

                                  {/* Comment review box text-area */}
                                  <div className="space-y-1">
                                    <label className="block text-[9px] font-bold text-stone-500 uppercase tracking-widest">Write custom review comment here:</label>
                                    <textarea
                                      placeholder="How was the original Barako coffee or hot Bilao? Was it fresh and savory?"
                                      value={comment}
                                      onChange={(e) => setComment(e.target.value)}
                                      rows={2}
                                      className="font-sans w-full text-xs p-2.5 rounded-lg border border-[#e3dcd5] focus:outline-none focus:ring-1 focus:ring-[#8c6239] bg-white transition-all text-[#5c4033]"
                                    />
                                  </div>

                                  {errorMsg && (
                                    <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
                                      <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                      <span>{errorMsg}</span>
                                    </p>
                                  )}

                                  {successMsg && (
                                    <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                      <span>{successMsg}</span>
                                    </p>
                                  )}

                                  <div className="flex justify-end gap-2 pt-1">
                                    <button
                                      onClick={() => setReviewOrderId(null)}
                                      className="px-3.5 py-1.5 hover:bg-stone-100 text-[#5c4033] rounded-lg text-[10px] font-bold uppercase transition-all bg-transparent border border-stone-250 cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => submitReview(order.id)}
                                      disabled={isSubmitting}
                                      className="px-5 py-1.5 bg-[#8c6239] hover:bg-[#5c4033] text-white font-bold rounded-lg text-[10px] uppercase tracking-wider shadow-sm transition-all disabled:opacity-55 cursor-pointer border-0"
                                    >
                                      {isSubmitting ? 'Posting...' : 'Submit Review'}
                                    </button>
                                  </div>

                                </div>
                              ) : (
                                /* Prompt Review button call to action */
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                  <div>
                                    <p className="text-xs font-bold text-stone-600">Enjoyed the taste of GK Cafe by Primo feasts?</p>
                                    <p className="text-[10px] text-zinc-400 mt-0.5 font-bold">Leave a star rating & review comment directly to our kitchen!</p>
                                  </div>
                                  <button
                                    onClick={() => handleOpenReview(order)}
                                    className="px-4 py-2 bg-[#8c6239] hover:bg-[#5c4033] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer border-0 shadow-xs flex items-center gap-1.5"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5 text-white" />
                                    <span>Rate & Review Food</span>
                                  </button>
                                </div>
                              )}
                            </div>

                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* -- TAB: BOOKINGS & RESERVATIONS MONITOR -- */}
        {activeSubTab === 'bookings' && (
          <div className="space-y-8 animate-fade-in">
            {/* Active Bookings (Pending & Approved) */}
            <div className="space-y-4">
              <h3 className="text-xs font-black tracking-widest text-[#8c6239] uppercase flex items-center space-x-2 animate-pulse">
                <Calendar className="w-4 h-4 text-[#8c6239]" />
                <span>Scheduled Events & Lounge Reservs ({activeBookings.length})</span>
              </h3>

              {activeBookings.length === 0 ? (
                <div className="border border-dashed border-[#e3dcd5] bg-white rounded-3xl p-10 text-center space-y-4 shadow-xs">
                  <div className="w-12 h-12 bg-stone-50 text-[#8c6239] rounded-full flex items-center justify-center mx-auto border border-stone-150">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-serif font-black text-stone-650">No active reservations right now.</h4>
                  <p className="text-xs text-stone-450 max-w-sm mx-auto leading-relaxed font-semibold">
                    Have an upcoming wedding banquet, family reunion, birthday party, or cozy morning espresso meet? Reserve slot packages in seconds.
                  </p>
                  <button 
                    onClick={() => setActiveTab('catering')}
                    className="px-5 py-2.5 bg-[#8c6239] hover:bg-[#5c4033] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer border-0 shadow-sm"
                  >
                    Set Up New Reservation Account
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeBookings.map((bkg) => (
                    <div 
                      key={bkg.id}
                      className="bg-white border border-[#efebe9] rounded-3xl p-5 shadow-xs hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between"
                    >
                      {/* Left vertical visual color-coded marker depending on approved / pending */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                        bkg.status === 'approved' ? 'bg-emerald-500' : 'bg-amber-450 animate-pulse'
                      }`} />

                      <div className="space-y-4">
                        {/* Title block */}
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-stone-400">
                              RESERVATION ID #{bkg.id}
                            </span>
                            <h4 className="text-sm font-serif font-black text-[#5c4033] capitalize tracking-tight mt-0.5">
                              {bkg.eventName}
                            </h4>
                          </div>

                          <span className={`text-[8.5px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border shrink-0 ${
                            bkg.status === 'approved' 
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                              : 'bg-amber-50 border-amber-200 text-[#8c6239]'
                          }`}>
                            {bkg.status === 'approved' ? '● Verified Approved' : '⏳ Reviewing Queue'}
                          </span>
                        </div>

                        {/* Timing and details ledger */}
                        <div className="grid grid-cols-2 gap-4 bg-stone-50 p-3.5 rounded-2xl border border-stone-100 text-xs text-[#5c4033] font-bold">
                          <div>
                            <span className="text-[8px] text-zinc-400 block font-bold uppercase tracking-widest">Schedules</span>
                            <p className="text-[11px] truncate mt-0.5">{bkg.eventDate}</p>
                            <p className="text-[9.5px] text-stone-400 font-semibold">{bkg.eventTime}</p>
                          </div>
                          <div>
                            <span className="text-[8px] text-zinc-400 block font-bold uppercase tracking-widest">Booking Specifications</span>
                            <p className="text-[11px] text-[#8c6239] truncate mt-0.5">
                              {bkg.bookingType === 'catering' ? '🧁 Banquet Catering' : '☕ Lounge Resrv Space'}
                            </p>
                            <p className="text-[9.5px] text-stone-450 font-semibold">{bkg.guestCount} Headcount size</p>
                          </div>
                        </div>

                        {/* Estimates ledger */}
                        <div className="flex justify-between items-center text-xs pb-1 border-b border-dashed border-stone-100">
                          <div>
                            <span className="text-[8px] text-zinc-400 block font-bold uppercase tracking-widest">Financial Estimate</span>
                            <span className="font-serif font-black text-sm text-[#5c4033]">₱{(bkg.priceEstimated || 0).toLocaleString()}</span>
                          </div>
                          {bkg.selectedPackageName && (
                            <div className="text-right">
                              <span className="text-[8px] text-zinc-400 block font-bold uppercase tracking-widest">Curated Food Menu</span>
                              <span className="text-[10px] bg-[#faf6f0] border border-[#eadaaf] text-[#8c6239] px-2 py-0.5 rounded font-black max-w-[120px] truncate block mt-0.5">
                                {bkg.selectedPackageName}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Progress meter inside the card */}
                        <div className="space-y-1.5 pt-0.5">
                          <p className="text-[8px] font-black uppercase tracking-widest text-[#8c6239]">REAL-TIME PIPELINE PROGRESS STATS:</p>
                          <div className="flex space-x-1.5">
                            <div className="flex-1 h-1.5 rounded bg-emerald-500" title="1. Requested in ledger" />
                            <div className={`flex-1 h-1.5 rounded ${bkg.status === 'approved' ? 'bg-emerald-500' : 'bg-stone-200'}`} title="2. Verified by Chef" />
                            <div className={`flex-1 h-1.5 rounded ${bkg.status === 'approved' ? 'bg-emerald-500' : 'bg-stone-200'}`} title="3. Locked & Reserved" />
                          </div>
                        </div>
                      </div>

                      {/* Info Alert Message */}
                      <div className={`mt-4 p-3 rounded-2xl border text-[10.5px] font-bold ${
                        bkg.status === 'approved'
                          ? 'bg-emerald-50/70 border-emerald-100 text-emerald-950'
                          : 'bg-[#faf6f0] border-amber-250 text-[#8c6239] italic'
                      }`}>
                        {bkg.status === 'approved' 
                          ? '📅 Schedule locked in GK calendar! Banquet chefs assigned. Feel free to contact the administrator'
                          : '⏳ Slot requested! Management checks schedule conflicts for that calendar date portion.'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Past Finished Bookings ledger */}
            <div className="space-y-4 pt-4">
              <h3 className="text-xs font-black tracking-widest text-stone-500 uppercase flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#8c6239]" />
                <span>Finished & Archived Reservations ({pastBookings.length})</span>
              </h3>

              {pastBookings.length === 0 ? (
                <div className="bg-white border border-[#efebe9] p-7 text-center rounded-2xl text-xs text-stone-400 font-semibold shadow-xs">
                  Your finished event registries or counter proposals will be recorded here.
                </div>
              ) : (
                <div className="space-y-3">
                  {pastBookings.map((bkg) => (
                    <div key={bkg.id} className="bg-stone-50 border border-[#efebe9] p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[9px] font-mono bg-stone-200 px-1.5 py-0.5 rounded text-stone-600">
                            ID #{bkg.id}
                          </span>
                          <span className="text-xs font-bold text-stone-700 capitalize">
                            {bkg.eventName}
                          </span>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                            bkg.status === 'declined' 
                              ? 'bg-rose-50 border-rose-100 text-rose-700' 
                              : 'bg-stone-200 border-stone-300 text-stone-700'
                          }`}>
                            {bkg.status === 'declined' ? '❌ DECLINED' : '✓ COMPLETED'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5c4033] mt-1 font-bold">
                          {bkg.guestCount} pax headcount, {bkg.eventDate} ({bkg.eventTime})
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] text-stone-400 uppercase font-black block">Bill Estimated</span>
                        <span className="text-xs font-black text-stone-600">₱{(bkg.priceEstimated || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* -- TAB: CUSTOMER ACCOUNT PROFILE & LOYALTY CARD -- */}
        {activeSubTab === 'account' && (
          <div className="space-y-8 animate-fade-in">
            {/* Split Grid Profile Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Box 1: Beautiful Virtual Membership Loyalty Pass */}
              <div className="bg-gradient-to-br from-zinc-950 via-stone-900 to-[#2d1b10] p-6 rounded-3xl text-white relative flex flex-col justify-between shadow-lg min-h-[220px] overflow-hidden group select-none md:col-span-1">
                {/* Decorative golden gradients inside pass card */}
                <div className="absolute -top-10 -right-10 w-44 h-44 bg-[#8c6239]/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700" />
                
                {/* Header elements */}
                <div className="flex justify-between items-start z-10">
                  <div>
                    <span className="text-[9.5px] font-black tracking-widest text-[#eadaaf]/80 uppercase block">GK PREMIUM PASSPORT</span>
                    <h3 className="font-serif text-lg text-white font-black leading-none mt-1">GK CAFE BY PRIMO</h3>
                  </div>
                  <Coffee className="w-8 h-8 text-[#eadaaf] shrink-0 fill-[#eadaaf]/10" />
                </div>

                {/* Subtitle Loyalty level and bar */}
                <div className="z-10 mt-6 space-y-2">
                  <span className="text-[9.5px] font-black uppercase text-stone-400 tracking-wider">LOYALTY REWARDS CLASS LEVEL</span>
                  <div className="text-sm font-serif text-[#eadaaf] font-black tracking-wide flex items-center gap-1.5">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span>{tierName.replace(/[^a-zA-Z\s]/g, '').trim()}</span>
                  </div>
                  {/* Miniature loyalty meter representation */}
                  <div className="w-full h-1 bg-stone-850 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-400 to-[#eadaaf]"
                      style={{ width: `${Math.min(100, (totalSpend / 5000) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Card holder Name and Barcode ID */}
                <div className="flex justify-between items-end gap-3 z-10 mt-6 md:mt-4">
                  <div>
                    <span className="text-[8px] text-zinc-500 uppercase font-black block">PASSPORT HOLDER</span>
                    <p className="text-xs font-black text-stone-100 tracking-wide capitalize truncate max-w-[130px]">{currentUser?.name}</p>
                  </div>
                  <div className="text-right flex flex-col items-center shrink-0">
                    {avatarUrl ? (
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#eadaaf]/60 shadow-md mb-0.5">
                        <img 
                          src={avatarUrl} 
                          alt="Passport ID" 
                          className="w-full h-full object-cover animate-fade-in"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <QrCode className="w-8 h-8 text-white opacity-80 animate-fade-in" />
                    )}
                    <span className="text-[7.5px] font-mono text-stone-400 mt-1 uppercase">MEMBER: {currentUser?.id?.substring(0, 8)}</span>
                  </div>
                </div>
              </div>

              {/* Box 2: Profile statistics and registries summary */}
              <div className="bg-white border border-[#efebe9] p-6 rounded-3xl shadow-xs space-y-5 md:col-span-2 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-black tracking-widest text-[#8c6239] uppercase">
                    🔒 Verified Registries & Profile Ledger
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">Maintain accuracy to secure quick reservation notifications and dispatches.</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100 flex items-center space-x-3">
                      <User className="w-5 h-5 text-[#8c6239] shrink-0 font-black" />
                      <div>
                        <span className="text-[8.5px] text-stone-400 block font-bold uppercase tracking-wider">Account Full Name</span>
                        <p className="text-xs font-black text-[#5c4033] capitalize">{currentUser?.name}</p>
                      </div>
                    </div>

                    <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100 flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-[#8c6239] shrink-0" />
                      <div className="overflow-hidden">
                        <span className="text-[8.5px] text-stone-400 block font-bold uppercase tracking-wider">Contact Communication</span>
                        <p className="text-xs font-black text-[#5c4033] truncate">{currentUser?.email}</p>
                      </div>
                    </div>

                    <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100 flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-[#8c6239] shrink-0" />
                      <div>
                        <span className="text-[8.5px] text-stone-400 block font-bold uppercase tracking-wider">Phone Verification</span>
                        <p className="text-xs font-black text-[#5c4033]">{currentUser?.phone || "None configured"}</p>
                      </div>
                    </div>

                    <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100 flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <span className="text-[8.5px] text-stone-400 block font-bold uppercase tracking-wider">Security Access Level</span>
                        <p className="text-xs font-black text-emerald-700 capitalize">Verified Customer Profile</p>
                      </div>
                    </div>
                  </div>

                  {/* Photo Profile Uploader */}
                  <div className="p-4 bg-stone-50/50 border border-stone-150 rounded-2xl flex flex-col sm:flex-row items-center gap-4 mt-5">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#8c6239]/20 bg-stone-100 shrink-0 relative flex items-center justify-center">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#8c6239] bg-[#8c6239]/5 text-xs font-black uppercase">
                          {currentUser?.name?.substring(0, 2) || "GK"}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-0.5 text-center sm:text-left">
                      <h4 className="text-xs font-black text-[#5c4033] uppercase tracking-wide">Identity Passport Photo</h4>
                      <p className="text-[10px] text-stone-500 font-semibold">Upload your picture to customize your GK Premium Passport membership pass.</p>
                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1.5">
                        <label className="cursor-pointer px-3 py-1 bg-[#8c6239] hover:bg-[#5c4033] text-white text-[9.5px] font-black uppercase tracking-wider rounded-lg transition-colors shadow-xs">
                          Upload Image File
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  const baseURL = reader.result as string;
                                  setAvatarUrl(baseURL);
                                  if (currentUser) {
                                    localStorage.setItem(`gk_avatar_${currentUser.id}`, baseURL);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                        {avatarUrl && (
                          <button
                            onClick={() => {
                              setAvatarUrl('');
                              if (currentUser) {
                                localStorage.removeItem(`gk_avatar_${currentUser.id}`);
                              }
                            }}
                            className="px-3 py-1 bg-white border border-stone-200 text-stone-500 hover:bg-stone-50 text-[9.5px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50/50 border border-amber-100/70 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[8.5px] text-[#8c6239] font-black uppercase tracking-wider block">VIP Loyalty Tier Perks Status</span>
                    <p className="text-xs text-[#5c4033] font-serif font-extrabold">{tierName}</p>
                  </div>
                  {nextTierPrice > 0 ? (
                    <span className="text-[10px] bg-white text-stone-500 border border-stone-200 px-3 py-1.5 rounded-xl font-semibold prose max-w-[200px] leading-tight text-center sm:text-right">
                      Spend <strong>₱{nextTierPrice}</strong> more to unlock elite rewards tiers!
                    </span>
                  ) : (
                    <span className="text-[10px] bg-[#faf6f0] text-[#8c6239] border border-[#eadaaf] px-3 py-1.5 rounded-xl font-black uppercase tracking-wide">
                      ⚡ Max Loyalty Perks Unlocked
                    </span>
                  )}
                </div>
              </div>

            </div>

            {/* Loyalty Tier Perks Ledger Card */}
            <div className="bg-stone-50 border border-[#efebe9] p-6 rounded-3xl space-y-4">
              <div className="flex items-center space-x-2">
                <Gift className="w-5 h-5 text-[#8c6239]" />
                <h4 className="text-sm font-serif font-black text-[#5c4033] tracking-tight">
                  Premium Tier Privileges & Active Perks Benefits
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {tierBenefits.map((benefit, idx) => (
                  <div key={idx} className="bg-white border border-[#efebe9] p-3 rounded-2xl flex items-start space-x-3.5 shadow-5xs">
                    <div className="w-5 h-5 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0 border border-emerald-100 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-stone-600 leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
