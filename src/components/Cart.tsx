/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus, CreditCard, Sparkles, MapPin, Phone, MessageSquare } from 'lucide-react';
import { CartItem, ServiceType, PaymentMethod } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (menuItemId: string, delta: number) => void;
  onRemoveItem: (menuItemId: string) => void;
  onCheckout: (details: {
    serviceType: ServiceType;
    deliveryAddress: string;
    deliveryPhone: string;
    paymentMethod: PaymentMethod;
    notes: string;
  }) => Promise<void>;
  currentUser: any;
  onOpenAuth: () => void;
}

export default function Cart({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  currentUser,
  onOpenAuth
}: CartProps) {
  const [serviceType, setServiceType] = useState<ServiceType>('pickup');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMockPaymentGateway, setShowMockPaymentGateway] = useState(false);

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = serviceType === 'delivery' ? 50 : 0;
  const grandTotal = totalAmount + deliveryFee;

  const handleSubmitCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    if (serviceType === 'delivery' && (!address.trim() || !phone.trim())) {
      alert('Please specify delivery address and a valid contact phone number.');
      return;
    }

    setIsSubmitting(true);
    
    if (paymentMethod !== 'cod') {
      // Show simulated modern gateway
      setShowMockPaymentGateway(true);
      setIsSubmitting(false);
      return;
    }

    try {
      await onCheckout({
        serviceType,
        deliveryAddress: serviceType === 'delivery' ? address : 'In-Store Pickup',
        deliveryPhone: phone,
        paymentMethod,
        notes
      });
      // reset states
      setAddress('');
      setNotes('');
      onClose();
    } catch (err: any) {
      alert(err.message || 'Checkout failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmMockGateway = async () => {
    setIsSubmitting(true);
    setShowMockPaymentGateway(false);
    try {
      await onCheckout({
        serviceType,
        deliveryAddress: serviceType === 'delivery' ? address : 'In-Store Pickup',
        deliveryPhone: phone,
        paymentMethod,
        notes
      });
      setAddress('');
      setNotes('');
      onClose();
    } catch (err: any) {
      alert(err.message || 'Payment authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      {/* Background backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md transform transition-all duration-300 ease-out bg-white shadow-2xl flex flex-col h-full border-l border-[#e3dcd5]">
          
          {/* Cart Header */}
          <div className="px-6 py-5 border-b border-[#e3dcd5] flex items-center justify-between bg-[#faf6f0]">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#8c6239]" />
              <h2 className="text-base font-bold uppercase tracking-wider text-[#2d1b10]">
                Your Order Basket
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-zinc-400 hover:text-zinc-600 hover:bg-[#efebe9]/50 transition-colors bg-transparent border-0 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-[#faf6f0] text-[#c4a484] rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-base font-bold text-[#2d1b10]">Your basket is empty</p>
                  <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
                    Fill it with some of GK Cafe by Primo's artisan hot coffee or fiesta Filipino Bilao trays!
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-xl bg-[#2d1b10] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#4a3224]"
                >
                  Start Ordering
                </button>
              </div>
            ) : (
              <>
                {/* List of Cart Items */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Selected Items</h3>
                  <div className="divide-y divide-[#e3dcd5]">
                    {cartItems.map((item) => (
                      <div key={item.id} className="py-3 flex space-x-3 items-center">
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="w-14 h-14 object-cover rounded-lg bg-stone-100"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-extrabold text-[#2d1b10] truncate">{item.name}</p>
                          <p className="text-xs text-[#8c6239] font-semibold mt-0.5">₱{item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center space-x-2.5">
                          <div className="flex items-center space-x-1 bg-[#faf6f0] border border-[#e3dcd5] rounded-lg p-1">
                            <button
                              onClick={() => onUpdateQuantity(item.menuItemId, -1)}
                              className="p-1 text-stone-600 hover:text-stone-900 hover:bg-[#efebe9] rounded bg-transparent border-0 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-extrabold px-1 text-stone-850">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.menuItemId, 1)}
                              className="p-1 text-stone-600 hover:text-stone-900 hover:bg-[#efebe9] rounded bg-transparent border-0 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => onRemoveItem(item.menuItemId)}
                            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors bg-transparent border-0 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Checkout Customization Form */}
                <form id="checkout-details-form" onSubmit={handleSubmitCheckout} className="space-y-4 pt-4 border-t border-[#e3dcd5]">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Order Service Preferences</h3>
                  
                  {/* Service type selection */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setServiceType('pickup')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold tracking-wider uppercase border transition-all cursor-pointer ${
                        serviceType === 'pickup'
                          ? 'bg-[#2d1b10] text-white border-[#2d1b10] shadow-xs'
                          : 'bg-white text-stone-600 border-[#efebe9] hover:bg-zinc-50'
                      }`}
                    >
                      In-Store Pickup
                    </button>
                    <button
                      type="button"
                      onClick={() => setServiceType('delivery')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold tracking-wider uppercase border transition-all cursor-pointer ${
                        serviceType === 'delivery'
                          ? 'bg-[#2d1b10] text-white border-[#2d1b10] shadow-xs'
                          : 'bg-white text-stone-600 border-[#efebe9] hover:bg-zinc-50'
                      }`}
                    >
                      Home Delivery (+₱50)
                    </button>
                  </div>

                  {/* Delivery Specifics */}
                  {serviceType === 'delivery' && (
                    <div className="space-y-3 animate-fade-in">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-[#8c6239]" />
                          <span>Complete Delivery Address *</span>
                        </label>
                        <textarea
                          placeholder="Appartment/Suite, Street address, Barangay, City, Landmark guidelines..."
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          required
                          rows={2}
                          className="w-full text-xs p-2.5 rounded-lg border border-[#e3dcd5] focus:outline-none focus:ring-1 focus:ring-[#8c6239] transition-all bg-[#faf6f0]/50"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 flex items-center space-x-1">
                          <Phone className="w-3.5 h-3.5 text-[#8c6239]" />
                          <span>Delivery Mobile Phone Number *</span>
                        </label>
                        <input
                          type="tel"
                          placeholder="+63 9xx xxx xxxx"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          className="w-full text-xs p-2.5 rounded-lg border border-[#e3dcd5] focus:outline-none focus:ring-1 focus:ring-[#8c6239] transition-all bg-[#faf6f0]/50"
                        />
                      </div>
                    </div>
                  )}

                  {/* Payment Methods */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest flex items-center space-x-1">
                      <CreditCard className="w-3.5 h-3.5 text-[#8c6239]" />
                      <span>Payment Gateway Selection</span>
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cod')}
                        className={`py-2 px-1 rounded-sm text-[10px] font-bold uppercase transition-all ${
                          paymentMethod === 'cod'
                            ? 'bg-[#8c6239] text-white'
                            : 'bg-[#faf6f0] text-stone-600 border border-[#efebe9]'
                        }`}
                      >
                        Cash on Del.
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('gcash_mock')}
                        className={`py-2 px-1 rounded-sm text-[10px] font-bold uppercase transition-all ${
                          paymentMethod === 'gcash_mock'
                            ? 'bg-[#8c6239] text-white'
                            : 'bg-[#faf6f0] text-[#0064f0]/80 border border-[#efebe9]'
                        }`}
                      >
                        GCash Mock
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card_mock')}
                        className={`py-2 px-1 rounded-sm text-[10px] font-bold uppercase transition-all ${
                          paymentMethod === 'card_mock'
                            ? 'bg-[#8c6239] text-white'
                            : 'bg-[#faf6f0] text-[#e00814]/80 border border-[#efebe9]'
                        }`}
                      >
                        Card Mock
                      </button>
                    </div>
                  </div>

                  {/* Notes & Customizations */}
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 flex items-center space-x-1">
                      <MessageSquare className="w-3.5 h-3.5 text-[#8c6239]" />
                      <span>Barista Guide & Kitchen Notes</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Extra syrup, no sugar, deliver on peak hours, etc."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#e3dcd5] focus:outline-none focus:ring-1 focus:ring-[#8c6239] transition-all bg-[#faf6f0]/50"
                    />
                  </div>

                  {currentUser ? (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-4 py-3.5 rounded-xl bg-[#2d1b10] text-white text-xs font-black tracking-widest uppercase hover:bg-[#5c4033] transition-all shadow-xs disabled:opacity-60 cursor-pointer"
                    >
                      {isSubmitting ? 'PROCESSING REQUEST...' : `PLACE SECURE ORDER • ₱${grandTotal.toFixed(2)}`}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={onOpenAuth}
                      className="w-full mt-4 py-3.5 rounded-xl bg-[#8c6239] text-white text-xs font-black tracking-widest uppercase hover:bg-[#5c4033] transition-all cursor-pointer"
                    >
                      LOGIN TO CHECKOUT
                    </button>
                  )}
                </form>
              </>
            )}
          </div>

          {/* Persistent Order Summary footer */}
          {cartItems.length > 0 && (
            <div className="bg-[#faf6f0] p-6 border-t border-[#e3dcd5] space-y-2">
              <div className="flex justify-between text-xs text-stone-600">
                <span>Basket Subtotal</span>
                <span>₱{totalAmount.toFixed(2)}</span>
              </div>
              {serviceType === 'delivery' && (
                <div className="flex justify-between text-xs text-stone-600">
                  <span>Custom Delivery Dispatch</span>
                  <span>₱50.00</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-[#2d1b10] pt-2 border-t border-[#e3dcd5]/70">
                <span>Grand Total Due</span>
                <span>₱{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          )}

        </div>
      </div>

       {/* Simulated 3D Premium Mock Gateway Overlay */}
      {showMockPaymentGateway && (
        <div className="fixed inset-0 z-55 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-6 border border-[#e3dcd5] shadow-2xl relative">
            <button
              onClick={() => setShowMockPaymentGateway(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 bg-transparent border-0 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-[#8c6239]">
              <Sparkles className="w-8 h-8 animate-spin" />
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-serif italic text-[#2d1b10]">GK Primo Secure Gateway</h4>
              <p className="text-xs text-zinc-500">
                You selected <span className="font-bold text-[#8c6239]">{paymentMethod === 'gcash_mock' ? 'GCash' : 'Credit Card'}</span> to settle your basket value of <span className="font-bold text-[#2d1b10]">₱{grandTotal.toFixed(2)}</span>. This is a fully functional simulation.
              </p>
            </div>

            {paymentMethod === 'gcash_mock' ? (
              <div className="p-5 bg-gradient-to-b from-[#005bf0] to-[#004dc9] text-white rounded-2xl flex flex-col items-center space-y-3 shadow-md relative overflow-hidden">
                {/* GCASH branding support */}
                <div className="absolute top-0 inset-x-0 h-1 bg-[#47cbf2]"></div>
                <div className="flex items-center space-x-1 justify-center z-10">
                  <span className="text-sm font-black italic tracking-tighter">G) GCash</span>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest text-[#47cbf2] border border-[#47cbf2]/30">Scan to Pay</span>
                </div>
                
                {/* Dynamic high quality QR generated from reliable public API */}
                <div className="w-44 h-44 bg-white p-2.5 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&color=005bf0&data=https://gk-cafe-by-primo.com/pay/gcash?amount=${grandTotal}`}
                    alt="GCash Play scan to pay Order qr"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-center space-y-0.5">
                  <p className="text-[13px] font-black text-white">Settle: ₱{grandTotal.toFixed(2)}</p>
                  <p className="text-[9px] text-[#47cbf2] font-semibold uppercase tracking-wider">Scan with GCash app</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2 text-left bg-stone-50 p-4 rounded-xl border border-stone-200">
                  <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Premium Card Details</p>
                  <div className="h-6 w-full bg-stone-200 animate-pulse rounded-xs" />
                  <div className="flex justify-between text-[11px] font-mono text-stone-500">
                    <span>**** **** **** 8847</span>
                    <span>Exp: 08/29</span>
                  </div>
                </div>
                
                {/* maya / generic QR PH scan-to-pay fallback optionally indicated */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-150 flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-stone-700 uppercase tracking-widest">QR PH (Scan to Pay)</p>
                    <p className="text-[9px] text-zinc-500">Alternatively scanner with any bank app</p>
                  </div>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://gk-cafe-by-primo.com/pay/qrph?amount=${grandTotal}`}
                    alt="QR PH pay order"
                    className="w-10 h-10 object-contain rounded border border-stone-200"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            )}

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setShowMockPaymentGateway(false)}
                className="flex-1 py-2.5 rounded-lg border border-[#e3dcd5] bg-white text-xs font-bold text-stone-600 hover:bg-[#faf6f0] cursor-pointer"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirmMockGateway}
                className="flex-1 py-2.5 rounded-lg bg-[#2d1b10] text-white text-xs font-bold hover:bg-[#8c6239] cursor-pointer border-0"
              >
                Authorize ₱{grandTotal.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
