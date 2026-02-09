import React from "react";
import { Mail, Phone, BookOpen } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-white border-t mt-14">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10 text-sm">

        {/* Brand */}
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold text-blue-600 mb-3 flex items-center gap-2 justify-center md:justify-start">
            <BookOpen size={20} /> Rohit Academy
          </h2>

          <p className="text-gray-600 leading-relaxed">
            Notes, Sample Papers & Previous Year Questions for Classes 9–12.
            Simple learning. Instant downloads.
          </p>

          <p className="text-xs text-gray-400 mt-3">
            Login via OTP • Instant PDF Access
          </p>
        </div>

        {/* Contact */}
        <div className="bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-lg text-center md:text-left">
          <h3 className="font-semibold mb-3 text-base">Contact</h3>

          <p className="flex items-center justify-center md:justify-start gap-3 text-gray-600">
            <Mail size={18} className="text-blue-600" />
            support@rohitacademy.com
          </p>

          <p className="flex items-center justify-center md:justify-start gap-3 text-gray-600 mt-2">
            <Phone size={18} className="text-blue-600" />
            +91 00000 00000
          </p>

          <p className="text-gray-400 text-xs mt-3">
            Support available 10 AM – 7 PM
          </p>
        </div>
      </div>

      <div className="text-center text-gray-400 text-xs py-4 border-t mt-8">
        © {new Date().getFullYear()} Rohit Academy. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
