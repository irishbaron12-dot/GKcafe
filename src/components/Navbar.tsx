/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Coffee, ShoppingBag, Bell, Menu, X, User, ShieldAlert, ClipboardList, Search } from 'lucide-react';
import { User as UserType, AppNotification } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserType | null;
  onLogout: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  notifications: AppNotification[];
  onMarkNotificationAsRead: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  cartCount,
  onOpenCart,
  onOpenAuth,
  notifications,
  onMarkNotificationAsRead,
  searchQuery,
  setSearchQuery
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu & Services' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e3dcd5] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Brand */}
          <div className="flex items-center">
            <button 
              id="nav-logo-btn"
              onClick={() => handleNavClick('home')} 
              className="flex items-center space-x-2 text-left bg-transparent border-0 cursor-pointer focus:outline-none"
            >
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#5c4033] text-white">
                <Coffee className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="block text-lg font-extrabold tracking-tight text-[#2d1b10]">
                  GK CAFE
                </span>
                <span className="block text-[10px] font-bold tracking-widest text-[#8c6239] uppercase">
                  by Primo
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                id={`nav-tab-${item.id}`}
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-semibold tracking-wide transition-colors relative py-2 ${
                  activeTab === item.id 
                    ? 'text-[#8c6239]' 
                    : 'text-[#5c4033] hover:text-[#8c6239]'
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <span className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-[#8c6239] rounded-full" />
                )}
              </button>
            ))}


            {currentUser?.role === 'admin' && (
              <button
                id="nav-admin-btn"
                onClick={() => handleNavClick('admin')}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-[#8c6239] bg-[#faf6f0] text-[#8c6239] hover:bg-[#efebe9] transition-colors ${
                  activeTab === 'admin' ? 'ring-2 ring-[#8c6239]' : ''
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Admin Panel</span>
              </button>
            )}
          </div>



          {/* Cart, Notifications, Auth actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notification bell */}
            <div className="relative">
              <button
                id="bell-notif-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-xl text-[#5c4033] hover:bg-[#faf6f0] hover:text-[#8c6239] transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#8c6239] rounded-full text-[10px] font-extrabold text-white flex items-center justify-center animate-bounce">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>

              {/* Notification Overlay Menu */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-[#e3dcd5] py-2 z-50 max-h-96 overflow-y-auto">
                  <div className="px-4 py-2 border-b border-[#e3dcd5] flex justify-between items-center bg-[#faf6f0]">
                    <span className="text-xs font-bold text-[#5c4033] uppercase tracking-wider">Notifications</span>
                    {unreadNotifications.length > 0 && (
                      <span className="text-[10px] font-semibold text-[#8c6239] bg-[#efebe9] px-2 py-0.5 rounded-full">
                        {unreadNotifications.length} New
                      </span>
                    )}
                  </div>
                  <div className="divide-y divide-zinc-100">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-zinc-400">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          className={`p-3 text-xs transition-colors ${notif.read ? 'bg-white' : 'bg-amber-50/50'}`}
                        >
                          <p className="text-[#3c2a1e] font-medium leading-relaxed">{notif.message}</p>
                          <div className="mt-2 flex justify-between items-center text-[10px] text-zinc-400">
                            <span>{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {!notif.read && (
                              <button
                                onClick={() => onMarkNotificationAsRead(notif.id)}
                                className="text-amber-800 hover:underline font-semibold bg-transparent border-0 cursor-pointer"
                              >
                                Mark Read
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Shopping cart bag */}
            <button
              id="cart-btn"
              onClick={onOpenCart}
              className="p-2.5 rounded-xl text-[#5c4033] hover:bg-[#faf6f0] hover:text-[#8c6239] transition-colors relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#8c6239] rounded-full text-[10px] font-extrabold text-white flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Separator line */}
            <div className="h-6 w-px bg-[#e3dcd5]" />

            {/* User Profile Action */}
            {currentUser ? (
              <div className="relative">
                <button
                  id="user-dropdown-btn"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#faf6f0] border border-[#e3dcd5] text-[#2d1b10] hover:border-[#8c6239] transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#8c6239] text-white flex items-center justify-center font-bold text-sm">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold max-w-24 truncate">{currentUser.name}</span>
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-[#e3dcd5] py-1 z-50">
                    <div className="px-4 py-2 border-b border-[#e3dcd5] bg-[#faf6f0]">
                      <p className="text-xs font-bold text-[#2d1b10] truncate">{currentUser.name}</p>
                      <p className="text-[10px] text-zinc-500 truncate">{currentUser.email}</p>
                    </div>
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => { setActiveTab('admin'); setShowUserDropdown(false); }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-[#8c6239] hover:bg-[#faf6f0] transition-colors bg-transparent border-0 cursor-pointer"
                      >
                        Admin Desk
                      </button>
                    )}
                    <button
                      onClick={() => { setActiveTab('dashboard'); setShowUserDropdown(false); }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-[#5c4033] hover:bg-[#faf6f0] transition-colors bg-transparent border-0 cursor-pointer"
                    >
                      📦 My Dashboard
                    </button>
                    <button
                      onClick={() => { onLogout(); setShowUserDropdown(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-[#8c6239] hover:bg-[#faf6f0] transition-colors border-t border-zinc-100 bg-transparent border-0 cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="login-btn"
                onClick={onOpenAuth}
                className="flex items-center space-x-2 px-4.5 py-2.5 rounded-xl bg-[#8c6239] text-white text-xs font-bold tracking-wider hover:bg-[#5c4033] transition-all cursor-pointer border-0 shadow-sm"
              >
                <User className="w-4 h-4" />
                <span>LOGIN / SIGN UP</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={onOpenCart}
              className="p-2 text-[#5c4033] relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-[#8c6239] rounded-full text-[9px] font-black text-white flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (showNotifications) setShowNotifications(false);
              }}
              className="p-2 text-[#5c4033] relative"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#8c6239] rounded-full" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#5c4033] hover:bg-[#faf6f0] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Notifications block when active */}
      {showNotifications && (
        <div className="md:hidden bg-[#faf6f0] border-b border-[#e3dcd5] px-4 py-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-[#5c4033] tracking-wider uppercase">Notifications</span>
            <button 
              onClick={() => setShowNotifications(false)} 
              className="text-[10px] font-bold text-[#8c6239] bg-transparent border-0 cursor-pointer"
            >
              Close
            </button>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto pb-2">
            {notifications.length === 0 ? (
              <p className="text-[10px] text-zinc-400 py-2">No alerts yet.</p>
            ) : (
              notifications.map(notif => (
                <div key={notif.id} className="text-[11px] p-2 bg-white rounded-lg border border-[#e3dcd5] shadow-xs">
                  <p className="text-[#3c2a1e]">{notif.message}</p>
                  <div className="flex justify-between mt-1 text-[9px] text-[#8c6239]">
                    <span>{new Date(notif.createdAt).toLocaleTimeString()}</span>
                    {!notif.read && (
                      <button 
                        onClick={() => onMarkNotificationAsRead(notif.id)} 
                        className="underline bg-transparent border-0 cursor-pointer font-bold"
                      >
                        Read
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden animate-fade-in bg-white border-b border-[#e3dcd5]">
          <div className="px-4 pt-3 pb-6 space-y-3">


            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left px-3 py-2 rounded-xl text-sm font-semibold tracking-wide ${
                  activeTab === item.id 
                    ? 'bg-[#faf6f0] text-[#8c6239]' 
                    : 'text-[#2d1b10] hover:bg-[#faf6f0]'
                }`}
              >
                {item.label}
              </button>
            ))}

            {currentUser && (
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`block w-full text-left px-3 py-2 rounded-xl text-sm font-semibold tracking-wide ${
                  activeTab === 'dashboard' 
                    ? 'bg-[#faf6f0] text-[#8c6239]' 
                    : 'text-[#2d1b10] hover:bg-[#faf6f0]'
                }`}
              >
                📦 My Dashboard & Tracking
              </button>
            )}

            {currentUser?.role === 'admin' && (
              <button
                onClick={() => handleNavClick('admin')}
                className="block w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-[#8c6239] bg-[#faf6f0] hover:bg-[#efebe9]"
              >
                🛡️ Admin Panel
              </button>
            )}

            <div className="pt-4 border-t border-[#e3dcd5] flex items-center justify-between">
              {currentUser ? (
                <div className="flex items-center space-x-3 w-full justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-[#8c6239] text-white flex items-center justify-center font-bold text-xs">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#5c4033] truncate max-w-[150px]">{currentUser.name}</p>
                      <p className="text-[10px] text-zinc-500 truncate max-w-[150px]">{currentUser.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={onLogout}
                    className="px-3 py-1.5 rounded-lg border border-[#e3dcd5] text-xs text-[#8c6239] hover:bg-[#faf6f0] font-bold uppercase bg-transparent cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-[#8c6239] text-white font-bold text-sm tracking-wider shadow-xs cursor-pointer border-0"
                >
                  <User className="w-4 h-4" />
                  <span>LOGIN / SIGN UP</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
