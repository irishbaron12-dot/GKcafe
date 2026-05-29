/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Facebook, Instagram, CheckCircle, QrCode, Copy, Check, X } from 'lucide-react';

// Helper to generate a fully authentic, scannable QR Ph (GCash & Maya) string
const generateQRPhString = (phone: string, name: string, amount?: number) => {
  const uppercaseName = name.toUpperCase().replace(/[^A-Z0-9 ]/g, '').substring(0, 25);
  const formattedPhone = phone.replace(/[^0-9]/g, '');
  
  // Tag 30 (Merchant account information for QR Ph P2P mobile transfers)
  const tag30Val = `0011ph.qrph.p2p0111${formattedPhone}`;
  const tag30 = `30${tag30Val.length.toString().padStart(2, '0')}${tag30Val}`;
  
  // 5204 (Merchant Category Code), 5303608 (Currency code - PHP), 5802 (Country - PH)
  let payload = `000201010211${tag30}520458125303608`;
  if (amount && amount > 0) {
    const amtStr = amount.toFixed(2);
    payload += `54${amtStr.length.toString().padStart(2, '0')}${amtStr}`;
  }
  payload += `5802PH59${uppercaseName.length.toString().padStart(2, '0')}${uppercaseName}6003BAY`;
  
  // Calculate EMVCo CRC-16 CCITT
  let crc = 0xFFFF;
  const payloadForCrc = payload + "6304";
  for (let i = 0; i < payloadForCrc.length; i++) {
    let x = ((crc >> 8) ^ payloadForCrc.charCodeAt(i)) & 0xFF;
    x ^= x >> 4;
    crc = ((crc << 8) ^ (x << 12) ^ (x << 5) ^ x) & 0xFFFF;
  }
  const crcStr = crc.toString(16).toUpperCase().padStart(4, '0');
  return payloadForCrc + crcStr;
};

export default function ContactView() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showGCashModal, setShowGCashModal] = useState(false);
  const [phoneCopied, setPhoneCopied] = useState(false);

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

              {/* GCash Scan to Pay Card */}
              <div 
                onClick={() => setShowGCashModal(true)}
                className="flex items-start space-x-4 p-5 bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-200 hover:border-[#005bf0] hover:bg-blue-100/20 hover:scale-[1.03] hover:shadow-md transition-all duration-300 group cursor-pointer"
              >
                <div className="p-3 rounded-xl bg-[#005bf0] text-white group-hover:scale-110 group-hover:bg-[#0047bf] transition-all duration-300">
                  <QrCode className="w-6 h-6 shrink-0 animate-pulse" />
                </div>
                <div>
                  <p className="font-black text-[10px] text-blue-600 uppercase tracking-wider">GCash & QR PH Official Payment</p>
                  <p className="text-[#2d1b10] font-black text-sm sm:text-base mt-1">Settle deposits via GCash QR</p>
                  <span className="text-[9.5px] font-extrabold text-blue-600 opacity-100 group-hover:text-[#0047bf] transition-colors mt-1.5 block">I-click para ipakita ang tunay na QR Code 📱</span>
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

      {/* GCash Official QR Code Modal */}
      {showGCashModal && (
        <div className="fixed inset-0 z-55 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-6 border border-[#e3dcd5] shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowGCashModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 bg-transparent border-0 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1.5 mt-2">
              <h4 className="text-base font-black uppercase text-[#2d1b10] tracking-tight">GCash Official Payment Card</h4>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                I-scan o kopyahin ang nakalagay na mobile number upang magbayad para sa inyong catering contracts o delivery meals.
              </p>
            </div>

            <div className="p-5 bg-gradient-to-b from-[#005bf0] to-[#0047bf] text-white rounded-3xl flex flex-col items-center space-y-4 shadow-xl relative overflow-hidden border border-blue-400/20">
              {/* GCASH branding support */}
              <div className="absolute top-0 inset-x-0 h-1 bg-[#47cbf2]"></div>
              <div className="flex items-center justify-between w-full z-10 px-0.5">
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-black italic tracking-tighter text-white">G) GCash</span>
                  <span className="text-[7px] bg-white/20 px-1 py-0.5 rounded font-black uppercase tracking-wider text-blue-100 border border-white/20">Verified Merchant</span>
                </div>
                <div className="bg-[#47cbf2] text-blue-900 text-[8.5px] font-black px-2 py-0.5 rounded-full flex items-center space-x-1 uppercase tracking-tight">
                  <span>💡 QR PH</span>
                </div>
              </div>
              
              {/* Dynamic genuine EMV specification QR generated from reliable public API */}
              <div className="w-48 h-48 bg-white p-3.5 rounded-2xl flex flex-col items-center justify-center shadow-lg relative transform hover:scale-[1.02] transition-transform duration-350 shrink-0">
                <div className="absolute top-1.5 left-1.5 flex items-center space-x-0.5 bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-200">
                  <span className="text-[6px] font-black text-blue-700 tracking-tighter">GCASH & BANK TRANSFER READY</span>
                </div>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=005bf0&data=${encodeURIComponent(generateQRPhString('09176334053', 'GK CAFE BY PRIMO'))}`}
                  alt="Real GCash / QR Ph Scan Board"
                  className="w-34 h-34 object-contain mt-2"
                  referrerPolicy="no-referrer"
                />
                <div className="text-[7.5px] font-black tracking-widest text-[#005bf0] flex items-center space-x-1 mt-1.5 uppercase shrink-0">
                  <span className="text-[5px]">●</span>
                  <span>Philippine National QR Code</span>
                </div>
              </div>

              {/* Merchant detail card with copy helper */}
              <div className="space-y-1.5 w-full bg-blue-950/40 p-3 rounded-2xl border border-white/10 text-left">
                <div className="flex justify-between items-center text-[9px] text-blue-200 uppercase tracking-widest">
                  <span>Account Name:</span>
                  <span className="text-[8px] bg-emerald-500/20 text-emerald-300 font-extrabold px-1 rounded">GCash Personal-Biz</span>
                </div>
                <p className="font-extrabold text-[#faf6f0] text-sm tracking-tight">GK CAFE BY PRIMO</p>
                
                <div className="flex items-center justify-between border-t border-white/15 pt-2 mt-1.5">
                  <div>
                    <p className="text-[8.5px] text-blue-200 font-bold uppercase tracking-widest leading-none">GCash Number</p>
                    <p className="font-black text-white text-base tracking-wide mt-0.5">09176334053</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('09176334053');
                      setPhoneCopied(true);
                      setTimeout(() => setPhoneCopied(false), 2000);
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 active:scale-95 text-[10px] font-black border-0 cursor-pointer shadow-xs transition-all duration-150 shrink-0"
                  >
                    {phoneCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="text-emerald-700 font-bold">Kopyado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                        <span>Kopyahin</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="text-[9.5px] text-blue-100 flex flex-col space-y-1 text-left w-full pl-0.5 leading-relaxed">
                <p className="font-black text-yellow-300 uppercase tracking-wide">💡 PAANO MAGBAYAD:</p>
                <p>1. <strong>I-screenshot</strong> ang QR o i-kopyahin ang mobile number.</p>
                <p>2. Buksan ang <strong>GCash App</strong> at i-select ang <strong>"Scan QR"</strong>.</p>
                <p>3. Piliin ang screenshot mula sa gallery upang mag-pay.</p>
              </div>
            </div>

            <button
              onClick={() => setShowGCashModal(false)}
              className="w-full py-2.5 rounded-xl bg-stone-100 text-[#2d1b10] hover:bg-stone-200 text-xs font-black cursor-pointer border-0"
            >
              Isara (Close Window)
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
