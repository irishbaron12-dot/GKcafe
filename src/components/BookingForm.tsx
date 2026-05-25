/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, User, Users, ShieldAlert, Sparkles, Clock, MapPin, Tag } from 'lucide-react';
import { BookingType, MenuItem } from '../types';

interface BookingFormProps {
  cateringPackages: MenuItem[];
  onSubmitBooking: (details: {
    bookingType: BookingType;
    eventName: string;
    eventDate: string;
    eventTime: string;
    guestCount: number;
    selectedPackageId?: string;
    selectedPackageName?: string;
    notes?: string;
    userPhone: string;
  }) => Promise<void>;
  currentUser: any;
  onOpenAuth: () => void;
}

export default function BookingForm({
  cateringPackages,
  onSubmitBooking,
  currentUser,
  onOpenAuth
}: BookingFormProps) {
  const [bookingType] = useState<BookingType>('catering');
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('11:00');
  const [guestCount, setGuestCount] = useState(30);
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [userPhone, setUserPhone] = useState(currentUser?.phone || '');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Pick package details
  selectedPackageId; // avoid unused warning

  const currentPackage = cateringPackages.find(p => p.id === selectedPackageId);
  const ratePerHead = currentPackage ? currentPackage.price : 500;
  const estimatedTotal = bookingType === 'catering' ? ratePerHead * guestCount : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!currentUser) {
      onOpenAuth();
      return;
    }

    if (!eventName.trim() || !eventDate || !eventTime || !userPhone.trim()) {
      setMessage({ type: 'error', text: 'Please fill out all required details.' });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitBooking({
        bookingType,
        eventName: eventName.trim(),
        eventDate,
        eventTime,
        guestCount,
        selectedPackageId: undefined,
        selectedPackageName: undefined,
        notes: notes.trim(),
        userPhone: userPhone.trim()
      });

      setMessage({
        type: 'success',
        text: `🎉 Request submitted successfully! Reservation code assigned. Our food preparation department will contact you at ${userPhone} to confirm your order details and provide a custom quotation.`
      });

      // Clear fields
      setEventName('');
      setNotes('');
      setSelectedPackageId('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error scheduling food preparation.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#e3dcd5] shadow-xs overflow-hidden">
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        {/* Status feedbacks */}
        {message && (
          <div className={`p-4 rounded-xl text-xs font-semibold ${
            message.type === 'success' 
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Booking Title / Event Name */}
          <div>
            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 flex items-center space-x-1">
              <Tag className="w-3.5 h-3.5 text-[#8c6239]" />
              <span>Event / Occasion Name *</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Reyes Family Reunion Banquet"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
              className="w-full text-xs p-2.5 rounded-lg border border-[#e3dcd5] focus:outline-none focus:ring-1 focus:ring-[#8c6239] transition-all bg-[#faf6f0]/30"
            />
          </div>

          {/* Contact phone number */}
          <div>
            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 flex items-center space-x-1">
              <Users className="w-3.5 h-3.5 text-[#8c6239]" />
              <span>Primary Phone Number for Call-Back *</span>
            </label>
            <input
              type="tel"
              placeholder="+63 9xx xxx xxxx"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              required
              className="w-full text-xs p-2.5 rounded-lg border border-[#e3dcd5] focus:outline-none focus:ring-1 focus:ring-[#8c6239] transition-all bg-[#faf6f0]/30"
            />
          </div>

          {/* Date Selector */}
          <div>
            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-[#8c6239]" />
              <span>Proposed Calendar Date *</span>
            </label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full text-xs p-2.5 rounded-lg border border-[#e3dcd5] focus:outline-none focus:ring-1 focus:ring-[#8c6239] transition-all bg-[#faf6f0]/30"
            />
          </div>

          {/* Timing Slot selection */}
          <div>
            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-[#8c6239]" />
              <span>Execution / Setup Start Time *</span>
            </label>
            <select
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              required
              className="w-full text-xs p-2.5 rounded-lg border border-[#e3dcd5] focus:outline-none focus:ring-1 focus:ring-[#8c6239] transition-all bg-[#faf6f0]/30"
            >
              <option value="08:00">08:00 AM — Morning Brunch Setup</option>
              <option value="11:00">11:00 AM — Elite Lunch Banquet</option>
              <option value="14:00">02:00 PM — Midday Seminars</option>
              <option value="18:00">06:00 PM — Evening Gala Buffet</option>
              <option value="20:00">08:00 PM — Deluxe Late Night Reception</option>
            </select>
          </div>
        </div>

        {/* Dynamic Section corresponding to Booking category choice */}
        {bookingType === 'catering' ? (
          <div className="space-y-4 pt-4 border-t border-[#e3dcd5] animate-fade-in">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8c6239]">Large Order Food Preparation Specs</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Portion size slider */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-zinc-700 mb-1.5 flex justify-between">
                  <span>Target number of individual portions / servings:</span>
                  <span className="text-[#8c6239] font-black">{guestCount} Portions</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="5"
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value))}
                  className="w-full accent-[#8c6239] mt-2.5 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-bold text-zinc-400 mt-1 uppercase tracking-wider">
                  <span>10 Min Portions</span>
                  <span>500 Max Bulk Quantity</span>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="space-y-3 pt-4 border-t border-[#e3dcd5] animate-fade-in">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">Coffee Table Reservation Size</h4>
            <div className="grid grid-cols-4 gap-2">
              {[2, 4, 6, 8].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setGuestCount(size)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    guestCount === size
                      ? 'bg-[#8c6239] text-white border-[#8c6239]'
                      : 'bg-white text-stone-600 border-stone-200'
                  }`}
                >
                  {size} Seats
                </button>
              ))}
            </div>
            <p className="text-[10px] text-zinc-400 mt-1 font-bold italic">
              * Reservation for cafe seating holds VIP spots for up to 15 minutes. No table reservation fee required.
            </p>
          </div>
        )}

        {/* Custom notes remarks */}
        <div>
          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 flex items-center space-x-1">
            <span>Dishes requested, Allergen Warnings, & Delivery Instructions</span>
          </label>
          <textarea
            placeholder="List the specific menu items you want prepared (e.g., 5 Large Pancit Bilaos, 30 spring roll platters) and any specific delivery instructions..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full text-xs p-2.5 rounded-lg border border-[#e3dcd5] focus:outline-none focus:ring-1 focus:ring-[#8c6239] transition-all bg-[#faf6f0]/30"
          />
        </div>

        {/* Submit handle */}
        {currentUser ? (
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-[#2d1b10] text-[#faf6f0] text-xs font-bold uppercase tracking-widest hover:bg-[#8c6239] transition-all cursor-pointer shadow-sm disabled:opacity-60"
          >
            {isSubmitting ? 'TRANSMITTING REQUEST DETAILS...' : 'Confirm & Submit to Admin'}
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenAuth}
            className="w-full py-4 rounded-xl bg-[#8c6239] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#5c4033] transition-all cursor-pointer"
          >
            LOGIN TO CONFIRM RESERVATION
          </button>
        )}

      </form>
    </div>
  );
}
