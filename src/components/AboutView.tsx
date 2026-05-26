/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Award, Compass, Heart, MapPin, Clock, Phone, Mail } from 'lucide-react';

const DEFAULT_STORY_PHOTO = 'https://scontent.fmnl13-4.fna.fbcdn.net/v/t39.30808-6/511096253_2148896342277768_3228485304758338614_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeFFpfiACCAtkz-oZzm5iAYNnS-tpmYF4QCdL62mZgXhAJ7725NQJiUFuuUQ7_qMGSIRCAPk8zRwTrrN7cpErmq5&_nc_ohc=XxCNHrr_SxQQ7kNvwE3mR34&_nc_oc=AdowJ7HEiwDy4mKGlQWXlWOfdhQmyFpmhHoE5sSma5AUHYPYpFbd5fwOjgfindI9Nb0&_nc_zt=23&_nc_ht=scontent.fmnl13-4.fna&_nc_gid=elGwYGz9_g6SOJ1sy40qEQ&_nc_ss=7b2a8&oh=00_Af4cxFtoyhZuCvt-dJOnKtJN5ZnfvZooab-53PinUp3yJQ&oe=6A17307A';

export default function AboutView() {
  const [storyPhoto, setStoryPhoto] = useState<string>(DEFAULT_STORY_PHOTO);

  useEffect(() => {
    const saved = localStorage.getItem('gk_story_photo');
    if (saved) {
      setStoryPhoto(saved);
    } else {
      setStoryPhoto(DEFAULT_STORY_PHOTO);
    }
  }, []);

  return (
    <div className="space-y-16 py-6 animate-fade-in">
      
      {/* Visual Editorial Header Column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#8c6239] block">
            OUR HERITAGE
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif text-[#2d1b10] leading-tight">
            The Story of <br />
            <span className="italic font-light">GK Cafe by Primo</span>
          </h2>
          <p className="text-sm text-[#5c4033] leading-relaxed font-medium">
            GK Cafe by Primo started after the owner graduated from CMDI in the school year 2023. After graduation, he built a small canteen that served students and teachers with utmost dedication. Because of the exceptional quality of food and drinks offered, the business gradually expanded through passionate word-of-mouth and customer loyalty.
          </p>
          <p className="text-sm text-zinc-550 leading-relaxed">
            Today, GK Cafe by Primo proudly accepts specialized food preparation and bulk party deliveries for all kinds of landmark events such as birthdays, weddings, seminars, corporate sessions, and family gatherings. From our humble canteen roots, we have blossomed into Los Baños' premier culinary destination, seamlessly combining Batangas Barako original coffee, Filipino delicacies, express home food delivery, and high-quality party platter preparation designed around your dream milestones.
          </p>
        </div>

        {/* Single Story Portrait of the Founders */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-full max-w-sm aspect-square md:aspect-auto md:h-[450px] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#efebe9] bg-[#faf6f0] flex flex-col justify-between p-4 group">
            {storyPhoto ? (
              <img 
                src={storyPhoto} 
                alt="GK Cafe Founders - Traditional Attire" 
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col justify-end p-0 bg-[#0f172a] text-center overflow-hidden">
                {/* Beautiful custom vector illustration representing the traditional Barong and Filipiniana founders portrait */}
                <svg className="w-full h-[90%] object-cover select-none" viewBox="0 0 400 450" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Studio Backdrop Spotlight */}
                  <rect width="400" height="450" fill="#0c111d"/>
                  <circle cx="200" cy="180" r="160" fill="url(#studio-spotlight)" opacity="0.65"/>
                  
                  <defs>
                    <radialGradient id="studio-spotlight" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#2e3c54"/>
                      <stop offset="100%" stopColor="#0c111d" stopOpacity="0"/>
                    </radialGradient>
                    
                    <linearGradient id="skin-female" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#ffd8b3" />
                      <stop offset="100%" stopColor="#e0a97c" />
                    </linearGradient>

                    <linearGradient id="skin-male" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#ffcca3" />
                      <stop offset="100%" stopColor="#d29668" />
                    </linearGradient>

                    <linearGradient id="hair-female" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ab7b52" />
                      <stop offset="60%" stopColor="#805030" />
                      <stop offset="100%" stopColor="#402010" />
                    </linearGradient>

                    <linearGradient id="barong-base" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#fdfbf7" />
                      <stop offset="50%" stopColor="#faf2e5" />
                      <stop offset="100%" stopColor="#eee4d5" />
                    </linearGradient>

                    <pattern id="embroidery-pattern" x="0" y="0" width="10" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 5 0 L 10 5 L 5 10 L 0 5 Z M 5 10 L 10 15 L 5 20 L 0 15 Z" fill="#2d1b10" opacity="0.15"/>
                    </pattern>
                  </defs>

                  {/* WOMAN (Standing behind, left-heavy) */}
                  <g id="woman">
                    {/* Hair (back layers) */}
                    <path d="M110 50 C110 50 85 90 85 150 C85 200 100 230 115 250" stroke="url(#hair-female)" strokeWidth="35" strokeLinecap="round" opacity="0.9"/>
                    
                    {/* Body/Shoulders */}
                    <path d="M70 240 C70 190 125 150 170 155 L215 175 L210 240 Z" fill="#18181b"/> {/* Black Skirt/Base */}
                    <path d="M70 240 C70 190 120 160 170 165 C185 168 195 185 205 195 L175 250 L110 250 Z" fill="url(#barong-base)"/>
                    
                    {/* Filipiniana Butterfly Sleeve (Beautiful structure with pattern) */}
                    <path d="M60 190 C45 150 90 120 120 135 C135 142 145 170 145 195 L95 210 Z" fill="url(#barong-base)" stroke="#3f2d20" strokeWidth="1.5"/>
                    {/* Sleeve Patterns/Bars */}
                    <path d="M62 170 C72 150 105 140 128 143" stroke="#2d1b10" strokeWidth="6" strokeDasharray="3 3"/>
                    <path d="M68 185 C78 165 110 155 125 160" stroke="#2d1b10" strokeWidth="4" strokeDasharray="1 2"/>
                    <path d="M85 200 C95 180 120 175 132 180" stroke="#2d1b10" strokeWidth="8"/>
                    <path d="M85 200 C95 180 120 175 132 180" stroke="url(#barong-base)" strokeWidth="4" strokeDasharray="2 2"/>

                    {/* Neck */}
                    <path d="M135 150 L155 150 L150 180 L135 175 Z" fill="url(#skin-female)"/>
                    <path d="M130 165 C135 165 150 168 160 165" stroke="#2d1b10" strokeWidth="2.5" fill="none" strokeLinecap="round"/>

                    {/* Face */}
                    <path d="M115 100 C110 150 175 160 175 115 C175 80 120 50 115 100 Z" fill="url(#skin-female)"/>

                    {/* Hair (front layers, beautifully framed blonde-brown highlights) */}
                    <path d="M112 105 C100 130 95 160 102 210 C104 220 118 200 118 180 Z" fill="url(#hair-female)"/>
                    <path d="M125 55 C150 55 175 75 175 105 C175 120 170 145 165 170" stroke="url(#hair-female)" strokeWidth="14" strokeLinecap="round" fill="none"/>
                    {/* Golden Highlight lines */}
                    <path d="M132 58 C152 64 168 85 168 112" stroke="#dfb689" strokeWidth="2" strokeLinecap="round" fill="none"/>
                    <path d="M104 110 C96 140 100 170 106 195" stroke="#dfb689" strokeWidth="1.5" strokeLinecap="round" fill="none"/>

                    {/* Smiling Face Features */}
                    {/* Eyes */}
                    <path d="M130 112 C134 110 138 110 140 112" stroke="#2d1b10" strokeWidth="2" strokeLinecap="round" fill="none"/>
                    <path d="M152 112 C156 110 160 110 162 112" stroke="#2d1b10" strokeWidth="2" strokeLinecap="round" fill="none"/>
                    {/* Rosy Cheeks */}
                    <circle cx="126" cy="122" r="5" fill="#f43f5e" opacity="0.3"/>
                    <circle cx="160" cy="122" r="5" fill="#f43f5e" opacity="0.3"/>
                    {/* Smile */}
                    <path d="M136 128 C144 134 150 134 154 128" stroke="#be123c" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                    <path d="M138 129 C143 133 147 133 152 129" fill="white"/>
                  </g>

                  {/* MAN (Sitting in front, centered-right) */}
                  <g id="man">
                    {/* Left shoulder hand of woman resting (Draped naturally) */}
                    <path d="M185 240 C190 220 220 220 230 235 L225 250 Z" fill="url(#skin-female)" opacity="0.95"/>
                    <path d="M210 225 C215 228 228 238 228 243" stroke="#2d1b10" strokeWidth="1" strokeLinecap="round"/>

                    {/* Barong Tagalog Body */}
                    <path d="M130 250 C110 270 100 370 100 450 L310 450 C315 370 310 270 290 250 Z" fill="url(#barong-base)"/>
                    <rect x="200" y="250" width="20" height="200" fill="url(#embroidery-pattern)"/>

                    {/* Traditional black embroideries (Detailed lines and curls) */}
                    <g id="embroidery">
                      {/* Central bands */}
                      <line x1="202" y1="260" x2="202" y2="450" stroke="#2d1b10" strokeWidth="3" strokeDasharray="4 2"/>
                      <line x1="210" y1="260" x2="210" y2="450" stroke="#8c6239" strokeWidth="2" strokeDasharray="1 3"/>
                      <line x1="218" y1="260" x2="218" y2="450" stroke="#2d1b10" strokeWidth="3" strokeDasharray="4 2"/>
                      
                      {/* Stylized curls / filigrees on the sides */}
                      <path d="M192 280 C182 290 192 310 182 320 C172 330 182 350 172 360" stroke="#2d1b10" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                      <path d="M228 280 C238 290 228 310 238 320 C248 330 238 350 248 360" stroke="#2d1b10" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                      <circle cx="188" cy="295" r="2.5" fill="#2d1b10"/>
                      <circle cx="232" cy="295" r="2.5" fill="#2d1b10"/>
                      <circle cx="178" cy="335" r="2.5" fill="#2d1b10"/>
                      <circle cx="242" cy="335" r="2.5" fill="#2d1b10"/>
                    </g>

                    {/* Barong Collar (Mandarin style collar, styled in neat contrast) */}
                    <path d="M185 242 C185 230 235 230 235 242" fill="none" stroke="#2d1b10" strokeWidth="8" strokeLinecap="round"/>
                    <path d="M185 242 C185 230 235 230 235 242" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round"/>
                    <path d="M188 238 Q210 248 232 238" stroke="#2d1b10" strokeWidth="1.5" fill="none"/>

                    {/* Neck */}
                    <path d="M192 210 L228 210 L223 245 L197 245 Z" fill="url(#skin-male)"/>
                    
                    {/* Head/Face */}
                    <path d="M172 165 C172 230 248 230 248 165 C248 115 172 115 172 165 Z" fill="url(#skin-male)"/>

                    {/* Neat Boy Haircut (Short back and sides, structured black) */}
                    <path d="M168 155 Q180 135 210 130 Q240 135 252 155 Q255 125 240 120 Q210 115 180 120 Q165 128 168 155" fill="#18181b"/>
                    <path d="M170 148 Q210 125 244 140" stroke="#2d1b10" strokeWidth="5" fill="none" strokeLinecap="round"/>
                    <path d="M172 165 Q165 168 168 178" stroke="#18181b" strokeWidth="6" strokeLinecap="round" fill="none"/> {/* Sideburns */}
                    <path d="M248 165 Q255 168 252 178" stroke="#18181b" strokeWidth="6" strokeLinecap="round" fill="none"/>

                    {/* Smiling Features */}
                    {/* Eyes */}
                    <path d="M188 170 C192 168 198 168 200 170" stroke="#18181b" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                    <path d="M220 170 C224 168 230 168 232 170" stroke="#18181b" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                    {/* Eyebrows */}
                    <path d="M184 162 C190 157 198 158 202 162" stroke="#18181b" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                    <path d="M218 162 C222 158 230 157 236 162" stroke="#18181b" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                    {/* Smile (Happy, warm teeth showing smile) */}
                    <path d="M194 190 C194 208 226 208 226 190 Z" fill="#991b1b"/>
                    <path d="M196 191 C203 197 217 197 224 191 Z" fill="white"/> {/* Bright white teeth smile */}
                    <path d="M190 188 Q210 198 230 188" stroke="#2d1b10" strokeWidth="2" strokeLinecap="round" fill="none"/>
                  </g>
                </svg>

                {/* Subtext info */}
                <div className="absolute top-4 left-4 right-4 bg-black/40 backdrop-blur-xs px-3 py-1.5 rounded-full text-center">
                  <span className="text-[9.5px] font-black text-amber-100 uppercase tracking-widest animate-pulse">
                    ✨ Tap Admin Panel to upload real selfie
                  </span>
                </div>
              </div>
            )}
            
            {/* Soft Overlay glassmorphism badge */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#efebe9]/50 shadow-lg transition-transform duration-300 group-hover:-translate-y-1">
              <span className="text-[9px] font-black tracking-widest text-[#8c6239] uppercase block mb-1">GK CAFE SOULS</span>
              <h4 className="text-xs font-black text-[#5c4033]">The Hearts Behind GK Cafe</h4>
              <p className="text-[10px] text-[#8c6239]/90 mt-1 font-medium italic">
                {storyPhoto ? "Founders of GK Cafe by Primo — Dressed in Traditional Barong & Filipiniana" : "CMDI Graduates class of 2023"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission and Vision Bento Column */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-[#e3dcd5]">
        
        {/* Box Mission */}
        <div className="p-8 rounded-3xl bg-[#faf6f0] border border-[#e3dcd5] space-y-4">
          <div className="w-10 h-10 bg-[#8c6239] text-white rounded-xl flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <h4 className="text-lg font-serif font-extrabold text-[#2d1b10]">Our Sacred Mission</h4>
          <p className="text-xs text-[#5c4033] leading-relaxed font-semibold">
            To provide our guests with an elevated dining and artisanal coffee experience by integrating raw local ingredients, premium barista craft, traditional Filipino recipes, and impeccable food cooking standards.
          </p>
        </div>

        {/* Box Vision */}
        <div className="p-8 rounded-3xl bg-[#faf6f0] border border-[#e3dcd5] space-y-4">
          <div className="w-10 h-10 bg-[#5c4033] text-white rounded-xl flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h4 className="text-lg font-serif font-extrabold text-[#2d1b10]">Our Bold Vision</h4>
          <p className="text-xs text-[#5c4033] leading-relaxed font-semibold">
            To become the leading premium heritage food preparation brand and specialty coffee chain in the region, recognized for authentic service, sustainable agricultural trade, and pristine event catering culinary shipments.
          </p>
        </div>

        {/* Core Values */}
        <div className="p-8 rounded-3xl bg-[#faf6f0] border border-[#e3dcd5] space-y-4">
          <div className="w-10 h-10 bg-[#8c6239] text-white rounded-xl flex items-center justify-center font-bold">
            <Heart className="w-5 h-5" />
          </div>
          <h4 className="text-lg font-serif font-extrabold text-[#2d1b10]">Our Core Principles</h4>
          <ul className="text-xs space-y-1.5 text-[#5c4033] leading-relaxed font-bold">
            <li>✓ Sustainable Direct Farm Sourcing</li>
            <li>✓ Uncompromising Culinary Quality</li>
            <li>✓ Genuine Filipino Hospitality</li>
            <li>✓ Meticulous Meal Prep Detail</li>
          </ul>
        </div>
      </div>

      {/* Fast Business Metrics Reference */}
      <div className="rounded-3xl border border-[#e3dcd5] p-8 bg-white grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-[#faf6f0] rounded-2xl text-[#8c6239]">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#5c4033] uppercase tracking-wider">Main Headquarters Location</p>
            <p className="text-xs font-bold text-[#2d1b10]">Purok 3 Brgy Tranca Bay Laguna</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="p-3 bg-[#faf6f0] rounded-2xl text-[#8c6239]">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#5c4033] uppercase tracking-wider">Store Operations Hours</p>
            <p className="text-xs font-bold text-[#2d1b10]">06:00 AM — 07:00 PM Daily</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="p-3 bg-[#faf6f0] rounded-2xl text-[#8c6239]">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#5c4033] uppercase tracking-wider">Hotline & Delivery Inquiries</p>
            <p className="text-xs font-bold text-[#2d1b10]">09176334053</p>
          </div>
        </div>
      </div>

    </div>
  );
}
