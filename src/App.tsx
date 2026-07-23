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
import { Profile, HistoricalOrder, Product } from './types';
import { db, collection, doc, onSnapshot, setDoc } from './firebase';

export default function App() {
  // 1. Core Reactive States
  const [cart, setCart] = React.useState<Record<string, number>>({});
  
  // Stateful vegetable list to allow photo upload & price changes in Admin mode (fallback to localStorage on init)
  const [productsList, setProductsList] = React.useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem('pf_custom_products');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge stored custom prices and custom compressed images into the base PRODUCTS list.
        return PRODUCTS.map((p) => {
          const custom = parsed.find((item: any) => item.id === p.id);
          if (custom) {
            const hasOverridePrice = typeof custom.price === 'number';
            return {
              ...p,
              image: custom.image || p.image,
              price: hasOverridePrice ? custom.price : p.price,
              isMarketPrice: hasOverridePrice ? false : p.isMarketPrice,
            };
          }
          return p;
        });
      }
    } catch (e) {
      console.error('Failed to load custom products list from localStorage', e);
    }
    return PRODUCTS;
  });

  // Real-time Cloud Synchronization with Firestore
  React.useEffect(() => {
    const colRef = collection(db, 'product_overrides');
    const unsubscribe = onSnapshot(colRef, 
      (snapshot) => {
        const overridesMap: Record<string, { image?: string; price?: number }> = {};
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          overridesMap[docSnap.id] = {
            image: data.image,
            price: typeof data.price === 'number' ? data.price : undefined,
          };
        });

        setProductsList((prev) => {
          const updated = PRODUCTS.map((p) => {
            const override = overridesMap[p.id];
            if (override) {
              const hasOverridePrice = override.price !== undefined;
              return {
                ...p,
                image: override.image !== undefined ? override.image : p.image,
                price: hasOverridePrice ? override.price : p.price,
                isMarketPrice: hasOverridePrice ? false : p.isMarketPrice,
              };
            }
            return p;
          });
          // Save to localStorage as quick local backup (store custom prices and compressed custom images)
          try {
            const lightweightOverrides = updated.map((p) => {
              const item: any = { id: p.id };
              const original = PRODUCTS.find((orig) => orig.id === p.id);
              if (p.price !== undefined) {
                item.price = p.price;
              }
              if (original && p.image && p.image !== original.image) {
                item.image = p.image;
              }
              return item;
            });
            localStorage.setItem('pf_custom_products', JSON.stringify(lightweightOverrides));
          } catch (e) {
            console.error('Failed to update local storage backup', e);
          }
          return updated;
        });
      },
      (error) => {
        console.warn(
          'Firestore real-time subscription was paused/failed (likely due to free quota limits or offline status). Falling back to local cache.',
          error
        );
      }
    );

    return () => unsubscribe();
  }, []);

  const [isAdminMode, setIsAdminMode] = React.useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');

  const handleUpdateProductImage = async (productId: string, base64Data: string) => {
    // 1. Optimistic Local Update
    setProductsList((prev) => {
      const updated = prev.map((p) => {
        if (p.id === productId) {
          return { ...p, image: base64Data };
        }
        return p;
      });
      try {
        const lightweightOverrides = updated.map((p) => {
          const item: any = { id: p.id };
          const original = PRODUCTS.find((orig) => orig.id === p.id);
          if (p.price !== undefined) {
            item.price = p.price;
          }
          if (original && p.image && p.image !== original.image) {
            item.image = p.image;
          }
          return item;
        });
        localStorage.setItem('pf_custom_products', JSON.stringify(lightweightOverrides));
      } catch (e) {
        console.error('Failed to save updated products list to localStorage', e);
      }
      return updated;
    });

    // 2. Persist to Firestore in Realtime
    try {
      const docRef = doc(db, 'product_overrides', productId);
      await setDoc(docRef, { image: base64Data, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (e) {
      console.error('Failed to update product image in Firestore', e);
    }
  };

  const handleUpdateProductPrice = async (productId: string, newPrice: number) => {
    // 1. Optimistic Local Update
    setProductsList((prev) => {
      const updated = prev.map((p) => {
        if (p.id === productId) {
          return { ...p, price: newPrice };
        }
        return p;
      });
      try {
        const lightweightOverrides = updated.map((p) => {
          const item: any = { id: p.id };
          const original = PRODUCTS.find((orig) => orig.id === p.id);
          if (p.price !== undefined) {
            item.price = p.price;
          }
          if (original && p.image && p.image !== original.image) {
            item.image = p.image;
          }
          return item;
        });
        localStorage.setItem('pf_custom_products', JSON.stringify(lightweightOverrides));
      } catch (e) {
        console.error('Failed to save updated product price to localStorage', e);
      }
      return updated;
    });

    // 2. Persist to Firestore in Realtime
    try {
      const docRef = doc(db, 'product_overrides', productId);
      await setDoc(docRef, { price: newPrice, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (e) {
      console.error('Failed to update product price in Firestore', e);
    }
  };
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
      const product = productsList.find((p) => p.id === id);
      if (!product) return;

      const unit = selectedUnits[id] || 'KG';
      if (unit === 'GRAM') {
        grandRupeeTotal += (quantityNum / 1000) * product.price;
      } else {
        grandRupeeTotal += quantityNum * product.price;
      }
    });

    return {
      distinctTypes,
      grandRupeeTotal,
    };
  }, [cart, selectedUnits, productsList]);

  // Filter products ONLY by queries (removed category tags as requested)
  const filteredProducts = React.useMemo(() => {
    return productsList.filter((product) => {
      return (
        product.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.gujaratiName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery, productsList]);

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
      const product = productsList.find((p) => p.id === id);
      if (!product) return;

      const unit = selectedUnits[id] || (product.baseUnit as 'KG' | 'GRAM' | 'DOZEN');
      let rowCost = 0;

      if (unit === 'GRAM') {
        rowCost = (quantityNum / 1000) * product.price;
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
      const product = productsList.find((p) => p.id === id);
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

          {isAdminMode && (
            <div className="bg-green-600 text-white text-xs py-2.5 px-4 flex items-center justify-between font-bold shadow-md select-none sticky top-14 z-30 transition-all border-b border-green-700">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                <span>🔓 Admin Mode Active: Click on any vegetable's square card icon to upload and replace its photo!</span>
              </div>
              <button
                onClick={() => setIsAdminMode(false)}
                className="px-2.5 py-1 bg-white/25 hover:bg-white/40 text-white text-[10px] uppercase font-bold rounded-lg tracking-wider transition-all cursor-pointer"
              >
                Exit
              </button>
            </div>
          )}

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
                          isAdminMode={isAdminMode}
                          onUpdateImage={handleUpdateProductImage}
                          onUpdatePrice={handleUpdateProductPrice}
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
                  products={productsList}
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

          {/* Completely secret hotspot in the bottom-right corner for Admin access */}
          <div
            onTouchStart={(e) => {
              const touch = e.touches[0];
              (window as any)._adminTouchStart = touch.clientY;
            }}
            onTouchEnd={(e) => {
              const touchStart = (window as any)._adminTouchStart;
              if (typeof touchStart === 'number') {
                const touchEnd = e.changedTouches[0].clientY;
                const diffY = touchStart - touchEnd; // Positive means swiped up
                if (diffY > 30) {
                  if (isAdminMode) {
                    setIsAdminMode(false);
                  } else {
                    setIsPasswordModalOpen(true);
                  }
                }
              }
            }}
            onClick={() => {
              if (isAdminMode) {
                setIsAdminMode(false);
              } else {
                setIsPasswordModalOpen(true);
              }
            }}
            className="fixed bottom-0 right-0 w-12 h-12 z-50 cursor-pointer select-none"
            title="Secret Admin Hotspot"
          >
            {/* Subtle faint indicator only when admin mode is active, otherwise completely invisible */}
            {isAdminMode && (
              <div className="absolute bottom-2.5 right-2.5 w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-md" />
            )}
          </div>
        </div>

        {/* Password Modal */}
        <AnimatePresence>
          {isPasswordModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setPasswordError('');
                  setAdminPasswordInput('');
                }}
                className="absolute inset-0 bg-black/60 backdrop-blur-xs animate-none"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 max-w-sm w-full relative z-10 text-center select-none font-sans"
              >
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-green-100">
                  <span className="text-xl">🔑</span>
                </div>

                <h3 className="text-base font-black text-gray-800 uppercase tracking-wider">Parshv Foods Admin Desk</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-1">
                  Access to update vegetable pictures & prices
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (adminPasswordInput === 'admin' || adminPasswordInput === '1234') {
                      setIsAdminMode(true);
                      setIsPasswordModalOpen(false);
                      setAdminPasswordInput('');
                      setPasswordError('');
                    } else {
                      setPasswordError('Incorrect password! Try again.');
                    }
                  }}
                  className="mt-5 text-left"
                >
                  <label className="block text-[9px] font-black uppercase tracking-wider text-gray-450 mb-1.5">
                    Enter Admin Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={adminPasswordInput}
                    onChange={(e) => {
                      setAdminPasswordInput(e.target.value);
                      setPasswordError('');
                    }}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                    autoFocus
                  />

                  {passwordError && (
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-wide mt-2 text-center">
                      ⚠️ {passwordError}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-3 mt-5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsPasswordModalOpen(false);
                        setPasswordError('');
                        setAdminPasswordInput('');
                      }}
                      className="py-2.5 px-4 bg-gray-100 hover:bg-gray-150 text-gray-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="py-2.5 px-4 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-green-700/10 cursor-pointer"
                    >
                      Login
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

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
              products={productsList}
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
