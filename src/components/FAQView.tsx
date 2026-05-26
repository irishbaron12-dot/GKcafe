/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { FAQItem } from '../types';

interface FAQViewProps {
  faqs: FAQItem[];
}

export default function FAQView({ faqs }: FAQViewProps) {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto py-6 animate-fade-in">
      <div className="text-center space-y-2">
        <HelpCircle className="w-10 h-10 text-[#8c6239] mx-auto opacity-80" />
        <h3 className="text-2xl font-serif text-[#2d1b10]">Frequently Answered Inquiries</h3>
        <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
          Explore policies on booking periods, minimum headcounts, standard delivery radiuses, and bespoke customization options.
        </p>
      </div>

      <div className="space-y-3 pt-4">
        {faqs.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div 
              key={item.id} 
              className="bg-white rounded-2xl border border-[#efebe9] overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleFaq(item.id)}
                className="w-full text-left p-5 flex justify-between items-center bg-transparent border-0 cursor-pointer focus:outline-none"
              >
                <div className="flex items-center space-x-3 pr-4">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[#faf6f0] text-[#8c6239] border border-[#efebe9]">
                    {item.category}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#2d1b10]">{item.question}</span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-stone-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-[#5c4033] leading-relaxed font-medium animate-fade-in border-t border-[#efebe9]/60">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
