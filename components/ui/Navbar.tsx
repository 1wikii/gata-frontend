"use client";

import React, { useState } from "react";
import { Bell, User, Menu, X, ChevronDown, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/utils/api";
import { NAV_TITLE, NAV_SUBTITLE } from "@/constants/navbar";
import { usePathname } from "next/navigation";

interface NavbarProps {
  onMenuClick: () => void;
  isMobileOpen: boolean;
}

const Navbar = ({ onMenuClick, isMobileOpen }: NavbarProps) => {
  const { logout, user } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const pathname = usePathname();
  const firstPathSegment = pathname.split("/")[1];
  const secondPathSegment = pathname.split("/")[2];

  async function handleLogout() {
    const logoutReq = await api.post("/auth/logout", {});

    if (logoutReq.status === 200) {
      logout();
    }
  }

  const handleProfileClick = () => {
    let prefix = "/";
    if (user?.role === "admin") {
      prefix = "/admin";
    } else if (user?.role === "lecturer") {
      prefix = "/dosen";
    } else {
      prefix = "/mahasiswa";
    }
    window.location.href = `${prefix}/profile`;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="flex items-center">
        {/* Left side - Menu button and title */}
        <div className="flex items-center space-x-4 self-start">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Title and Subtitle */}
        <div className="flex flex-col justify-start ms-2">
          <h1 className="text-2xl font-bold text-gray-800">
            {(NAV_TITLE[firstPathSegment as keyof typeof NAV_TITLE] &&
              NAV_TITLE.mahasiswa[
                secondPathSegment as keyof typeof NAV_TITLE.mahasiswa
              ]) ||
              ""}
          </h1>
          <p className="text-sm text-gray-500">
            {(NAV_SUBTITLE[firstPathSegment as keyof typeof NAV_SUBTITLE] &&
              NAV_SUBTITLE.mahasiswa[
                secondPathSegment as keyof typeof NAV_SUBTITLE.mahasiswa
              ]) ||
              ""}
          </p>
        </div>

        {/* Right side - Notifications and user menu */}
        <div className="flex items-center space-x-3 self-end ml-auto">
          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <ChevronDown size={16} className="text-gray-600" />
            </button>

            {/* User dropdown */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.role === "admin"
                      ? "Admin"
                      : user?.role === "lecturer"
                      ? "Dosen"
                      : "Mahasiswa"}
                  </p>
                </div>
                <button
                  onClick={handleProfileClick}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2 cursor-pointer"
                >
                  <User size={16} />
                  <span>Profile</span>
                </button>
                <hr className="my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
