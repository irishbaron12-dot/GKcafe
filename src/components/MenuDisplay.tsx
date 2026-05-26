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
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function MenuDisplay({
  menuItems,
  onAddToCart,
  onBookCateringClick,
  searchQuery,
  setSearchQuery
}: MenuDisplayProps) {
  const [selectedGroup, setSelectedGroup] = useState<'all' | 'drinks' | 'food'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const groups = [
    { id: 'all', label: '🍽️ All Menu' },
    { id: 'drinks', label: '☕ Beverages & Brews' },
    { id: 'food', label: '🍱 Food & Bilaos' }
  ];

  const allCategories = [
    { 
      id: 'hot_coffee', 
      label: '☕ Hot Coffee', 
      group: 'drinks',
      description: 'Authentic local Liberica beans and hot rich espresso roasts'
    },
    { 
      id: 'iced_coffee', 
      label: '🧊 Iced Coffee', 
      group: 'drinks',
      description: 'Chilled manual espresso over ice and hand-whipped foam caps' 
    },
    { 
      id: 'frappes', 
      label: '🍦 Frappes', 
      group: 'drinks',
      description: 'Rich frozen blended treats with delicious sweet toppings' 
    },
    { 
      id: 'milk_tea', 
      label: '🧋 Milk Tea', 
      group: 'drinks',
      description: 'Assam black tea combined with velvet milks and caramelized boba' 
    },
    { 
      id: 'bilao', 
      label: '🍱 Filipino Bilaos', 
      group: 'food',
      description: 'Traditional bamboo platters woven for landmark milestones' 
    },
    { 
      id: 'delivery_meals', 
      label: '🍳 Hot Food Delivery', 
      group: 'food',
      description: 'Thrice-cooked crunchy crispy pork platters and savory rice bowls' 
    }
  ];

  // Derive categories shown depending on the selected high-level group
  const visibleCategories = selectedGroup === 'all'
    ? [{ id: 'all', label: '✨ All Categories' }, ...allCategories]
    : [{ id: 'all', label: `✨ All ${selectedGroup === 'drinks' ? 'Beverages' : 'Food Items'}` }, ...allCategories.filter(cat => cat.group === selectedGroup)];

  // Reset category on changing high-level group tab
  const handleGroupChange = (groupId: 'all' | 'drinks' | 'food') => {
    setSelectedGroup(groupId);
    setSelectedCategory('all');
  };

  // Filter items matching current filters (search and category groups)
  const matchingItems = menuItems.filter((item) => {
    if (!item.active) return false;
    
    // Group filter
    let matchesGroup = true;
    if (selectedGroup === 'drinks') {
      matchesGroup = ['hot_coffee', 'iced_coffee', 'frappes', 'milk_tea'].includes(item.category);
    } else if (selectedGroup === 'food') {
      matchesGroup = ['bilao', 'delivery_meals'].includes(item.category);
    }
    
    // Category filter
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    // Search filter
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
                          
    return matchesGroup && matchesCategory && matchesSearch;
  });

  // Determine which categories should be shown
  const renderedCategories = allCategories.filter((cat) => {
    let belongsToGroup = true;
    if (selectedGroup === 'drinks' && cat.group !== 'drinks') belongsToGroup = false;
    if (selectedGroup === 'food' && cat.group !== 'food') belongsToGroup = false;
    if (selectedCategory !== 'all' && cat.id !== selectedCategory) belongsToGroup = false;
    
    const hasItems = matchingItems.some(item => item.category === cat.id);
    return belongsToGroup && hasItems;
  });

  return (
    <div className="space-y-8 py-6 animate-fade-in" id="menu-section-anchor">
      
      {/* High-Level Parent Group Toggles */}
      <div className="flex flex-col sm:flex-row gap-2 border-b border-[#e3dcd5] pb-1">
        {groups.map((grp) => (
          <button
            key={grp.id}
            onClick={() => handleGroupChange(grp.id as any)}
            className={`px-5 py-2.5 rounded-t-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-b-2 -mb-[1px] ${
              selectedGroup === grp.id
                ? 'border-[#8c6239] text-[#8c6239] bg-[#faf6f0]'
                : 'border-transparent text-stone-500 hover:text-[#8c6239]'
            }`}
          >
            {grp.label}
          </button>
        ))}
      </div>

      {/* Search and Filters Layout Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-[#faf6f0] border border-[#e3dcd5] p-4.5 rounded-3xl">
        
        {/* Search Input Container */}
        <div className="relative flex-1 lg:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            id="menu-search-input"
            type="text"
            placeholder="Search Spanish Latte, Pancit Bilao, Crispy Pork Bagnet..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#efebe9] bg-white text-xs focus:outline-none focus:ring-1 focus:ring-[#8c6239] transition-all text-[#5c4033] font-medium"
          />
        </div>

        {/* Dynamic Horizontal Scroller of Category Buttons */}
        <div className="flex overflow-x-auto space-x-1.5 pb-2 lg:pb-0 scrollbar-none max-w-full">
          {visibleCategories.map((cat) => (
            <button
              id={`menu-filter-btn-${cat.id}`}
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#8c6239] text-[#faf6f0] font-black shadow-xs'
                  : 'bg-white text-[#5c4033] hover:bg-[#efebe9]/50 border border-[#efebe9]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>

      {/* Categorized Menu Items Output */}
      {matchingItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-150">
          <HelpCircle className="w-12 h-12 text-[#c4a484] mx-auto opacity-75 mb-3" />
          <p className="text-sm font-bold text-[#5c4033]">Nothing found in our menu catalog.</p>
          <p className="text-xs text-stone-400 mt-1 uppercase tracking-wider">Try searching with other keywords</p>
        </div>
      ) : (
        <div className="space-y-12">
          {renderedCategories.map((category) => {
            const categoryItems = matchingItems.filter(item => item.category === category.id);
            return (
              <div key={category.id} className="space-y-5">
                {/* Category Group Title Hero header */}
                <div className="border-l-4 border-[#8c6239] pl-3.5 py-1">
                  <h3 className="text-sm font-black text-[#5c4033] uppercase tracking-wider">
                    {category.label}
                  </h3>
                  <p className="text-xs text-stone-400 font-medium mt-0.5">
                    {category.description}
                  </p>
                </div>

                {/* Grid of cards belonging to this category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categoryItems.map((item) => (
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
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
