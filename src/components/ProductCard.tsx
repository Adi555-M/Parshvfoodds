import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, CheckCheck } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: React.Key | string | number;
  product: Product;
  index: number;
  quantity: number;
  unit: 'KG' | 'GRAM' | 'DOZEN';
  onQuantityChange: (qty: number) => void;
  onUnitChange: (unit: 'KG' | 'GRAM' | 'DOZEN') => void;
  isAdminMode?: boolean;
  onUpdateImage?: (productId: string, base64Data: string) => void;
  onUpdatePrice?: (productId: string, price: number) => void;
}

export default function ProductCard({
  product,
  quantity,
  unit,
  onQuantityChange,
  onUnitChange,
  isAdminMode = false,
  onUpdateImage,
  onUpdatePrice,
}: ProductCardProps) {
  const [lastAction, setLastAction] = React.useState<'added' | 'removed' | null>(null);
  const [showIndicator, setShowIndicator] = React.useState(false);
  const prevQuantityRef = React.useRef(quantity);

  // Manage Added / Removed from basket status indicator
  React.useEffect(() => {
    if (quantity > prevQuantityRef.current) {
      setLastAction('added');
      setShowIndicator(true);
    } else if (quantity < prevQuantityRef.current) {
      setLastAction('removed');
      setShowIndicator(true);
      const timer = setTimeout(() => {
        if (quantity === 0) {
          setShowIndicator(false);
        } else {
          setLastAction('added');
        }
      }, 2050);
      return () => clearTimeout(timer);
    } else if (quantity > 0) {
      setLastAction('added');
      setShowIndicator(true);
    } else {
      setShowIndicator(false);
    }
    prevQuantityRef.current = quantity;
  }, [quantity]);

  // Calculate live cost
  const liveCost = React.useMemo(() => {
    if (quantity <= 0) return 0;
    if (unit === 'GRAM') {
      return (quantity / 1000) * product.price;
    }
    return quantity * product.price;
  }, [quantity, unit, product.price]);

  // Adjust quantity increment/decrement
  const handleIncrement = () => {
    if (quantity === 0) {
      if (unit === 'GRAM') {
        onQuantityChange(250);
      } else {
        onQuantityChange(1);
      }
    } else {
      if (unit === 'GRAM') {
        onQuantityChange(quantity + 250);
      } else {
        onQuantityChange(quantity + 1);
      }
    }
  };

  const handleDecrement = () => {
    if (quantity === 0) return;
    if (unit === 'GRAM') {
      const nextQty = quantity - 250;
      onQuantityChange(nextQty <= 0 ? 0 : nextQty);
    } else {
      onQuantityChange(quantity - 1 <= 0 ? 0 : quantity - 1);
    }
  };

  const handleInputChange = (val: string) => {
    const num = parseInt(val, 10);
    if (isNaN(num) || num < 0) {
      onQuantityChange(0);
    } else {
      onQuantityChange(num);
    }
  };

  // Unit changes helper
  const handleUnitSelect = (newUnit: 'KG' | 'GRAM' | 'DOZEN') => {
    if (unit === newUnit) return;
    onUnitChange(newUnit);
    if (newUnit === 'GRAM') {
      if (quantity === 0) {
        onQuantityChange(0);
      } else if (quantity === 1) {
        onQuantityChange(1000);
      } else {
        onQuantityChange(quantity * 1000);
      }
    } else {
      if (unit === 'GRAM') {
        if (quantity === 0) {
          onQuantityChange(0);
        } else {
          onQuantityChange(Math.max(1, Math.round(quantity / 1000)));
        }
      }
    }
  };

  const getPriceLabel = () => {
    if (product.isMarketPrice) {
      return "Market Price (બજાર ભાવ)";
    }
    const unitLabel = product.baseUnit ? product.baseUnit.toLowerCase() : 'kg';
    return `₹${product.price}/${unitLabel}`;
  };

  return (
    <div
      style={{ backgroundColor: product.bgColor }}
      className="p-5 rounded-2xl border border-gray-200/80 flex flex-col justify-between shadow-xs w-full h-full relative overflow-hidden transition-all duration-300 hover:shadow-md select-none"
    >


      {/* Vegetable Icon Illustration Wrapper (Curved Circular Stamps) */}
      <div className="flex justify-center items-center py-4">
        {isAdminMode ? (
          <label className="relative cursor-pointer group block">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && onUpdateImage) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const img = new Image();
                    img.src = event.target?.result as string;
                    img.onload = () => {
                      const canvas = document.createElement('canvas');
                      const MAX_WIDTH = 300;
                      const MAX_HEIGHT = 300;
                      let width = img.width;
                      let height = img.height;

                      if (width > height) {
                        if (width > MAX_WIDTH) {
                          height = Math.round((height * MAX_WIDTH) / width);
                          width = MAX_WIDTH;
                        }
                      } else {
                        if (height > MAX_HEIGHT) {
                          width = Math.round((width * MAX_HEIGHT) / height);
                          height = MAX_HEIGHT;
                        }
                      }

                      canvas.width = width;
                      canvas.height = height;
                      const ctx = canvas.getContext('2d');
                      if (ctx) {
                        ctx.drawImage(img, 0, 0, width, height);
                        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                        onUpdateImage(product.id, compressedBase64);
                      } else {
                        onUpdateImage(product.id, event.target?.result as string);
                      }
                    };
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-green-50 flex flex-col items-center justify-center text-4xl sm:text-5xl shadow-md border-2 border-dashed border-green-500 overflow-hidden relative"
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.englishName}
                  className="w-full h-full object-cover rounded-2xl opacity-75 group-hover:opacity-40 transition-opacity"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="opacity-75 group-hover:opacity-40 transition-opacity">{product.emoji}</span>
              )}
              {/* Camera Icon Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                <span className="text-[9px] text-white font-black tracking-widest uppercase">Upload</span>
                <span className="text-[8px] text-green-300 font-bold uppercase mt-0.5">Photo</span>
              </div>
            </motion.div>
          </label>
        ) : (
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-[#EAF6EA] flex items-center justify-center text-4xl sm:text-5xl shadow-sm border border-[#C8EBC8]/30 overflow-hidden"
          >
            {product.image ? (
              <img
                src={product.image}
                alt={product.englishName}
                className="w-full h-full object-cover rounded-2xl"
                referrerPolicy="no-referrer"
              />
            ) : (
              product.emoji
            )}
          </motion.div>
        )}
      </div>

      {/* Main product identifiers - min-h guarantees alignment across grids */}
      <div className="text-left w-full mt-1 min-h-[76px] flex flex-col justify-end">
        <h3 className="text-lg font-bold text-gray-800 leading-none">
          {product.gujaratiName}
        </h3>
        <p className="text-xs text-gray-400 font-medium mt-1">
          ({product.englishName})
        </p>
        {isAdminMode ? (
          <div className="mt-1 flex items-center gap-1">
            <span className="text-xs font-bold text-gray-500">Price: ₹</span>
            <input
              type="number"
              value={product.price}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val >= 0) {
                  onUpdatePrice?.(product.id, val);
                } else if (e.target.value === '') {
                  onUpdatePrice?.(product.id, 0);
                }
              }}
              className="w-16 px-1 py-0.5 text-xs font-bold text-[#2E7D32] bg-green-50 border border-green-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            <span className="text-[10px] font-semibold text-gray-400">
              /{product.baseUnit.toLowerCase()}
            </span>
          </div>
        ) : (
          <span className="inline-block mt-2 font-bold text-xs text-[#2E7D32]">
            {getPriceLabel()}
          </span>
        )}
      </div>

      {/* Controls box (strictly curved borders) */}
      <div className="mt-4 w-full flex flex-col gap-2">
        <div className="w-full bg-white rounded-xl px-1.5 py-1.5 border border-gray-200 flex items-center justify-between shadow-sm">
          {/* Minus control */}
          <button
            onClick={handleDecrement}
            disabled={quantity === 0}
            className={`w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center transition-colors text-base font-semibold select-none ${
              quantity > 0
                ? 'bg-gray-50 text-gray-700 hover:bg-[#2E7D32] hover:text-white hover:border-[#2E7D32] active:scale-95'
                : 'bg-gray-50/50 text-gray-350 cursor-not-allowed border-gray-100'
            }`}
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          {/* Core quantity input */}
          <div className="flex-1 px-1 text-center min-w-[40px]">
            <input
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              value={quantity}
              onChange={(e) => handleInputChange(e.target.value)}
              className="w-full font-bold text-center text-gray-800 text-sm bg-transparent border-none outline-none p-0 focus:ring-0"
            />
          </div>

          {/* Plus control */}
          <button
            onClick={handleIncrement}
            className="w-8 h-8 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 hover:bg-[#2E7D32] hover:text-white hover:border-[#2E7D32] flex items-center justify-center transition-all text-base font-semibold select-none active:scale-95"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Row 2: Unit Segment Selector Tabs (Curved & High contrast) */}
        <div className="w-full grid grid-cols-2 border border-gray-200 bg-white shadow-xs divide-x divide-gray-200 overflow-hidden rounded-xl select-none">
          <button
            type="button"
            onClick={() => handleUnitSelect(product.availableUnits[0] as 'KG' | 'GRAM' | 'DOZEN')}
            className={`py-1.5 text-center text-xs font-semibold transition-all cursor-pointer ${
              unit === product.availableUnits[0]
                ? 'bg-[#2E7D32] text-white'
                : 'bg-white text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            {product.availableUnits[0]}
          </button>
          <button
            type="button"
            onClick={() => handleUnitSelect(product.availableUnits[1] as 'KG' | 'GRAM' | 'DOZEN')}
            className={`py-1.5 text-center text-xs font-semibold transition-all cursor-pointer ${
              unit === product.availableUnits[1]
                ? 'bg-[#2E7D32] text-white'
                : 'bg-white text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            {product.availableUnits[1]}
          </button>
        </div>
      </div>

      {/* Live dynamic cost block */}
      <div className="mt-3 flex items-center justify-between text-xs px-1 select-none">
        <span className="text-gray-400 font-medium tracking-wider text-[10px]">LIVE COST</span>
        <span className="text-sm text-[#2E7D32] font-bold">
          {product.isMarketPrice ? "Market Price" : `₹${liveCost.toFixed(2)}`}
        </span>
      </div>

      {/* Expands smoothly ONLY when active to maintain layout consistency */}
      <AnimatePresence initial={false}>
        {showIndicator && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 32, opacity: 1, marginTop: 10 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.25 }}
            className="relative overflow-hidden w-full h-8"
          >
            {lastAction === 'added' ? (
              <div className="absolute inset-0 bg-white border border-green-200 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold text-[#2E7D32] shadow-xs select-none">
                <CheckCheck className="w-3.5 h-3.5 text-emerald-500" /> Added!
              </div>
            ) : lastAction === 'removed' ? (
              <div className="absolute inset-0 bg-white border border-red-200 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold text-red-600 shadow-xs select-none">
                <Minus className="w-3.5 h-3.5 text-red-400" /> Removed!
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
