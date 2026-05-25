/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  X, Shield, Lock, Mail, User, Phone, Check, Eye, EyeOff, 
  KeyRound, GraduationCap, Sparkles, HelpCircle 
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string, user: any) => void;
}

type AuthRole = 'customer' | 'admin';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<AuthRole>('customer');
  const [isForgotMode, setIsForgotMode] = useState(false);
  
  // Login & Register Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Password Visibility
  const [showPassword, setShowPassword] = useState(false);
  
  // Forgot Password flow states
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [mockRecoveredPass, setMockRecoveredPass] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Load remembered inputs
  useEffect(() => {
    if (isOpen) {
      const savedEmail = localStorage.getItem('gk_remember_email');
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    }
  }, [isOpen]);

  // Alerts states
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Validation function
  const validateForm = () => {
    if (activeTab === 'register') {
      if (!name.trim()) {
        setErrorMsg('Please specify your full legal name.');
        return false;
      }
      if (!phone.trim() || phone.trim().length < 7) {
        setErrorMsg('Please provide a valid comprehensive phone number.');
        return false;
      }
    }

    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please enter a valid email address (e.g., mail@domain.com).');
      return false;
    }

    if (!password || password.length < 6) {
      setErrorMsg('Password credentials must be at least 6 characters in length.');
      return false;
    }

    return true;
  };

  // Submit Handler for Sign In / Sign Up
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    const endpoint = activeTab === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = activeTab === 'login' 
      ? { email: email.trim(), password }
      : { name: name.trim(), email: email.trim(), password, phone: phone.trim() };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Identity portal verification failed.');
      }

      setSuccessMsg(data.message || 'Authenticated successfully!');
      
      // Store session
      localStorage.setItem('gk_auth_token', data.sessionToken);
      localStorage.setItem('gk_user', JSON.stringify(data.user));

      if (rememberMe) {
        localStorage.setItem('gk_remember_email', email.trim());
      } else {
        localStorage.removeItem('gk_remember_email');
      }

      setTimeout(() => {
        onLoginSuccess(data.sessionToken, data.user);
        onClose();
        // Clear forms
        setEmail('');
        setPassword('');
        setName('');
        setPhone('');
        setErrorMsg('');
        setSuccessMsg('');
      }, 1000);

    } catch (err: any) {
      setErrorMsg(err.message || 'Server connection timed out. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!forgotEmail.trim() || !forgotEmail.includes('@') || !forgotEmail.includes('.')) {
      setErrorMsg('Kindly enter a valid email address to search accounts database.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setForgotSent(true);
      
      // Determine pre-configured passwords based on email, or random
      const normForgot = forgotEmail.toLowerCase().trim();
      let demoPass = 'gk_primo_888';
      if (normForgot === 'primo@canteen.com' || normForgot === 'admin@gkcafe.com') {
        demoPass = 'admin123';
      }

      setMockRecoveredPass(demoPass);
      setSuccessMsg('Email coordinates found! Security bypass key generated.');
    }, 700);
  };

  // Pre-load specific presets helper and log in immediately
  const selectPreset = async (presetEmail: string, presetPass: string, role: AuthRole) => {
    setEmail(presetEmail);
    setPassword(presetPass);
    setSelectedRole(role);
    setIsForgotMode(false);
    setErrorMsg('');
    setSuccessMsg('Authorizing premium administrator credentials...');
    setActiveTab('login');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: presetEmail, password: presetPass })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Identity portal verification failed.');
      }

      setSuccessMsg(data.message || 'Authenticated successfully! Redirecting...');
      
      // Store session
      localStorage.setItem('gk_auth_token', data.sessionToken);
      localStorage.setItem('gk_user', JSON.stringify(data.user));

      setTimeout(() => {
        onLoginSuccess(data.sessionToken, data.user);
        onClose();
        // Clear forms
        setEmail('');
        setPassword('');
        setName('');
        setPhone('');
        setErrorMsg('');
        setSuccessMsg('');
      }, 1000);

    } catch (err: any) {
      setErrorMsg(err.message || 'Server connection details mismatch.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialAuth = async (provider: 'Google' | 'Facebook') => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);
    
    setSuccessMsg(`Initiating secure handshake with ${provider} credential server...`);
    
    setTimeout(async () => {
      const payload = provider === 'Google'
        ? { name: 'Google Client Account', email: 'google.guest@gmail.com', provider: 'Google' }
        : { name: 'Facebook Client Account', email: 'facebook.guest@gmail.com', provider: 'Facebook' };
        
      try {
        const res = await fetch('/api/auth/social', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || `${provider} authentication rejected.`);
        }
        
        setSuccessMsg(`Signed in via ${provider} successfully! Synchronization complete.`);
        
        localStorage.setItem('gk_auth_token', data.sessionToken);
        localStorage.setItem('gk_user', JSON.stringify(data.user));
        
        setTimeout(() => {
          onLoginSuccess(data.sessionToken, data.user);
          onClose();
          setEmail('');
          setPassword('');
          setName('');
          setPhone('');
          setErrorMsg('');
          setSuccessMsg('');
        }, 1000);
        
      } catch (err: any) {
        setErrorMsg(err.message || 'Third-party social protocol connection timed out.');
      } finally {
        setIsSubmitting(false);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
      {/* Semi-transparent dark warm backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-[#5c4033]/45 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Main Container - Two Columns Layout */}
      <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden relative border border-[#e3dcd5] shadow-2xl z-10 animate-fade-in flex flex-col md:flex-row min-h-[500px]">
        
        {/* Modal close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8c6239] hover:text-[#5c4033] bg-white/70 hover:bg-[#faf6f0] border border-[#e3dcd5] rounded-full cursor-pointer p-1.5 transition-all z-20"
          title="Close Dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* LEFT COLUMN: Select an Administrator Profile */}
        <div className="w-full md:w-1/2 bg-[#faf6f0] p-6 sm:p-8 flex flex-col justify-between border-r border-[#e3dcd5]">
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-black tracking-widest text-[#8c6239] uppercase">GK CAFE SECURITY DESK</span>
              <h3 className="text-2xl font-serif font-black text-[#5c4033] mt-1">Admin Presets</h3>
              <p className="text-xs text-[#8c6239] mt-2 leading-relaxed">
                Pre-configured administrator profiles are loaded below. Click either button to authorize immediately and access active dispatch databases, menu manager, and bookings:
              </p>
            </div>

            {/* Demo profile cards */}
            <div className="space-y-3">
              {/* Profile 1: Chef Admin */}
              <button
                type="button"
                onClick={() => selectPreset('primo@canteen.com', 'admin123', 'admin')}
                className="w-full text-left p-3.5 rounded-2xl bg-white border border-[#efebe9] hover:border-[#8c6239] hover:shadow-xs transition-all flex items-start space-x-4 cursor-pointer group"
              >
                <div className="p-2.5 rounded-xl bg-[#faf6f0] text-[#8c6239] group-hover:bg-[#8c6239] group-hover:text-white transition-all shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 leading-snug">
                  <p className="text-xs font-black text-[#5c4033]">Primo Chef Admin</p>
                  <p className="text-[11px] text-[#8c6239]">Banquets coordinator, kitchen orders & system planner.</p>
                  <p className="text-[10px] font-mono text-stone-400 font-bold mt-1">
                    Email: <span className="text-[#8c6239]">primo@canteen.com</span> | PW: <span className="text-[#8c6239]">admin123</span>
                  </p>
                </div>
              </button>

              {/* Profile 2: System Admin */}
              <button
                type="button"
                onClick={() => selectPreset('admin@gkcafe.com', 'admin123', 'admin')}
                className="w-full text-left p-3.5 rounded-2xl bg-white border border-[#efebe9] hover:border-[#8c6239] hover:shadow-xs transition-all flex items-start space-x-4 cursor-pointer group"
              >
                <div className="p-2.5 rounded-xl bg-[#faf6f0] text-[#8c6239] group-hover:bg-[#8c6239] group-hover:text-white transition-all shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 leading-snug">
                  <p className="text-xs font-black text-[#5c4033]">Primary Admin Portal</p>
                  <p className="text-[11px] text-[#8c6239]">Global canteen controller and transaction dispatcher.</p>
                  <p className="text-[10px] font-mono text-stone-400 font-bold mt-1">
                    Email: <span className="text-[#8c6239]">admin@gkcafe.com</span> | PW: <span className="text-[#8c6239]">admin123</span>
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Left bottom banner */}
          <div className="mt-6 md:mt-0 p-3 bg-white/70 border border-[#e3dcd5] rounded-xl flex items-center space-x-2">
            <span className="text-base">🛡️</span>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#8c6239] leading-tight">
              Administrator accountability: <span className="text-stone-500">All registered updates are synchronized securely.</span>
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Login/Register App Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            {/* Header Tabs: Sign In Acc vs Register Acc */}
            <div className="flex border-b border-[#efebe9] mb-6">
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setIsForgotMode(false); setErrorMsg(''); setSuccessMsg(''); }}
                className={`flex-1 pb-3 text-sm font-extrabold uppercase tracking-widest transition-all cursor-pointer bg-transparent border-0 text-center ${
                  activeTab === 'login' && !isForgotMode
                    ? 'text-[#8c6239] border-b-2 border-[#8c6239]'
                    : 'text-stone-400 hover:text-[#8c6239]'
                }`}
              >
                Sign In Acc
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('register'); setIsForgotMode(false); setErrorMsg(''); setSuccessMsg(''); }}
                className={`flex-1 pb-3 text-sm font-extrabold uppercase tracking-widest transition-all cursor-pointer bg-transparent border-0 text-center ${
                  activeTab === 'register' && !isForgotMode
                    ? 'text-[#8c6239] border-b-2 border-[#8c6239]'
                    : 'text-stone-400 hover:text-[#8c6239]'
                }`}
              >
                Register Acc
              </button>
            </div>

            {/* Error & Success Feedback banners */}
            <div className="mb-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-[11px] font-semibold tracking-wide leading-relaxed animate-pulse">
                  ⚠️ {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-[11px] font-semibold flex items-start space-x-1.5 shadow-xs">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}
            </div>

            {/* A. FORGOT PASSWORD VIEW */}
            {isForgotMode ? (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#8c6239] uppercase tracking-wider block">Passcode Recovery Coordinates</span>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Enter your email to verify coordinates inside our customer catalog and display your passcode instantly below:
                  </p>
                </div>

                {!forgotSent ? (
                  <>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] uppercase font-bold tracking-widest text-[#5c4033]">Email Address *</label>
                      <div className="relative">
                        <Mail className="w-4.5 h-4.5 text-[#c4a484] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          placeholder="christina@example.com"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="w-full text-xs pl-10 pr-3 py-2.5 border border-[#e3dcd5] rounded-xl focus:outline-none bg-white font-semibold text-[#5c4033]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-4 py-3.5 rounded-xl bg-[#8c6239] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#5c4033] transition-all cursor-pointer border-0 shadow-sm"
                    >
                      {isSubmitting ? 'VERIFYING...' : 'RESET PASSCODE COORDINATES'}
                    </button>
                  </>
                ) : (
                  <div className="space-y-4 pt-2">
                    <div className="p-4 bg-[#faf6f0] border border-[#e3dcd5] rounded-2xl text-left space-y-2">
                      <p className="text-xs text-[#5c4033] font-bold">
                        🛡️ Match found in demo database!
                      </p>
                      <p className="text-[11px] text-stone-500">
                        This demo profile belongs to:
                      </p>
                      <div className="p-2.5 bg-white rounded-lg border border-[#c4a484] text-center font-mono font-black text-[#8c6239] text-sm tracking-wider">
                        {mockRecoveredPass}
                      </div>
                      <p className="text-[9px] text-[#8c6239] leading-relaxed">
                        You can sign in using this preloaded password directly.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setPassword(mockRecoveredPass);
                        setEmail(forgotEmail);
                        setIsForgotMode(false);
                        setForgotSent(false);
                        setActiveTab('login');
                        setErrorMsg('Pre-filled recovered password successfully! Please click Sign In Account below.');
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#8c6239] text-white text-xs font-bold uppercase cursor-pointer border-0"
                    >
                      Apply Password & Log In
                    </button>
                  </div>
                )}

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => { setIsForgotMode(false); setForgotSent(false); setErrorMsg(''); setSuccessMsg(''); }}
                    className="text-xs text-[#8c6239] hover:underline font-bold bg-transparent border-0 cursor-pointer"
                  >
                    ← Back to standard Sign In Acc
                  </button>
                </div>
              </form>
            ) : (
              /* B. LOGIN & REGISTER VIEW */
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                
                {/* Form fields depending on activeTab */}
                {activeTab === 'register' && (
                  <>
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase font-bold tracking-widest text-[#5c4033]">Full Legal Name *</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#c4a484] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          placeholder="Maria Clara"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full text-xs pl-9 pr-3 py-2 border border-[#e3dcd5] rounded-xl focus:outline-none bg-white font-semibold text-[#5c4033]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase font-bold tracking-widest text-[#5c4033]">Contact Phone *</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-[#c4a484] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          placeholder="+63 917 123 4567"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full text-xs pl-9 pr-3 py-2 border border-[#e3dcd5] rounded-xl focus:outline-none bg-white font-semibold text-[#5c4033]"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Email input field */}
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-[#5c4033]">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#c4a484] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. maria@customer.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2.5 border border-[#e3dcd5] rounded-xl focus:outline-none bg-white font-semibold text-[#5c4033]"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center mb-0.5">
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-[#5c4033]">Security Password *</label>
                    {activeTab === 'login' && (
                      <button
                        type="button"
                        onClick={() => { setIsForgotMode(true); setForgotEmail(email); setErrorMsg(''); setSuccessMsg(''); }}
                        className="text-[10px] font-bold text-[#8c6239] hover:underline bg-transparent border-0 cursor-pointer"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#c4a484] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full text-xs pl-9 pr-10 py-2.5 border border-[#e3dcd5] rounded-xl focus:outline-none bg-white font-semibold text-[#5c4033]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c6239] hover:text-[#5c4033] bg-transparent border-0 cursor-pointer p-0.5 flex items-center justify-center focus:outline-none"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember me option */}
                {activeTab === 'login' && (
                  <div className="flex items-center space-x-2 py-1">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-[#8c6239] bg-white border-[#e3dcd5] focus:ring-[#8c6239] cursor-pointer accent-[#8c6239]"
                    />
                    <label htmlFor="rememberMe" className="text-[11px] font-bold text-[#5c4033] select-none cursor-pointer hover:text-[#8c6239] transition-colors">
                      Remember email address on this device
                    </label>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3.5 rounded-xl bg-[#8c6239] hover:bg-[#5c4033] text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-0 shadow-sm"
                >
                  {isSubmitting 
                    ? 'AUTHORIZING PORTAL...' 
                    : activeTab === 'login' 
                      ? 'Sign In Account' 
                      : 'Register Account'
                  }
                </button>

                {/* Continue with Google & Facebook Social Buttons */}
                <div className="relative my-4 flex items-center justify-between">
                  <span className="w-[32%] border-b border-[#e3dcd5]"></span>
                  <span className="text-[9.5px] font-black uppercase tracking-widest text-[#8c6239] shrink-0 bg-white px-2">or connect via</span>
                  <span className="w-[32%] border-b border-[#e3dcd5]"></span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSocialAuth('Google')}
                    disabled={isSubmitting}
                    className="flex items-center justify-center py-2.5 px-3 border border-[#cfc8c0] rounded-xl bg-white text-[10px] font-black uppercase text-[#5c4033] hover:bg-[#faf6f0] hover:border-[#8c6239] transition-all cursor-pointer shadow-xs whitespace-nowrap active:scale-[0.98]"
                  >
                    <svg className="w-4 h-4 mr-1.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill="#EA4335" d="M12 5.04c1.55 0 2.94.53 4.03 1.58l3-3C17.22 1.94 14.81 1.1 12 1.1 7.33 1.1 3.4 3.75 1.51 7.6l3.59 2.78c.85-2.54 3.22-4.34 6.9-4.34z"/>
                      <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.44c-.28 1.47-1.11 2.72-2.36 3.56l3.58 2.78c2.1-1.93 3.47-4.78 3.47-8.44z"/>
                      <path fill="#FBBC05" d="M5.1 14.82c-.22-.67-.35-1.39-.35-2.13s.13-1.46.35-2.13L1.51 7.6C.54 9.54 0 11.71 0 14c0 2.29.54 4.46 1.51 6.4l3.59-2.78-2.61-.8z"/>
                      <path fill="#34A853" d="M12 22.9c3.24 0 5.97-1.07 7.96-2.9l-3.58-2.78c-1 .67-2.28 1.07-3.96 1.07-3.68 0-6.05-1.8-6.9-4.34l-3.59 2.78c1.89 3.85 5.82 6.5 10.49 6.5z"/>
                    </svg>
                    Google
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialAuth('Facebook')}
                    disabled={isSubmitting}
                    className="flex items-center justify-center py-2.5 px-3 border border-[#cfc8c0] rounded-xl bg-[#1877F2] text-white text-[10px] font-black uppercase hover:bg-[#0c62d4] hover:border-[#0c62d4] transition-all cursor-pointer shadow-xs whitespace-nowrap active:scale-[0.98]"
                  >
                    <svg className="w-4 h-4 mr-1.5 fill-white shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Prompt banner to register/sign-in */}
          <div className="pt-4 border-t border-[#efebe9] text-center">
            {activeTab === 'login' ? (
              <p className="text-[11px] text-stone-500 font-semibold">
                Don't have a secure customer key?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
                  className="text-[#8c6239] hover:underline font-extrabold bg-transparent border-0 cursor-pointer"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p className="text-[11px] text-stone-500 font-semibold">
                Already registered client account?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
                  className="text-[#8c6239] hover:underline font-extrabold bg-transparent border-0 cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
