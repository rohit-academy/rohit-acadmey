import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";

function Navbar() {
  return (
    <>
      <div className="hidden md:block">
        <DesktopNavbar />
      </div>

      <div className="block md:hidden">
        <MobileNavbar />
      </div>
    </>
  );
}

export default Navbar;
