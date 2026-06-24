import React from 'react';
import { Leaf, CheckSquare } from 'lucide-react';

export default function AboutView() {
  return (
    <div className="w-full max-w-lg md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto px-4 py-6 select-none animate-fadeIn">
      {/* Container - Modern Soft Shadow and Curved Rounded Corners */}
      <div className="bg-white border border-gray-100 p-6 md:p-8 flex flex-col gap-6 text-left shadow-sm rounded-2xl">
        
        {/* Core Header with elegant orange underline badge */}
        <div className="border-b-2 border-orange-500 pb-2">
          <h2 className="text-xl sm:text-2xl font-bold text-[#2E7D32]">
            About Parshv Foods
          </h2>
        </div>

        {/* Beautiful Representative Fresh Harvest Graphic Image Card with modern frame */}
        <div className="border border-gray-100 p-1.5 bg-gray-50 rounded-2xl overflow-hidden shadow-xs">
          <img
            src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80"
            alt="Healthy fresh produce and ingredients"
            className="w-full h-48 object-cover object-center grayscale-[5%] brightness-95 rounded-xl"
            referrerPolicy="no-referrer"
          />
          <div className="bg-white text-center py-3 px-2">
            <span className="text-xs font-medium text-gray-500 block leading-relaxed">
              Directly sourcing and delivering healthy, natural and vitamins-rich garden-fresh crops every morning at 4:00 AM
            </span>
          </div>
        </div>

        {/* Strong Intro Statement */}
        <div className="bg-green-50 border-l-4 border-[#2E7D32] p-4 rounded-r-xl">
          <p className="text-sm font-semibold text-gray-800 leading-relaxed">
            Your trusted source for fresh, high-quality vegetables.
          </p>
        </div>

        {/* Values Block */}
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-bold text-[#2E7D32] tracking-wide uppercase">
            Our Values
          </h3>
          <p className="text-xs font-medium text-gray-600 leading-relaxed">
            At Parshv Foods, we operate according to strict vegetarian principles. We do not sell onions, potatoes, garlic, or any root vegetables. Our commitment to quality and freshness guides all our business practices. Every morning at 3:30 AM, our team visits the local markets to select only the freshest produce for our customers.
          </p>
        </div>

        {/* Promise Block */}
        <div className="flex flex-col gap-2 border-t border-gray-100 pt-4">
          <h3 className="text-sm font-bold text-[#2E7D32] tracking-wide uppercase">
            Our Promise
          </h3>
          <p className="text-xs font-medium text-gray-600 leading-relaxed">
            We guarantee the quality of all our products. If you're not satisfied with any item, we'll replace it or refund your money. All our vegetables are carefully sourced to meet the highest standards of freshness and quality, hand-picked in the early hours of the morning to ensure you receive the best.
          </p>
        </div>

        {/* Why Choose Us Block with exact checklist from the image */}
        <div className="flex flex-col gap-3.5 border-t border-gray-100 pt-4">
          <h3 className="text-sm font-bold text-[#2E7D32] tracking-wide uppercase">
            Why Choose Us?
          </h3>
          <ul className="flex flex-col gap-2.5">
            <li className="flex items-start gap-2.5">
              <CheckSquare className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
              <span className="text-xs font-medium text-gray-700">100% fresh vegetable selection</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckSquare className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
              <span className="text-xs font-medium text-gray-700">Early morning market selection at 3:35 AM</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckSquare className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
              <span className="text-xs font-medium text-gray-700">No onions, potatoes, or root vegetables</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckSquare className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
              <span className="text-xs font-medium text-gray-700">Organic and pesticide-free produce</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckSquare className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
              <span className="text-xs font-medium text-gray-700">Next day delivery for all orders timing - 8AM to 11AM</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckSquare className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
              <span className="text-xs font-medium text-gray-700">Competitive prices with no hidden charges</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckSquare className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
              <span className="text-xs font-medium text-gray-700">Friendly customer service</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
