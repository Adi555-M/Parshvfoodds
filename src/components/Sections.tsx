import React from 'react';
import { Leaf, Clock, ShoppingBag, MapPin, Phone, Mail, Check } from 'lucide-react';
import { HEALTH_BENEFITS } from '../data';
import logoImg from '../assets/images/regenerated_image_1781430026139.jpg';

interface SectionsProps {
  onBrowseClick: () => void;
  onContactPhoneClick: () => void;
  activeTab: 'home' | 'about' | 'contact' | 'orders';
  setActiveTab: (tab: 'home' | 'about' | 'contact' | 'orders') => void;
}

export default function Sections({
  onBrowseClick,
  onContactPhoneClick,
  activeTab,
  setActiveTab,
}: SectionsProps) {
  const [logoError, setLogoError] = React.useState(false);

  return (
    <>
      {/* 1. WHY CHOOSE US SECTION (rendered on Home page only) */}
      {activeTab === 'home' && (
        <section className="px-4 py-8 max-w-lg md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto text-center bg-white border border-gray-100 my-6 select-none rounded-2xl shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 leading-snug">
            Why Choose Parshv Foods
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {/* Card 1 */}
            <div className="flex items-start gap-3.5 p-4 bg-gray-50 border border-gray-100 rounded-xl text-left">
              <div className="w-10 h-10 rounded-lg bg-[#EAF6EA] border border-[#2E7D32]/20 flex items-center justify-center shrink-0">
                <Leaf className="w-5 h-5 text-[#2E7D32]" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-805">Fresh Every Morning</h3>
                <p className="text-xs text-gray-450 mt-1 leading-relaxed">
                  Sourced directly from organic state farms at 4AM daily.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex items-start gap-3.5 p-4 bg-gray-50 border border-gray-100 rounded-xl text-left">
              <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-805">Fast Delivery</h3>
                <p className="text-xs text-gray-455 mt-1 leading-relaxed">
                  Delivered safely to your door before 11AM every day.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex items-start gap-3.5 p-4 bg-gray-50 border border-gray-100 rounded-xl text-left">
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-805">Hygienic Packing</h3>
                <p className="text-xs text-gray-455 mt-1 leading-relaxed">
                  Clean, double-layered contactless and safe food handling.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="flex items-start gap-3.5 p-4 bg-gray-50 border border-gray-100 rounded-xl text-left">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 text-lg font-bold text-emerald-600">
                ₹
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-855">Affordable Pricing</h3>
                <p className="text-xs text-gray-455 mt-1 leading-relaxed">
                  Fair local market rates without retail middle-men blocks.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. HEALTH BENEFITS SECTION -> Why Eat Fresh? (rendered on Home page only) */}
      {activeTab === 'home' && (
        <section className="px-4 py-8 max-w-lg md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto text-center bg-white border border-gray-100 my-6 select-none rounded-2xl shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 leading-tight">
            Why Eat Fresh?
          </h2>
          <p className="text-xs font-medium text-gray-500 mt-2 max-w-lg mx-auto leading-relaxed">
            Raw vegetables preserve vital enzymes and fibers. Enrich your daily traditional Gujarati dishes!
          </p>

          {/* Grid of benefits */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
            {HEALTH_BENEFITS.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl flex flex-col items-center text-center shadow-xs border border-gray-100 transition-all duration-300 hover:scale-[1.02] ${item.bgColor}`}
              >
                <div className="text-2xl mb-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xs border border-gray-105">
                  {item.emoji}
                </div>
                <h3 className="font-bold text-xs text-gray-800">
                  {item.name}
                </h3>
                <span className={`inline-block mt-3 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full border border-[#2E7D32]/10 bg-white/90 text-[#2E7D32]`}>
                  {item.benefit}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer id="pf-global-footer" className="w-full bg-[#2E7D32] text-white pt-6 pb-6 px-4 select-none text-left rounded-t-3xl shadow-inner mt-8">
        <div className="max-w-lg md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto flex flex-col gap-4 md:gap-8">
          
          {/* Main Footer columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
            {/* Logo & Info */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center p-0.5 border border-white overflow-hidden">
                  {!logoError ? (
                    <img
                      src={logoImg}
                      alt="Footer Logo"
                      className="w-full h-full object-cover rounded-full"
                      onError={() => setLogoError(true)}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Leaf className="w-4 h-4 text-[#2E7D32]" />
                  )}
                </div>
                <span className="font-bold text-lg tracking-tight">Parshv Foods</span>
              </div>
              <p className="text-xs text-green-100 font-medium leading-relaxed">
                Farm-fresh vegetables delivered directly to your doorstep in Surat every morning. Sourced at 4AM, delivered at 8AM – 11AM daily.
              </p>
            </div>

            {/* Quick Links with setActiveTab integration */}
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-xs tracking-wider uppercase text-white/90 border-b border-white/20 pb-1.5">
                Quick Links
              </h4>
              <div className="flex flex-col gap-2 mt-1 text-xs font-semibold text-green-100">
                <button
                  onClick={() => {
                    setActiveTab('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-left hover:text-white transition-all cursor-pointer focus:outline-none"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    setActiveTab('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-left hover:text-white transition-all cursor-pointer focus:outline-none"
                >
                  About Us
                </button>
                <button
                  onClick={() => {
                    setActiveTab('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-left hover:text-white transition-all cursor-pointer focus:outline-none"
                >
                  Contact Help
                </button>
                <button
                  onClick={() => {
                    setActiveTab('orders');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-left hover:text-white transition-all cursor-pointer focus:outline-none"
                >
                  Your Basket & Orders
                </button>
              </div>
            </div>

            {/* Delivery timings & terms */}
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-xs tracking-wider uppercase text-white/90 border-b border-white/20 pb-1.5">
                Delivery Info
              </h4>
              <div className="flex flex-col gap-2 mt-1 text-xs text-green-100 font-medium leading-relaxed">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Daily timings: 8AM – 11AM Surat-wide</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Order Cut-off: 10PM previous night</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span className="font-bold text-white uppercase tracking-wide">FREE Delivery on all orders!</span>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-green-800/60 mt-2 mb-2" />

          {/* Copyright details footer */}
          <div className="flex flex-col gap-1 text-[11px] text-green-200/80 font-medium select-none">
            <span>&copy; 2026 Parshv Foods. All rights reserved. Surat, Gujarat.</span>
            <span className="text-white/95 font-bold text-[10px]">
              Vegetables by PARSHV FOOD'S
            </span>
          </div>

        </div>
      </footer>
    </>
  );
}
