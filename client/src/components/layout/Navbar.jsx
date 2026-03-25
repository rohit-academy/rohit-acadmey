import React, { useEffect, useState } from "react";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import { useAuth } from "../../context/AuthContext";

function Navbar() {

  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* 📱 DEVICE DETECT (real render control) */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();

    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* 🔽 SCROLL EFFECT */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (

    <header
      className={`
        sticky top-0 z-50 border-b transition-all duration-300
        ${scrolled
          ? "bg-white/80 backdrop-blur-md shadow-md"
          : "bg-white shadow-sm"}
      `}
    >

      {/* ✅ Render only one navbar */}
      {isMobile ? (
        <MobileNavbar user={user || null} />
      ) : (
        <DesktopNavbar user={user || null} />
      )}

    </header>

  );
}

export default React.memo(Navbar);