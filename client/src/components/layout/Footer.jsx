import React from "react";
import { Mail, BookOpen, Instagram, Youtube, Send } from "lucide-react";

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

        {/* Contact + Social */}
        <div className="bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-lg text-center md:text-left">

          <h3 className="font-semibold mb-3 text-base">Connect With Us</h3>

          {/* Email */}
          <a
            href="mailto:help.rohitacademy@gmail.com"
            className="flex items-center justify-center md:justify-start gap-3 text-gray-600 hover:text-blue-600 transition"
          >
            <Mail size={18} className="text-blue-600" />
            help.rohitacademy@gmail.com
          </a>

          {/* Social Links */}
          <div className="flex items-center justify-center md:justify-start gap-5 mt-4">

            <a
              href="https://www.instagram.com/rohitacademy1234?igsh=MWJmYXN1b3hyaXc1Yg=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-pink-600 transition"
            >
              <Instagram size={20} />
            </a>

            <a
              href="https://youtube.com/@rohitacademy1234?si=Brwm5lBxX6Rfzr_-"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-red-600 transition"
            >
              <Youtube size={20} />
            </a>

            <a
              href="https://t.me/RohitAcademy1234"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-500 transition"
            >
              <Send size={20} />
            </a>

          </div>

          <p className="text-gray-400 text-xs mt-4">
            Follow us for updates & study resources
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
