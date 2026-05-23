/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, ShoppingBag, Beer, HelpCircle } from 'lucide-react';
import { MenuItem } from '../types';

interface MenuDisplayProps {
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  onBookCateringClick: () => void;
}

export default function MenuDisplay({
  menuItems,
  onAddToCart,
  onBookCateringClick
}: MenuDisplayProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Senses' },
    { id: 'hot_coffee', label: '☕ Hot Coffee' },
    { id: 'iced_coffee', label: '🧊 Iced Coffee' },
    { id: 'frappes', label: '🍦 Frappes' },
    { id: 'milk_tea', label: '🧋 Milk Tea' },
    { id: 'bilao', label: '🍱 Filipino Bilaos' },
    { id: 'delivery_meals', label: '🍳 Hot Food Delivery' }
  ];

  const filteredItems = menuItems.filter((item) => {
    if (!item.active) return false;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 py-6 animate-fade-in" id="menu-section-anchor">
      
      {/* Search and Filters Layout Bar */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-[#faf6f0] border border-[#e3dcd5] p-4.5 rounded-3xl">
        
        {/* Search Input Container */}
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            id="menu-search-input"
            type="text"
            placeholder="Search Spanish Lattee, Pancit Bilao, Crispy Pork Pork Bagnet..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#efebe9] bg-white text-xs focus:outline-none focus:ring-1 focus:ring-[#8c6239] transition-all"
          />
        </div>

        {/* Dynamic Horizontal Scroller of Category Buttons */}
        <div className="flex overflow-x-auto space-x-1.5 pb-2 md:pb-0 scrollbar-none max-w-full">
          {categories.map((cat) => (
            <button
              id={`menu-filter-btn-${cat.id}`}
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#8c6239] text-[#faf6f0] font-bold shadow-xs'
                  : 'bg-white text-[#5c4033] hover:bg-[#efebe9]/50 border border-[#efebe9]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>

      {/* Menu Cards Display Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-150">
          <HelpCircle className="w-12 h-12 text-[#c4a484] mx-auto opacity-75 mb-3" />
          <p className="text-sm font-bold text-[#5c4033]">Nothing found in our menu catalog.</p>
          <p className="text-xs text-stone-400 mt-1 uppercase tracking-wider">Try searching with other keywords</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:border-[#8c6239]/40 hover:shadow-md transition-all flex flex-col h-full"
            >
              {/* Product Visual Container */}
              <div className="relative h-48 bg-stone-50 overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual Pill Accents */}
                <span className="absolute top-3 left-3 bg-[#8c6239]/90 backdrop-blur-xs text-white text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-md shadow-sm">
                  ₱{item.price.toLocaleString()}
                </span>

                <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-[#8c6239] text-[8px] font-extrabold px-2 py-0.5 rounded-sm border border-[#e3dcd5] shadow-xs uppercase tracking-wider">
                  {item.category.replace('_', ' ')}
                </span>
              </div>

              {/* Information / Description Details block */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h4 className="text-sm font-extrabold text-[#5c4033] tracking-tight leading-snug line-clamp-1">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-[#8c6239] leading-relaxed font-semibold line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Card footer CTA selection */}
                <button
                  onClick={() => onAddToCart(item)}
                  className="w-full flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#8c6239] hover:bg-[#5c4033] text-white text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer border-0 shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Basket</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
