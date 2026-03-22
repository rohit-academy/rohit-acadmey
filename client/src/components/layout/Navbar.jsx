import React from "react";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import { useAuth } from "../../context/AuthContext";

function Navbar() {

  const { user } = useAuth();

  return (

    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">

      {/* =========================
          DESKTOP NAVBAR
      ========================= */}
      <div className="hidden md:block">
        <DesktopNavbar user={user} />
      </div>

      {/* =========================
          MOBILE NAVBAR
      ========================= */}
      <div className="block md:hidden">
        <MobileNavbar user={user} />
      </div>

    </header>

  );
}

export default Navbar;