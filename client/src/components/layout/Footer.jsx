import React from "react";
import { Mail, BookOpen, Instagram, Youtube, Send, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white to-slate-50 border-t mt-16">

      <div className="container mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-3 gap-10 text-sm">

        {/* 🟦 Brand Section */}
        <div>
          <h2 className="text-2xl font-bold text-blue-600 mb-4 flex items-center gap-2">
            <BookOpen size={22} />
            Rohit Academy
          </h2>

          <p className="text-gray-600 leading-relaxed">
            Notes, Sample Papers & Previous Year Questions for Classes 9–12.
            Designed for focused students who want results.
          </p>

          <p className="text-xs text-gray-400 mt-4">
            Login via OTP • Instant PDF Access • Secure Checkout
          </p>
        </div>

        {/* 🟩 Quick Links */}
        <div>
          <h3 className="font-semibold text-base mb-4">Quick Links</h3>

          <div className="flex flex-col gap-3 text-gray-600">

            <Link
              to="/"
              className="flex items-center gap-2 hover:text-blue-600 transition"
            >
              <ArrowRight size={14} />
              Home
            </Link>

            <Link
              to="/classes"
              className="flex items-center gap-2 hover:text-blue-600 transition"
            >
              <ArrowRight size={14} />
              Browse Classes
            </Link>

            <Link
              to="/downloads"
              className="flex items-center gap-2 hover:text-blue-600 transition"
            >
              <ArrowRight size={14} />
              My Downloads
            </Link>

            <Link
              to="/login"
              className="flex items-center gap-2 hover:text-blue-600 transition"
            >
              <ArrowRight size={14} />
              Student Login
            </Link>

          </div>
        </div>

        {/* 🟨 Contact & Social */}
        <div>
          <h3 className="font-semibold text-base mb-4">Connect With Us</h3>

          {/* Email */}
          <a
            href="mailto:help.rohitacademy@gmail.com"
            className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition mb-4"
          >
            <Mail size={18} className="text-blue-600" />
            help.rohitacademy@gmail.com
          </a>

          {/* Social Icons */}
          <div className="flex items-center gap-4">

            <a
              href="https://www.instagram.com/rohitacademy1234?igsh=MWJmYXN1b3hyaXc1Yg=="
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white border rounded-full shadow-sm hover:shadow-md hover:scale-105 transition"
            >
              <Instagram size={18} className="text-pink-600" />
            </a>

            <a
              href="https://youtube.com/@rohitacademy1234?si=Brwm5lBxX6Rfzr_-"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white border rounded-full shadow-sm hover:shadow-md hover:scale-105 transition"
            >
              <Youtube size={18} className="text-red-600" />
            </a>

            <a
              href="https://t.me/RohitAcademy1234"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white border rounded-full shadow-sm hover:shadow-md hover:scale-105 transition"
            >
              <Send size={18} className="text-blue-500" />
            </a>

          </div>

          <p className="text-xs text-gray-400 mt-4">
            Follow us for updates, syllabus alerts & free study resources.
          </p>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t bg-white/60 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-5 text-center text-gray-500 text-xs">
          © {new Date().getFullYear()} Rohit Academy. All rights reserved.
        </div>
      </div>

    </footer>
  );
}

export default Footer;
