/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Facebook, Instagram, Twitter, CheckCircle } from 'lucide-react';

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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Contact Form Block */}
        <div className="bg-white rounded-3xl border border-[#e3dcd5] p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#8c6239] block">
              GET IN TOUCH INSTANTLY
            </span>
            <h3 className="text-2xl font-serif text-[#2d1b10]">Send Banquets A Message</h3>
            <p className="text-xs text-stone-500 leading-relaxed font-semibold">
              Have unique requirements for your special event, menu adjustments, or corporate deliveries? Drop us a line and our banquets officer will get back you shortly.
            </p>
          </div>

          {isSent ? (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3 animate-fade-in">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <div>
                <p className="text-sm font-bold text-emerald-800">Your message has been received!</p>
                <p className="text-xs text-emerald-600 mt-1">We will reach out to you via your email or phone within 2 hours.</p>
              </div>
              <button
                onClick={() => setIsSent(false)}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase transition-colors cursor-pointer border-0"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-extrabold text-stone-400 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Christina Reyes"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#e3dcd5] focus:outline-none focus:ring-1 focus:ring-[#8c6239] bg-[#faf6f0]/20"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-extrabold text-stone-400 mb-1.5">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="christina@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#e3dcd5] focus:outline-none focus:ring-1 focus:ring-[#8c6239] bg-[#faf6f0]/20"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-extrabold text-stone-400 mb-1.5">Message / Inquiries Details *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write your custom catering specifics, event locations, desired schedules, theme preferences..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#e3dcd5] focus:outline-none focus:ring-1 focus:ring-[#8c6239] bg-[#faf6f0]/20"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl bg-[#2d1b10] text-[#faf6f0] text-xs font-bold uppercase tracking-widest hover:bg-[#8c6239] transition-all disabled:opacity-50 cursor-pointer border-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'Sending Inquiries...' : 'Transmit Inquiries'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Business Coordinates & Stylized Map Layout */}
        <div className="space-y-8 flex flex-col justify-between">
          <div className="bg-[#faf6f0] border border-[#e3dcd5] rounded-3xl p-8 space-y-6">
            <h4 className="text-lg font-serif text-[#2d1b10] italic">GK Cafe by Primo Hub</h4>
            
            <div className="space-y-4 text-xs font-semibold text-[#5c4033]">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#8c6239] shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-[#2d1b10]">Physical HQ Boulevard Address</p>
                  <p className="text-[#5c4033] font-bold mt-1">Purok 3 Brgy Tranca, Bay, Laguna</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-[#8c6239] shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-[#2d1b10]">Banquets & Delivery Hotlines</p>
                  <p className="text-[#5c4033] font-extrabold mt-1">09176334053</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-[#8c6239] shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-[#2d1b10]">Corporate Email Address</p>
                  <p className="text-[#5c4033] font-bold mt-0.5">gkcafe@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Social linkages */}
            <div className="pt-4 border-t border-[#e3dcd5] space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Join our social cafe circles</p>
              <div className="flex space-x-4">
                <a href="#facebook" className="p-2.5 rounded-full bg-white border border-[#efebe9] text-[#2d1b10] hover:bg-[#8c6239] hover:text-white hover:-translate-y-1 transition-all">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#instagram" className="p-2.5 rounded-full bg-white border border-[#efebe9] text-[#2d1b10] hover:bg-[#8c6239] hover:text-white hover:-translate-y-1 transition-all">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#twitter" className="p-2.5 rounded-full bg-white border border-[#efebe9] text-[#2d1b10] hover:bg-[#8c6239] hover:text-white hover:-translate-y-1 transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Google Map iframe */}
          <div className="h-68 bg-[#fcf8f2] rounded-3xl border border-[#e3dcd5] overflow-hidden shadow-md flex flex-col p-1.5 bg-white">
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

      </div>

    </div>
  );
}
