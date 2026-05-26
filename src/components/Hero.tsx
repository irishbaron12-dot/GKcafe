/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Coffee, Utensils, CalendarDays, ArrowRight } from 'lucide-react';

interface HeroProps {
  onOrderNow: () => void;
  onBookCatering: () => void;
}

export default function Hero({ onOrderNow, onBookCatering }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Decorative Warm Ambient Background Elements */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#fcf8f2] blur-3xl opacity-80" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#faf6f0] blur-3xl opacity-70" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Main Visual Typography & Copy */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#fcf8f2] border border-[#eadaaf]">
              <Coffee className="w-4 h-4 text-[#8c6239] animate-bounce" />
              <span className="text-xs font-bold text-[#8c6239] uppercase tracking-widest">
                ESTABLISHED PRIMO QUALITY
              </span>
            </div>

            <h1 className="text-[44px] sm:text-6xl lg:text-[76px] font-black text-[#5c4033] leading-none tracking-tight">
              GK Cafe <span className="text-[#8c6239] font-serif italic font-normal block lg:inline-block mt-1 lg:mt-0">by Primo</span>
            </h1>

            <p className="text-sm sm:text-base text-[#8c6239] max-w-xl mx-auto lg:mx-0 font-bold leading-relaxed tracking-wide">
              Savor the perfect blend of café culture and traditional bilaos.
            </p>

            <p className="text-xs sm:text-sm text-stone-500 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              GK Cafe by Primo seamlessly combines Batangas Barako original coffee, Filipino delicacies, home food delivery, and premium party food preparation and bulk deliveries for all your celebrations and events.
            </p>

            {/* Quick CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                id="hero-order-btn"
                onClick={onOrderNow}
                className="group flex items-center justify-center space-x-2 px-7 py-4 rounded-xl bg-[#8c6239] text-white text-sm font-bold tracking-wider hover:bg-[#5c4033] transition-all shadow-md active:scale-98 cursor-pointer border-0"
              >
                <span>ORDER FOOD & COFFEE</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
              
              <button
                id="hero-book-btn"
                onClick={onBookCatering}
                className="flex items-center justify-center space-x-2 px-7 py-4 rounded-xl bg-white text-[#5c4033] border-2 border-[#8c6239] text-sm font-bold tracking-wider hover:bg-[#faf6f0] transition-all cursor-pointer active:scale-98"
              >
                <CalendarDays className="w-4 h-4 text-[#8c6239]" />
                <span>BOOK EVENT FOOD PREP</span>
              </button>
            </div>

            {/* Feature quick lists */}
            <div className="grid grid-cols-3 gap-4 pt-6 max-w-md mx-auto lg:mx-0 border-t border-[#e3dcd5]">
              <div className="text-center lg:text-left">
                <span className="block text-2xl font-black text-[#8c6239]">100%</span>
                <span className="text-[10px] sm:text-xs font-semibold text-[#8c6239]/75 uppercase tracking-wider block">Batangas Barako</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="block text-2xl font-black text-[#8c6239]">24/7</span>
                <span className="text-[10px] sm:text-xs font-semibold text-[#8c6239]/75 uppercase tracking-wider block font-bold">Online Orders</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="block text-2xl font-black text-[#8c6239]">15k+</span>
                <span className="text-[10px] sm:text-xs font-semibold text-[#8c6239]/75 uppercase tracking-wider block">Orders Prepared</span>
              </div>
            </div>
          </div>

          {/* Graphical Collage / Feature Images */}
          <div className="relative flex justify-center items-center">
            {/* Visual Frame */}
            <div className="relative w-80 h-96 sm:w-96 sm:h-110 rounded-2xl overflow-hidden shadow-2xl border-4 border-[#efebe9]">
              <img
                src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop"
                alt="Batangas Kapeng Barako"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#5c4033]/80 via-transparent to-transparent" />
              
              {/* Floating review card inside hero image */}
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/95 backdrop-blur-md rounded-xl border border-[#efebe9] shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#faf6f0] text-[#8c6239] font-black text-xs">
                    ★
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-[#5c4033]">"The Barako Coffee is deeply bold!"</p>
                    <p className="text-[9px] text-[#8c6239]/80 font-bold">Kapeng Barako — 100% Batangas Bold Blend</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlapping secondary decorative imagery card */}
            <div className="absolute -bottom-6 -right-2 sm:-right-8 w-44 h-48 bg-white p-2 rounded-xl shadow-xl border border-[#e3dcd5] transform rotate-3 hidden sm:block">
              <div className="w-full h-32 rounded-lg overflow-hidden mb-2">
                <img
                  src="https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=400&auto=format&fit=crop"
                  alt="Delicious Bilao Pancit"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-[9px] font-black text-[#5c4033] text-center uppercase tracking-wider">Filipino Bilaos</p>
            </div>

            {/* Overlapping third icon card */}
            <div className="absolute -top-4 -left-2 sm:-left-6 p-3 bg-[#fcf8f2] border border-[#efebe9] rounded-2xl shadow-lg flex items-center space-x-2 transform -rotate-3">
              <div className="p-2 rounded-lg bg-[#8c6239] text-white">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-black text-[#5c4033] leading-none">Bulk Party Prep</p>
                <p className="text-[8px] text-[#8c6239]/80 font-bold">Chef-prepared Feast Deliveries</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
