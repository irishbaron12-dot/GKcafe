/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Facebook, Instagram, CheckCircle } from 'lucide-react';

export default function ContactView() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSending(true);
    // Simulate real transmission
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setName('');
      setEmail('');
      setMessage('');
    }, 1200);
  };

  return (
    <div className="space-y-12 py-6 animate-fade-in">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Business Coordinates Block (Enlarged and placed on the left as the core priority) */}
        <div className="space-y-8 flex flex-col justify-between h-full">
          <div className="bg-[#faf6f0] border-2 border-[#eadaaf] rounded-3xl p-8 space-y-6 shadow-sm">
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#8c6239] block">
                MAIN OFFICE DIRECT CHANNELS
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#2d1b10] leading-none">
                GK Cafe by Primo Hub
              </h3>
              <p className="text-xs text-stone-500 font-semibold leading-relaxed">
                Makipag-ugnayan sa amin para sa inyong mga bilao orders, bulk party platters, at iba pang katanungan.
              </p>
            </div>
            
            <div className="space-y-5">
              {/* HQ Address Card */}
              <div className="flex items-start space-x-4 p-5 bg-white rounded-2xl border border-stone-200/80 hover:border-[#8c6239] hover:bg-[#fffcf9] hover:scale-[1.03] hover:shadow-md transition-all duration-300 group cursor-pointer">
                <div className="p-3 rounded-xl bg-orange-50 text-[#8c6239] group-hover:bg-[#8c6239] group-hover:text-white transition-colors duration-300">
                  <MapPin className="w-6 h-6 shrink-0" />
                </div>
                <div>
                  <p className="font-black text-[10px] text-stone-400 uppercase tracking-wider">Physical HQ Address</p>
                  <p className="text-[#2d1b10] font-black text-sm sm:text-base mt-1">Purok 3 Brgy Tranca, Bay, Laguna</p>
                  <span className="text-[9.5px] font-extrabold text-[#8c6239] opacity-0 group-hover:opacity-100 transition-opacity mt-1.5 block">Tingnan sa nakalagay na mapa sa ibaba 🗺️</span>
                </div>
              </div>

              {/* Phone Card */}
              <div className="flex items-start space-x-4 p-5 bg-white rounded-2xl border border-stone-200/80 hover:border-[#8c6239] hover:bg-[#fffcf9] hover:scale-[1.03] hover:shadow-md transition-all duration-300 group cursor-pointer">
                <div className="p-3 rounded-xl bg-emerald-50 text-[#8c6239] group-hover:bg-[#8c6239] group-hover:text-white transition-colors duration-300">
                  <Phone className="w-6 h-6 shrink-0 animate-bounce" />
                </div>
                <div>
                  <p className="font-black text-[10px] text-stone-400 uppercase tracking-wider">Catering & Delivery Hotlines</p>
                  <p className="text-[#2d1b10] font-black text-xl sm:text-2xl mt-1 tracking-wide">09176334053</p>
                  <span className="text-[9.5px] font-extrabold text-[#8c6239] opacity-0 group-hover:opacity-100 transition-opacity mt-1.5 block">Pindutin upang i-dial o tawagan kami agad 📞</span>
                </div>
              </div>

              {/* Email Card */}
              <div className="flex items-start space-x-4 p-5 bg-white rounded-2xl border border-stone-200/80 hover:border-[#8c6239] hover:bg-[#fffcf9] hover:scale-[1.03] hover:shadow-md transition-all duration-300 group cursor-pointer">
                <div className="p-3 rounded-xl bg-blue-50 text-[#8c6239] group-hover:bg-[#8c6239] group-hover:text-white transition-colors duration-300">
                  <Mail className="w-6 h-6 shrink-0" />
                </div>
                <div>
                  <p className="font-black text-[10px] text-stone-400 uppercase tracking-wider">Corporate Email Address</p>
                  <p className="text-[#2d1b10] font-black text-sm sm:text-base mt-1">gkcafe@gmail.com</p>
                  <span className="text-[9.5px] font-extrabold text-[#8c6239] opacity-0 group-hover:opacity-100 transition-opacity mt-1.5 block">Sumulat sa amin para sa business partnerships ✉️</span>
                </div>
              </div>
            </div>

            {/* Social linkages containing authentic colors with Twitter deleted */}
            <div className="pt-5 border-t border-[#e3dcd5] space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#2d1b10]/60">Sumali sa aming Social Media Pages</p>
              <div className="flex flex-wrap gap-3">
                {/* Facebook: Authentic Royal Blue color #1877F2 */}
                <a 
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#1877F2]/10 border border-[#1877F2]/20 text-[#1877F2] hover:bg-[#1877F2] hover:text-white hover:-translate-y-1.5 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                >
                  <Facebook className="w-4.5 h-4.5 fill-current" />
                  <span className="text-[11px] font-black uppercase tracking-wider">Facebook Page</span>
                </a>

                {/* Instagram: Authentic Gradient ruby colors #E4405F */}
                <a 
                  href="https://instagram.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#E4405F]/10 border border-[#E4405F]/20 text-[#E4405F] hover:bg-gradient-to-tr hover:from-[#FCAF45] hover:via-[#E1306C] hover:to-[#C13584] hover:text-white hover:-translate-y-1.5 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                >
                  <Instagram className="w-4.5 h-4.5" />
                  <span className="text-[11px] font-black uppercase tracking-wider">Instagram Feed</span>
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Google Map iframe */}
          <div className="h-68 bg-[#fcf8f2] rounded-3xl border border-[#e3dcd5] overflow-hidden shadow-sm flex flex-col p-1.5 bg-white">
            <div className="flex-1 rounded-2xl overflow-hidden relative border border-[#eadaaf]">
              <iframe
                title="GK Cafe by Primo Location Map"
                src="https://maps.google.com/maps?q=Purok%203%20Brgy%20Tranca%20Bay%20Laguna&t=&z=14&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 rounded-2xl"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div className="flex justify-between items-center px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#8c6239]">
              <span>📍 Google Map Interactive</span>
              <span className="text-[#5c4033] text-[9px] font-mono">Purok 3 Brgy Tranca, Bay, Laguna</span>
            </div>
          </div>

        </div>

        {/* Compact Inquiry Form Block (Reduced in size to highlight the physical contact block!) */}
        <div className="bg-white rounded-3xl border border-[#e3dcd5] p-5 sm:p-6 space-y-4 self-start shadow-xs">
          <div className="space-y-1.5">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#8c6239] block">
              ALTERNATIVE CHANNEL
            </span>
            <h3 className="text-lg font-bold text-[#2d1b10] uppercase tracking-wide">Send Message</h3>
            <p className="text-[11px] text-stone-500 leading-relaxed font-semibold">
              Maaari ninyo ring iwanan ang inyong mensahe sa form na ito at tutugon kami sa lalong madaling panahon.
            </p>
          </div>

          {isSent ? (
            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3 animate-fade-in">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
              <div>
                <p className="text-xs font-bold text-emerald-800">Your message has been received!</p>
                <p className="text-[10px] text-emerald-600 mt-1">We will reach out to you within 2 hours.</p>
              </div>
              <button
                onClick={() => setIsSent(false)}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase transition-colors cursor-pointer border-0"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[9px] uppercase tracking-widest font-extrabold text-stone-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Christina Reyes"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#e3dcd5] focus:outline-none focus:ring-1 focus:ring-[#8c6239] bg-[#faf6f0]/20 h-9.5"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-widest font-extrabold text-stone-400 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="christina@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#e3dcd5] focus:outline-none focus:ring-1 focus:ring-[#8c6239] bg-[#faf6f0]/20 h-9.5"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-widest font-extrabold text-stone-400 mb-1">Message Details *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Write your custom catering specifics, desired schedules..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#e3dcd5] focus:outline-none focus:ring-1 focus:ring-[#8c6239] bg-[#faf6f0]/20 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-[#2d1b10] text-[#faf6f0] text-[10px] font-black uppercase tracking-widest hover:bg-[#8c6239] hover:scale-[1.02] active:scale-98 transition-all duration-200 disabled:opacity-50 cursor-pointer border-0 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'Sending Inquiries...' : 'Transmit Inquiries'}</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
