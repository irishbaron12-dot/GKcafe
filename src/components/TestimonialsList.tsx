/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle2, User } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialsListProps {
  testimonials: Testimonial[];
  onSubmitReview: (details: { rating: number; comment: string }) => Promise<void>;
  currentUser: any;
  onOpenAuth: () => void;
}

export default function TestimonialsList({
  testimonials,
  onSubmitReview,
  currentUser,
  onOpenAuth
}: TestimonialsListProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errMessage, setErrMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMessage('');
    setSuccess(false);

    if (!currentUser) {
      onOpenAuth();
      return;
    }

    if (!comment.trim()) {
      setErrMessage('Please write some testimonial feedback before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitReview({ rating, comment: comment.trim() });
      setSuccess(true);
      setComment('');
      setRating(5);
    } catch (err: any) {
      setErrMessage(err.message || 'Failed transmitting testimonial feedback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 py-6 animate-fade-in">
      
      {/* Testimonials Header Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Reviews Left Side Form Column */}
        <div className="lg:col-span-5 bg-[#faf6f0] border border-[#e3dcd5] p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#8c6239] block">
              VOICE YOUR REVIEWS
            </span>
            <h3 className="text-xl font-serif text-[#2d1b10]">Publish Your Primo Experience</h3>
            <p className="text-xs text-stone-500 leading-relaxed font-semibold">
              Loved our rich hot coffee roasts, traditional Pancit Bilao spreads, or bespoke catering banyou arrangements? Leave a verified review.
            </p>
          </div>

          {success && (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-semibold text-emerald-800 animate-fade-in">
              🎉 Thank you! Your review is instantly verified and published in our community registry.
            </div>
          )}

          {errMessage && (
            <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 text-xs font-semibold text-rose-800">
              {errMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Interactive Stars Selector */}
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold tracking-widest text-stone-400">Your Star Rating</label>
              <div className="flex space-x-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 rounded bg-transparent border-0 cursor-pointer text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star 
                      className="w-6 h-6" 
                      fill={(hoverRating !== null ? hoverRating >= star : rating >= star) ? '#f59e0b' : 'transparent'} 
                      stroke="#f59e0b" 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Inputs */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-extrabold text-stone-400 mb-1.5">Commentary Feedback *</label>
              <textarea
                required
                rows={3}
                placeholder="Describe your dining or brewing highlights, waitstaff punctuality, table designs..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-[#e3dcd5] focus:outline-none focus:ring-1 focus:ring-[#8c6239] bg-white transition-all"
              />
            </div>

            {currentUser ? (
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl bg-[#2d1b10] text-[#faf6f0] text-xs font-bold uppercase tracking-widest hover:bg-[#8c6239] transition-all disabled:opacity-50 cursor-pointer border-0 shadow-xs"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>{isSubmitting ? 'Publishing Review...' : 'Publish Verification Review'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="w-full py-3.5 rounded-xl bg-[#8c6239] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#5c4033] transition-all cursor-pointer"
              >
                LOGIN TO PUBLISH REVIEW
              </button>
            )}
          </form>
        </div>

        {/* Existing Feedbacks list Column */}
        <div className="lg:col-span-7 space-y-4">
          <span className="text-[10px] uppercase tracking-widest font-extrabold text-stone-400 block mb-2">
            WHAT OUR COMMUNITY SAYS ({testimonials.length})
          </span>
          
          <div className="space-y-4 max-h-120 overflow-y-auto pr-2">
            {testimonials.map((test) => (
              <div 
                key={test.id} 
                className="bg-white p-5 rounded-3xl border border-[#efebe9] space-y-3 shadow-xs hover:border-[#8c6239]/30 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-[#faf6f0] border border-[#e3dcd5] flex items-center justify-center font-bold text-[#8c6239] text-sm">
                      {test.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-extrabold text-[#2d1b10]">{test.name}</span>
                        {test.verified && (
                          <span className="flex items-center text-[8px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm shrink-0">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 mr-1" />
                            <span>Verified order</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] text-[#8c6239]">Verified on {new Date(test.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex space-x-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" 
                        fill={i < test.rating ? '#f59e0b' : 'transparent'}
                        stroke="#f59e0b"
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-[#5c4033] leading-relaxed font-semibold italic">
                  "{test.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
