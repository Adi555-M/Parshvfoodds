import React from 'react';
import { X, Trash2, Plus, Minus, ShieldCheck, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Profile } from '../types';

interface CartItemData {
  product: Product;
  quantity: number;
  unit: 'KG' | 'GRAM' | 'DOZEN';
}

interface CartDrawerProps {
  isOpen: boolean;
  cart: Record<string, number>;
  selectedUnits: Record<string, 'KG' | 'GRAM' | 'DOZEN'>;
  products: Product[];
  profile: Profile;
  onClose: () => void;
  onCheckout: () => void;
  onQuantityChange: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
}

// Crisp inline SVG for WhatsApp icon
const WhatsAppIconSVG = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="currentColor"
    className="inline-block"
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.864-9.84.002-2.63-1.023-5.101-2.883-6.963C16.58 1.94 14.11 .917 11.512.916 6.074.916 1.65 5.328 1.646 10.755c-.002 1.673.438 3.31 1.272 4.757l-.991 3.616 3.72-.974zm13.111-6.175c-.328-.164-1.94-.959-2.241-1.07-.301-.11-.52-.164-.738.164-.219.329-.848 1.07-1.039 1.29-.192.219-.384.246-.712.083-.328-.164-1.385-.511-2.637-1.63-1.01-.902-1.693-2.016-1.892-2.344-.199-.328-.021-.506.142-.669.147-.146.328-.384.493-.575.164-.192.219-.329.328-.548.11-.219.055-.411-.027-.575-.082-.164-.738-1.782-1.01-2.44-.266-.64-.537-.54-.738-.551-.192-.01-.41-.01-.628-.01-.219 0-.575.082-.876.411-.301.329-1.15 1.123-1.15 2.738 0 1.616 1.178 3.178 1.342 3.397.164.219 2.317 3.538 5.614 4.962.784.339 1.396.541 1.874.693.788.251 1.505.215 2.073.13.633-.095 1.94-.794 2.214-1.562.274-.767.274-1.423.192-1.561-.082-.138-.219-.22-.602-.383z" />
  </svg>
);

export default function CartDrawer({
  isOpen,
  cart,
  selectedUnits,
  products,
  profile,
  onClose,
  onCheckout,
  onQuantityChange,
  onRemoveItem,
}: CartDrawerProps) {
  // Compute ordered cart items (with quantities > 0)
  const orderItems: CartItemData[] = React.useMemo(() => {
    return Object.entries(cart)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => {
        const prod = products.find((p) => p.id === id);
        return {
          product: prod!,
          quantity: qty,
          unit: selectedUnits[id] || 'KG',
        };
      })
      .filter((item) => item.product !== undefined);
  }, [cart, selectedUnits, products]);

  // Compute calculated costs
  const getItemCost = (item: CartItemData) => {
    if (item.unit === 'GRAM') {
      return (item.quantity / 1000) * item.product.price;
    }
    // Mango KG pricing custom configuration
    if (item.product.id === '5' && item.unit === 'KG') {
      return item.quantity * 250;
    }
    return item.quantity * item.product.price;
  };

  const itemsTotal = React.useMemo(() => {
    return orderItems.reduce((acc, item) => acc + getItemCost(item), 0);
  }, [orderItems]);

  const deliveryFee = 0; // FREE
  const grandTotal = itemsTotal + deliveryFee;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center select-none">
      {/* Backdrop overlay background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs"
      />

      {/* [M] Cart Bottom Sheet Drawer Container - Elegant Curves */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        className="relative w-full max-w-lg bg-white shadow-2xl z-40 max-h-[92vh] overflow-y-auto flex flex-col rounded-t-3xl border-t border-gray-100"
      >
        {/* Grey pull slider horizontal bar */}
        <div className="w-full flex justify-center py-3 select-none">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
        </div>

        {/* Drawer Header with Elegant curves */}
        <div className="mx-4 mb-2 bg-[#2E7D32] text-white p-4.5 rounded-2xl relative flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 flex items-center justify-center text-xl shadow-xs rounded-xl">
              🧺
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider leading-tight">
                Your Fruits & Vegetables Basket
              </h2>
              <p className="text-[10px] text-white/90 mt-1 uppercase tracking-wide font-semibold">
                You have {orderItems.length} items in basket
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all active:scale-95 cursor-pointer rounded-xl"
            aria-label="Close cart basket drawer"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* SECTION LABEL */}
        <div className="w-full px-5 py-3 select-none bg-gray-50 border-b border-gray-100">
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#2E7D32] tracking-wider uppercase">
            <span>🌿</span> Review Your Order Details
          </div>
        </div>

        {/* Dynamic content scroll frame with clean curved items */}
        <div className="flex-1 px-5 py-4 overflow-y-auto max-h-[40vh] flex flex-col gap-3.5">
          <AnimatePresence initial={false}>
            {orderItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 px-4 text-center text-gray-400 select-none flex flex-col items-center justify-center gap-3"
              >
                <div className="w-16 h-16 border border-dashed border-gray-300 flex items-center justify-center text-[#2E7D32]/85 mb-2 rounded-2xl">
                  <ShoppingCart className="w-7 h-7" />
                </div>
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Your basket is empty!</h3>
                <p className="text-[11px] text-gray-500 max-w-xs mt-0.5 leading-relaxed">
                  Browse fresh garden produce and tap '+' to add delicious raw crops.
                </p>
              </motion.div>
            ) : (
              orderItems.map((item) => {
                const itemCost = getItemCost(item);
                const priceLabel = item.product.isMarketPrice
                  ? 'Market Price'
                  : item.product.id === '5'
                    ? item.unit === 'KG'
                      ? '₹250/kg'
                      : `₹${item.product.price}/dozen`
                    : `₹${item.product.price}/kg`;

                return (
                  <motion.div
                    key={item.product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100/80 border border-gray-105 rounded-2xl transition-colors"
                  >
                    {/* Left details */}
                    <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                      <div
                        style={{ backgroundColor: item.product.bgColor }}
                        className="w-11 h-11 border border-gray-100 flex items-center justify-center text-xl shadow-xs flex-shrink-0 rounded-xl"
                      >
                        {item.product.emoji}
                      </div>
                      <div className="text-left truncate">
                        <h4 className="text-xs font-bold text-gray-800 leading-tight">
                          {item.product.gujaratiName}
                        </h4>
                        <span className="text-[10px] text-gray-500 block lowercase mt-0.5 font-semibold">
                          ({item.product.englishName})
                        </span>
                        <span className="text-[9px] text-[#2E7D32] block font-bold mt-1 uppercase tracking-wider bg-white border border-[#2E7D32]/10 px-2 py-0.5 self-start inline-block rounded-full">
                          {item.quantity} {item.unit} @ {priceLabel}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Adjustment Controls */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="bg-white border border-gray-200 py-1 px-1 flex items-center gap-1.5 shadow-xs rounded-xl">
                        {/* Decrement */}
                        <button
                          onClick={() => {
                            const step = item.unit === 'GRAM' ? 100 : 1;
                            const nextVal = item.quantity - step;
                            if (nextVal <= 0) {
                              onRemoveItem(item.product.id);
                            } else {
                              onQuantityChange(item.product.id, nextVal);
                            }
                          }}
                          className="w-6 h-6 border border-gray-150 bg-gray-50 hover:bg-red-50 hover:text-red-650 flex items-center justify-center transition-colors text-xs font-bold rounded-lg cursor-pointer"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <span className="text-xs font-bold text-gray-800 min-w-8 text-center font-mono">
                          {item.quantity}
                        </span>

                        {/* Increment */}
                        <button
                          onClick={() => {
                            const step = item.unit === 'GRAM' ? 100 : 1;
                            onQuantityChange(item.product.id, item.quantity + step);
                          }}
                          className="w-6 h-6 border border-gray-150 bg-gray-50 hover:bg-[#2E7D32] hover:text-white flex items-center justify-center transition-colors text-xs font-bold rounded-lg cursor-pointer"
                          aria-label="Increase"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Explicit Delete Button */}
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="w-8 h-8 bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors rounded-xl cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Price total */}
                    <div className="pl-3.5 text-right flex-shrink-0 min-w-[50px]">
                      <span className="text-xs font-semibold text-[#2E7D32]">
                        {item.product.isMarketPrice ? "Market Price" : `₹${itemCost.toFixed(2)}`}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Bottom review card details */}
        <div className="px-5 pb-6 pt-2 bg-white flex flex-col gap-4 border-t border-gray-100 rounded-none">
          {/* TOTALS BLOCK with beautiful rounded corners */}
          <div className="bg-gray-50 p-4 border border-gray-150 flex flex-col gap-2 shadow-xs text-xs select-none rounded-2xl font-bold">
            <div className="flex justify-between items-center text-gray-400 font-semibold uppercase tracking-wider">
              <span>Items Total:</span>
              <span className="text-gray-800 font-mono">
                ₹{itemsTotal.toFixed(2)}
                {orderItems.some((item) => item.product.isMarketPrice) ? ' + Market Price' : ''}
              </span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-gray-400 font-bold tracking-wider uppercase">
              <span>Delivery Charge:</span>
              <span className="text-[#2E7D32] font-semibold uppercase">FREE</span>
            </div>
            <div className="h-px bg-gray-200 my-1" />
            <div className="flex justify-between items-center">
              <span className="text-gray-800 font-bold uppercase tracking-wide">GRAND TOTAL:</span>
              <span className="text-base text-orange-600 font-bold font-mono">
                ₹{grandTotal.toFixed(2)}
                {orderItems.some((item) => item.product.isMarketPrice) ? ' + Market Price' : ''}
              </span>
            </div>
          </div>

          {orderItems.some((item) => item.product.isMarketPrice) && (
            <div className="text-[10px] text-orange-600 font-semibold text-center italic mt-[-8px] px-2 leading-tight">
              * Market price items will be billed on actual daily rate at delivery
            </div>
          )}

          {/* AMBER ADVISORY BANNER - Curved edges */}
          <div className="bg-amber-50/70 border border-amber-200/50 p-3.5 flex items-start gap-2.5 rounded-2xl">
            <ShieldCheck className="w-4.5 h-4.5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-left font-semibold">
              <h4 className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">No Advance Payment Needed!</h4>
              <p className="text-[10px] text-amber-600 mt-1 leading-relaxed">
                This order is cash-on-delivery. You can easily pay with cash or compile instant UPI scans directly at physical delivery time next morning.
              </p>
            </div>
          </div>

          {/* MAIN CTA WHATSAPP ORDER PLACEMENT BUTTON - Rounded-xl */}
          <button
            onClick={onCheckout}
            disabled={orderItems.length === 0}
            className={`w-full py-3.5 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] cursor-pointer rounded-xl ${
              orderItems.length > 0
                ? 'bg-[#25D366] hover:bg-[#128C7E]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <WhatsAppIconSVG />
            <span>Place Order on WhatsApp</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
