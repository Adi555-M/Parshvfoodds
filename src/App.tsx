import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

// Modular files imports
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SearchFilter from './components/SearchFilter';
import ProductCard from './components/ProductCard';
import ProfileDrawer from './components/ProfileDrawer';
import CartDrawer from './components/CartDrawer';
import Sections from './components/Sections';

import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import OrdersView from './components/OrdersView';

import { PRODUCTS } from './data';
import { Profile, HistoricalOrder } from './types';

export default function App() {
  // 1. Core Reactive States
  const [cart, setCart] = React.useState<Record<string, number>>({});
  const [selectedUnits, setSelectedUnits] = React.useState<Record<string, 'KG' | 'GRAM' | 'DOZEN'>>({});
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'home' | 'about' | 'contact' | 'orders'>('home');
  
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  // Load profile details from client-side local storage safely on load
  const [profile, setProfile] = React.useState<Profile>(() => {
    try {
      const stored = localStorage.getItem('pf_profile');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load profile data', e);
    }
    return { name: '', phone: '', address: '' };
  });

  // Load past order history from client-side local storage safely on load
  const [orderHistory, setOrderHistory] = React.useState<HistoricalOrder[]>(() => {
    try {
      const stored = localStorage.getItem('pf_order_history');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load order history', e);
    }
    return [];
  });

  // 2. State Mutators
  const handleQuantityChange = (productId: string, val: number) => {
    setCart((prev) => ({
      ...prev,
      [productId]: val,
    }));
  };

  const handleClearHistory = () => {
    setOrderHistory([]);
    try {
      localStorage.removeItem('pf_order_history');
    } catch (e) {
      console.error('Failed to clear order history storage', e);
    }
  };

  const handleReorder = (order: HistoricalOrder) => {
    const updatedCart: Record<string, number> = {};
    const updatedUnits: Record<string, 'KG' | 'GRAM' | 'DOZEN'> = {};

    order.items.forEach((it) => {
      updatedCart[it.productId] = it.quantity;
      updatedUnits[it.productId] = it.unit;
    });

    setCart(updatedCart);
    setSelectedUnits(updatedUnits);
    setIsCartOpen(true);
  };

  const handleUnitChange = (productId: string, unit: 'KG' | 'GRAM' | 'DOZEN') => {
    setSelectedUnits((prev) => ({
      ...prev,
      [productId]: unit,
    }));
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  };

  const handleSaveProfile = (updatedProfile: Profile) => {
    setProfile(updatedProfile);
    try {
      localStorage.setItem('pf_profile', JSON.stringify(updatedProfile));
    } catch (e) {
      console.error('Failed to save profile details', e);
    }
  };

  // Check if profile fields are accurately populated
  const isProfileFilled = React.useMemo(() => {
    return (
      (profile.name || '').trim().length > 0 &&
      (profile.phone || '').trim().length > 0 &&
      (profile.address || '').trim().length > 0
    );
  }, [profile]);

  // Compute total unique item types and cost in current basket
  const cartItemSummary = React.useMemo(() => {
    let distinctTypes = 0;
    let grandRupeeTotal = 0;

    Object.entries(cart).forEach(([id, qty]) => {
      const quantityNum = qty as number;
      if (quantityNum <= 0) return;
      distinctTypes += 1;
      const product = PRODUCTS.find((p) => p.id === id);
      if (!product) return;

      const unit = selectedUnits[id] || 'KG';
      if (unit === 'GRAM') {
        grandRupeeTotal += (quantityNum / 1000) * product.price;
      } else if (product.id === '5' && unit === 'KG') {
        // Alphonso mango custom KG pricing
        grandRupeeTotal += quantityNum * 250;
      } else {
        grandRupeeTotal += quantityNum * product.price;
      }
    });

    return {
      distinctTypes,
      grandRupeeTotal,
    };
  }, [cart, selectedUnits]);

  // Filter products ONLY by queries (removed category tags as requested)
  const filteredProducts = React.useMemo(() => {
    return PRODUCTS.filter((product) => {
      return (
        product.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.gujaratiName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery]);

  // WhatsApp Message Generator / Submission (opens WhatsApp directly)
  const handleCheckout = () => {
    if (!isProfileFilled) {
      setIsCartOpen(false);
      setIsProfileOpen(true);
      alert('Please fill out your Delivery Profile details before checkout!');
      return;
    }

    const cropsLines: string[] = [];
    const orderedHistoryItems: HistoricalOrder['items'] = [];

    Object.entries(cart).forEach(([id, qty]) => {
      const quantityNum = qty as number;
      if (quantityNum <= 0) return;
      const product = PRODUCTS.find((p) => p.id === id);
      if (!product) return;

      const unit = selectedUnits[id] || (product.baseUnit as 'KG' | 'GRAM' | 'DOZEN');
      let rowCost = 0;

      if (unit === 'GRAM') {
        rowCost = (quantityNum / 1000) * product.price;
      } else if (product.id === '5' && unit === 'KG') {
        rowCost = quantityNum * 250;
      } else {
        rowCost = quantityNum * product.price;
      }

      const rowCostLabel = product.isMarketPrice
        ? 'Market Price (બજાર ભાવ)'
        : `₹${rowCost.toFixed(2)}`;

      cropsLines.push(
        `🌿 ${product.gujaratiName} (${product.englishName}) - ${quantityNum} ${unit} - ${rowCostLabel}`
      );

      orderedHistoryItems.push({
        productId: id,
        gujaratiName: product.gujaratiName,
        englishName: product.englishName,
        emoji: product.emoji,
        quantity: quantityNum,
        unit,
        price: product.price,
        cost: rowCost,
      });
    });

    if (cropsLines.length === 0) {
      alert('Your shopping basket is empty! Fill up your card and try again.');
      return;
    }

    // 1. Persist in Order History
    const newOrder: HistoricalOrder = {
      id: 'PF-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      items: orderedHistoryItems,
      totalCost: cartItemSummary.grandRupeeTotal,
    };

    const newHistory = [newOrder, ...orderHistory];
    setOrderHistory(newHistory);
    try {
      localStorage.setItem('pf_order_history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Failed to write progress to local order history log', e);
    }

    // 2. Format final precompiled text message
    const hasMarketPriceItems = Object.entries(cart).some(([id, qty]) => {
      if ((qty as number) <= 0) return false;
      const product = PRODUCTS.find((p) => p.id === id);
      return product?.isMarketPrice || false;
    });

    const totalCostLabel = hasMarketPriceItems
      ? `₹${cartItemSummary.grandRupeeTotal.toFixed(2)} + Market Price items (to be calculated on actual rate at delivery)`
      : `₹${cartItemSummary.grandRupeeTotal.toFixed(2)}`;

    const lines = [
      'Hello Parshv Foods! 🌿',
      '',
      '*Customer Details:*',
      `👤 Name: ${profile.name.trim()}`,
      `📞 Phone: ${profile.phone.trim()}`,
      `📍 Address: ${profile.address.trim()}`,
      '',
      '*Order Details:*',
      ...cropsLines,
      '',
      `*Total Cost: ${totalCostLabel}*`,
      'Delivery Handling Fee: FREE 🚚',
      'Payment Mode: Cash / Scan UPI on delivery',
      '',
      'Please confirm my next morning vegetable delivery order! Thank you! 😊',
    ];

    const encodedMessage = encodeURIComponent(lines.join('\n'));
    // Secure direct link to Surat official business whatsapp line
    const whatsAppUrl = `https://wa.me/916355532061?text=${encodedMessage}`;

    // 3. Clear active cart to prevent duplicate submit and move to Orders tab to track
    setCart({});
    setIsCartOpen(false);
    setActiveTab('orders');

    // Open link in a secure tab
    window.open(whatsAppUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] selection:bg-[#2E7D32]/20 selection:text-[#2E7D32] w-full flex flex-col justify-between p-0">
      {/* Shell Container - COMPLETELY SQUARE (no rounded-t or rounded rounded-[2.5rem]) */}
      <div className="w-full bg-[#FAF9F6] overflow-hidden flex flex-col justify-between min-h-screen relative rounded-none">
        <div className="w-full">
          {/* Navbar wrapper (visible on all views to permit tab shifts) */}
          <Navbar
            cartCount={cartItemSummary.distinctTypes}
            cartTotal={cartItemSummary.grandRupeeTotal}
            isProfileFilled={isProfileFilled}
            onCartClick={() => setIsCartOpen(true)}
            onProfileClick={() => setIsProfileOpen(true)}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* VIEW ROUTER FOR SEPARATED PAGES */}
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, k: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {/* Hero Section */}
                <Hero onOrderNowClick={() => {
                  const el = document.getElementById('products-heading');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }} />

                {/* Searchbar & Info clocks */}
                <SearchFilter
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />

                {/* Product Grid section */}
                <main className="px-4 py-6 max-w-7xl mx-auto text-center select-none mt-2">
                  <h2 id="products-heading" className="text-xl font-black text-gray-800 uppercase tracking-wider">
                    Today's Fresh Vegetables
                  </h2>
                  <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wide">
                    Handpicked and delivered raw, clean and delicious 🥦
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-6">
                    {filteredProducts.length === 0 ? (
                      <div className="col-span-full py-12 text-center text-gray-400 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 bg-white rounded-none">
                        <span className="text-3xl">🥬</span>
                        <h3 className="font-black text-xs uppercase tracking-wider text-gray-650">No vegetables found!</h3>
                        <p className="text-[10px] font-bold text-gray-500 max-w-[200px] mt-1 text-center">
                          We currently do not have any items matching "{searchQuery}".
                        </p>
                      </div>
                    ) : (
                      filteredProducts.map((product, idx) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          index={idx}
                          quantity={cart[product.id] || 0}
                          unit={selectedUnits[product.id] || (product.baseUnit as 'KG' | 'GRAM' | 'DOZEN')}
                          onQuantityChange={(qty) => handleQuantityChange(product.id, qty)}
                          onUnitChange={(unit) => handleUnitChange(product.id, unit)}
                        />
                      ))
                    )}
                  </div>
                </main>
              </motion.div>
            )}

            {activeTab === 'about' && (
              <motion.div
                key="about"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <AboutView />
              </motion.div>
            )}

            {activeTab === 'contact' && (
              <motion.div
                key="contact"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <ContactView />
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <OrdersView
                  cart={cart}
                  selectedUnits={selectedUnits}
                  products={PRODUCTS}
                  profile={profile}
                  onEditProfile={() => setIsProfileOpen(true)}
                  onBrowseHome={() => setActiveTab('home')}
                  onCheckout={handleCheckout}
                  cartTotal={cartItemSummary.grandRupeeTotal}
                  orderHistory={orderHistory}
                  onClearHistory={handleClearHistory}
                  onReorder={handleReorder}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dynamic Marketing Sections & Global Footer */}
          <Sections
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onBrowseClick={() => setActiveTab('home')}
            onContactPhoneClick={() => {
              const text = encodeURIComponent('Hello Parshv Foods! 🌿 I would like to join your Surat broadcasting list. Please send daily crop updates! Thank you.');
              window.open(`https://wa.me/916355532061?text=${text}`, '_blank', 'noopener,noreferrer');
            }}
          />
        </div>

        {/* [L] Interactive Floating Basket widget (Optimized and highly polished) */}
        <AnimatePresence>
          {cartItemSummary.distinctTypes > 0 && !isCartOpen && activeTab !== 'orders' && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              className="fixed bottom-4 left-4 right-4 z-40 max-w-md mx-auto pointer-events-auto select-none"
            >
              <div
                onClick={() => setIsCartOpen(true)}
                className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-xl py-2.5 px-3 flex flex-col gap-1.5 shadow-[0_10px_25px_rgba(46,125,50,0.3)] cursor-pointer active:scale-[0.98] transition-all border border-green-700/50"
              >
                {/* Main Row: Cart status & Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8.5 h-8.5 bg-white/10 flex items-center justify-center text-white rounded-lg shadow-inner shrink-0">
                      <ShoppingBag className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <span className="text-[9px] text-green-100 font-bold uppercase tracking-wider block leading-none">
                        {cartItemSummary.distinctTypes} {cartItemSummary.distinctTypes === 1 ? 'vegetable' : 'vegetables'} selected
                      </span>
                      <span className="text-xs uppercase tracking-wider block font-black text-white mt-1 leading-none">
                        View Basket
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 font-bold text-white pr-0.5">
                    <span className="text-base font-black tracking-tight">₹{cartItemSummary.grandRupeeTotal.toFixed(2)}</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Separator line */}
                <div className="h-[1px] bg-white/10" />

                {/* Bottom Row: Custom Gujarati Banner with No Hand Signs */}
                <div className="text-center">
                  <span className="text-[10.5px] font-bold text-green-50 tracking-wide block leading-none">
                    તમારો order Parshv Food's ને મોકલવા અહીંયા ક્લિક કરો.
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Drawer Components overlay */}
        <AnimatePresence>
          {isProfileOpen && (
            <ProfileDrawer
              isOpen={isProfileOpen}
              profile={profile}
              onClose={() => setIsProfileOpen(false)}
              onSave={handleSaveProfile}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isCartOpen && (
            <CartDrawer
              isOpen={isCartOpen}
              cart={cart}
              selectedUnits={selectedUnits}
              products={PRODUCTS}
              profile={profile}
              onClose={() => setIsCartOpen(false)}
              onCheckout={handleCheckout}
              onQuantityChange={handleQuantityChange}
              onRemoveItem={handleRemoveItem}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
