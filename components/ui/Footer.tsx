import NavbarFooterButton from "./NavbarFooterButton";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="py-4 padding-container bg-primary shadow-lg">
      <div className="flex justify-between text-white">
        {/* Left side - Copyright */}
        <p className="font-bold">
          &copy;Copyright 2025 - Program Studi Teknik Informatika ITERA
        </p>

        {/* Right side - social media */}
        <div className="flex items-center space-x-4">
          <NavbarFooterButton className="text-xl">
            <MdOutlineEmail />
          </NavbarFooterButton>

          <NavbarFooterButton className="text-xl">
            <FaInstagram />
          </NavbarFooterButton>

          <NavbarFooterButton className="text-xl">
            <FaFacebook />
          </NavbarFooterButton>
        </div>
      </div>
    </footer>
  );
}
