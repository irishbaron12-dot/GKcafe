import React, { useEffect, useState } from 'react';
import { Heart, Sparkles, Coffee, ArrowRight } from 'lucide-react';

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

export default function ThankYouModal({ isOpen, onClose, userName }: ThankYouModalProps) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!isOpen) return;

    setCountdown(5);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md transition-opacity duration-300">
      <div 
        className="relative w-full max-w-md bg-[#faf6f0] border-2 border-[#eadaaf] rounded-3xl p-8 shadow-2xl text-center overflow-hidden transform transition-all duration-300 scale-100 flex flex-col items-center"
        id="thank-you-logout-card"
      >
        {/* Decorative ambient coffee background curves */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#8c6239]/5 rounded-full -mr-12 -mt-12 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#8c6239]/5 rounded-full -ml-8 -mb-8 pointer-events-none" />

        {/* Floating animated icon cluster */}
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-full bg-[#8c6239]/10 text-[#8c6239] flex items-center justify-center border border-[#8c6239]/20 shadow-inner">
            <Heart className="w-8 h-8 text-[#8c6239] fill-[#8c6239] animate-pulse" />
          </div>
          <div className="absolute top-0 right-[-8px] bg-amber-100 border border-amber-300 p-1 rounded-full text-amber-600 animate-bounce">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="absolute bottom-[-4px] left-[-4px] bg-stone-100 border border-[#8c6239]/20 p-1 rounded-full text-[#8c6239]">
            <Coffee className="w-4 h-4" />
          </div>
        </div>

        {/* Custom heart-warming greeting */}
        <h3 className="text-xl font-black text-[#2d1b10] uppercase tracking-wide mb-2 font-sans">
          Maraming Salamat po!
        </h3>
        
        {userName && (
          <div className="px-4 py-1.5 bg-[#8c6239]/10 rounded-full text-[#8c6239] text-xs font-black uppercase tracking-wider mb-4 border border-[#8c6239]/20">
            {userName}
          </div>
        )}

        <p className="text-stone-600 text-xs leading-relaxed max-w-xs mb-6 font-semibold">
          Salamat sa inyong pagtangkilik at pagbisita sa <span className="text-[#8c6239] font-black">GK Cafe By Primo</span>! 
          Kami ay lubos na natutuwa na maging bahagi ng inyong araw. Sana ay nasiyahan kayo sa ating mga masasarap na putahe at inumin.
        </p>

        <div className="w-full bg-[#ffffff] border border-stone-200 rounded-2xl p-3.5 mb-6 text-stone-500 text-[11px] font-bold flex items-center justify-center space-x-2">
          <span>Safe travels po at hanggang sa muling pag-order natin! 🛵💨</span>
        </div>

        {/* Close Button and Countdown tracker */}
        <button
          onClick={onClose}
          id="thank-you-close-btn"
          className="w-full py-3 rounded-xl bg-[#2d1b10] hover:bg-[#8c6239] hover:scale-[1.03] active:scale-95 text-white text-xs font-black uppercase tracking-widest transition-all duration-200 cursor-pointer shadow-md flex items-center justify-center space-x-2"
        >
          <span>ITULOY ANG PAG-BROWSE</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <span className="text-[10px] text-stone-400 mt-4.5 font-bold uppercase tracking-widest block">
          Awtomatikong magsasara sa loob ng {countdown} segundo...
        </span>
      </div>
    </div>
  );
}
