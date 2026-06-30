import React from 'react';
import { motion } from 'motion/react';
import { Leaf } from 'lucide-react';
import heroLogo from '../assets/images/regenerated_image_1781430026139.jpg';

interface HeroProps {
  onOrderNowClick: () => void;
}

export default function Hero({ onOrderNowClick }: HeroProps) {
  const [logoError, setLogoError] = React.useState(false);

  return (
    <section id="home" className="px-4 py-5 max-w-lg md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto">
      {/* Outer wrapper: White card frame with rounded corners and thin border matching the screenshot */}
      <div className="bg-white border border-gray-200/60 p-4 sm:p-5 rounded-[2rem] shadow-xs">
        
        {/* Inner container with light green background and rounded corners */}
        <div className="w-full bg-[#EAF6EA]/70 border border-[#C8EBC8]/30 px-6 py-12 md:py-16 flex flex-col items-center text-center relative overflow-hidden rounded-[1.5rem]">

          {/* Circular Logo Badge (Perfect match with the uploaded screenshot) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative w-24 h-24 rounded-full border-2 border-white shadow-md overflow-hidden bg-white mb-6 active:scale-95 transition-transform flex items-center justify-center shrink-0 p-1 z-10"
          >
            {!logoError ? (
              <img
                src={heroLogo}
                alt="Parshv Foods"
                className="w-full h-full object-cover rounded-full"
                onError={() => setLogoError(true)}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-white p-3 text-[#2E7D32]">
                <Leaf className="w-8 h-8 mb-0.5 text-[#2E7D32]" />
                <span className="font-extrabold text-[10px] tracking-wide text-gray-700">Parshv Foods</span>
              </div>
            )}
          </motion.div>

          {/* Hero Title with matching font color (all dark charcoal, no split green color) */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#2C3E50] max-w-xl md:max-w-2xl leading-tight tracking-tight z-10"
          >
            Fresh Vegetables <br />
            Delivered
          </motion.h1>

          {/* Subtext matching the exact wording and styling (no trailing period) */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-gray-600 font-medium text-xs sm:text-sm md:text-base mt-4 max-w-md sm:max-w-lg leading-relaxed z-10"
          >
            Farm-fresh, organic produce at affordable prices with free delivery in your area
          </motion.p>

          {/* Orange Order Now Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-8 z-10"
          >
            <button
              onClick={onOrderNowClick}
              className="px-10 py-3.5 bg-[#FF9800] hover:bg-[#F57C00] text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer rounded-xl"
            >
              Order Now
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
