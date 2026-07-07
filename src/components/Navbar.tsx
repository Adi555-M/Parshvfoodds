import React from 'react';
import { Home, Info, Leaf, Mail, RotateCcw, ShoppingBag, User } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  cartTotal: number;
  isProfileFilled: boolean;
  onCartClick: () => void;
  onProfileClick: () => void;
  activeTab: 'home' | 'about' | 'contact' | 'orders';
  setActiveTab: (tab: 'home' | 'about' | 'contact' | 'orders') => void;
}

export default function Navbar({
  cartCount,
  cartTotal,
  isProfileFilled,
  onCartClick,
  onProfileClick,
  activeTab,
  setActiveTab,
}: NavbarProps) {
  return (
    <div id="pf-header" className="sticky top-0 z-50 w-full select-none">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="w-full bg-[#FF9800] text-black py-2.5 px-4 text-center text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-1 leading-tight shadow-sm">
        <span>Free delivery on all orders! Order before 10PM And get order next day morning (8-11 AM)</span>
      </div>

      {/* 2. GREEN CORE HEADER */}
      <header className="w-full bg-[#2E7D32] text-white px-4 py-3 sm:py-4 flex flex-col items-center gap-3 sm:gap-4 shadow-md transition-all">
        
        {/* Brand Title Row with Cart & Profile controls */}
        <div className="w-full flex items-center justify-between max-w-7xl mx-auto md:px-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
            <Leaf className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white" />
            <span className="font-bold text-white text-xl sm:text-2xl tracking-tight">
              Parshv Foods
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Cart Icon */}
            <button
              onClick={onCartClick}
              className="relative w-10 h-10 border border-white/30 bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all cursor-pointer active:scale-95 rounded-xl text-white"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF9800] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile/User settings Icon */}
            <button
              onClick={onProfileClick}
              className={`w-10 h-10 border flex items-center justify-center transition-all cursor-pointer active:scale-95 rounded-xl ${
                isProfileFilled ? 'border-[#FF9800] bg-[#FF9800]/20 text-[#FF9800]' : 'border-white/30 bg-white/10 hover:bg-white/20 text-white'
              }`}
              aria-label="Edit Profile"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3. HORIZONTAL PILLS TAB RIBBON (Pill/Button Styling matching the image exactly) */}
        <div id="pf-tab-ribbon" className="w-full flex items-center justify-center max-w-7xl mx-auto md:px-4 mt-1.5">
          <div className="grid grid-cols-4 gap-1.5 sm:gap-3 w-full max-w-xl">
            {/* Home Pill */}
            <button
              id="pf-tab-home"
              onClick={() => setActiveTab('home')}
              className={`flex flex-row items-center justify-center gap-1.5 py-2 px-1 sm:px-3 text-center font-semibold text-[11px] sm:text-sm transition-all cursor-pointer focus:outline-none tracking-wide rounded-xl ${
                activeTab === 'home'
                  ? 'text-white bg-white/20 shadow-xs'
                  : 'text-white/90 hover:text-white hover:bg-white/5'
              }`}
            >
              <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>Home</span>
            </button>

            {/* About Pill */}
            <button
              id="pf-tab-about"
              onClick={() => setActiveTab('about')}
              className={`flex flex-row items-center justify-center gap-1.5 py-2 px-1 sm:px-3 text-center font-semibold text-[11px] sm:text-sm transition-all cursor-pointer focus:outline-none tracking-wide rounded-xl ${
                activeTab === 'about'
                  ? 'text-white bg-white/20 shadow-xs'
                  : 'text-white/90 hover:text-white hover:bg-white/5'
              }`}
            >
              <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>About</span>
            </button>

            {/* Contact Pill */}
            <button
              id="pf-tab-contact"
              onClick={() => setActiveTab('contact')}
              className={`flex flex-row items-center justify-center gap-1.5 py-2 px-1 sm:px-3 text-center font-semibold text-[11px] sm:text-sm transition-all cursor-pointer focus:outline-none tracking-wide rounded-xl ${
                activeTab === 'contact'
                  ? 'text-white bg-white/20 shadow-xs'
                  : 'text-white/90 hover:text-white hover:bg-white/5'
              }`}
            >
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>Contact</span>
            </button>

            {/* Orders Pill */}
            <button
              id="pf-tab-orders"
              onClick={() => setActiveTab('orders')}
              className={`flex flex-row items-center justify-center gap-1.5 py-2 px-1 sm:px-3 text-center font-semibold text-[11px] sm:text-sm transition-all cursor-pointer focus:outline-none tracking-wide rounded-xl ${
                activeTab === 'orders'
                  ? 'text-white bg-white/20 shadow-xs'
                  : 'text-white/90 hover:text-white hover:bg-white/5'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>Orders</span>
            </button>
          </div>
        </div>

      </header>
    </div>
  );
}
