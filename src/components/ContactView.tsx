import React from 'react';
import { MessageSquare, MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function ContactView() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [message, setMessage] = React.useState('');

  const handleJoinGroup = () => {
    const text = encodeURIComponent('Hello! I would like to join the Parshv Foods daily broadcasts list to receive morning prices.');
    window.open(`https://wa.me/916355532061?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      alert('Please fill out Name, Phone, and your Message!');
      return;
    }
    const lines = [
      '🌿 *New Contact Submission via Website* 🌿',
      '',
      `👤 *Name:* ${name.trim()}`,
      `📧 *Email:* ${email.trim() || 'Not provided'}`,
      `📞 *Phone:* ${phone.trim()}`,
      `💬 *Message:* ${message.trim()}`,
    ];
    const encoded = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/916355532061?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full max-w-lg md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto px-4 py-6 select-none">
      {/* Outer wrapper: Strictly Curved corners, elegant elements */}
      <div className="bg-white border border-gray-100 p-6 md:p-8 flex flex-col gap-6 text-left shadow-sm rounded-2xl">
        
        {/* Header with thick Orange underline */}
        <div className="border-b-2 border-orange-500 pb-2">
          <h2 className="text-xl sm:text-2xl font-bold text-[#2E7D32]">
            Contact Us
          </h2>
          <p className="text-xs font-semibold text-gray-500 mt-1">
            Have questions or feedback? We'd love to hear from you!
          </p>
        </div>

        {/* 1. Green stay-updated with us on WhatsApp container info block */}
        <div className="bg-[#EAF6EA]/70 border border-[#C8EBC8]/50 p-4 flex flex-col gap-3 rounded-2xl">
          <div>
            <h3 className="text-sm font-bold text-[#2E7D32] uppercase tracking-wide block">
              Stay Updated with Us on WhatsApp
            </h3>
            <p className="text-xs font-medium text-gray-650 mt-1">
              Get daily prices and important announcements directly on WhatsApp.
            </p>
          </div>
          <a
            href="https://chat.whatsapp.com/IRGtdbu8u7q2Ur8JktLpUh"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto self-start px-5 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer rounded-xl flex items-center justify-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4 text-white" />
            <span>Join WhatsApp Group</span>
          </a>
        </div>

        {/* 2. Descriptive Contact Information cards row */}
        <div className="flex flex-col gap-4 border-t border-gray-100 pt-5">
          {/* Address */}
          <div className="flex items-center gap-4.5 bg-gray-50/50 hover:bg-gray-50/80 p-3.5 border border-gray-200/60 rounded-2xl transition-all">
            <div className="w-12 h-12 bg-orange-100/50 border border-orange-200/40 text-orange-600 flex items-center justify-center shrink-0 rounded-xl">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block mb-0.5">Primary Location</span>
              <span className="text-sm font-semibold text-gray-800 block">Sanghvi Tower, Surat, Gujarat</span>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-4.5 bg-gray-50/50 hover:bg-gray-50/80 p-3.5 border border-gray-200/60 rounded-2xl transition-all">
            <div className="w-12 h-12 bg-emerald-100/50 border border-emerald-200/40 text-emerald-600 flex items-center justify-center shrink-0 rounded-xl">
              <Phone className="w-5.5 h-5.5 animate-bounce" style={{ animationDuration: '3s' }} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">Call or WhatsApp Helpline</span>
              <span className="text-sm font-bold font-mono text-gray-800 block">+91 6355532061</span>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-4.5 bg-gray-50/50 hover:bg-gray-50/80 p-3.5 border border-gray-200/60 rounded-2xl transition-all">
            <div className="w-12 h-12 bg-red-100/50 border border-red-200/40 text-red-500 flex items-center justify-center shrink-0 rounded-xl">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block mb-1">Email Support</span>
              <span className="text-sm font-bold text-gray-800 block">parshvfoods@gmail.com</span>
            </div>
          </div>

          {/* Hours */}
          <div className="flex items-center gap-4.5 bg-gray-50/50 hover:bg-gray-50/80 p-3.5 border border-gray-200/60 rounded-2xl transition-all">
            <div className="w-12 h-12 bg-teal-100/50 border border-teal-200/40 text-[#2E7D32] flex items-center justify-center shrink-0 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#2E7D32] uppercase tracking-wider block mb-1">Surat Morning Delivery Slot</span>
              <span className="text-sm font-bold text-[#2E7D32] block">8:00 AM – 11:00 AM Daily</span>
            </div>
          </div>
        </div>

        {/* 3. HTML Contact Form - Curved edges input */}
        <form onSubmit={handleSendMessage} className="flex flex-col gap-4 border-t border-gray-100 pt-5">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
            Send Message Instantly
          </h3>

          {/* Name Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Your Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Mukesh Bhai"
              className="w-full bg-gray-50 text-gray-800 border border-gray-200 px-3 py-2.5 text-xs font-semibold leading-tight outline-none focus:border-[#2E7D32] md:p-3 rounded-xl focus:bg-white transition-all"
            />
          </div>

          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Your Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. mukesh@example.com (optional)"
              className="w-full bg-gray-50 text-gray-800 border border-gray-200 px-3 py-2.5 text-xs font-semibold leading-tight outline-none focus:border-[#2E7D32] md:p-3 rounded-xl focus:bg-white transition-all"
            />
          </div>

          {/* Phone Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Your Phone Number <span className="text-red-500">*</span></label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="e.g. +91 98765 43210"
              className="w-full bg-gray-50 text-gray-800 border border-gray-200 px-3 py-2.5 text-xs font-semibold leading-tight outline-none focus:border-[#2E7D32] md:p-3 rounded-xl focus:bg-white transition-all"
            />
          </div>

          {/* Message Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Your Message <span className="text-red-500">*</span></label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              placeholder="Write your customized morning vegetable order list or enquire generic details here..."
              className="w-full bg-gray-50 text-gray-800 border border-gray-200 px-3 py-2.5 text-xs font-semibold leading-relaxed outline-none focus:border-[#2E7D32] md:p-3 rounded-xl focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest transition-all active:scale-[0.98] select-none cursor-pointer rounded-xl flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4 text-white" />
            <span>Send via WhatsApp</span>
          </button>
        </form>
      </div>
    </div>
  );
}
