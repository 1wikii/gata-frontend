"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/ui/Navbar";
import SideBar from "@/components/ui/sideBar";
import { useAuth } from "@/hooks/useAuth";
import { useFinalProjectHistory } from "@/hooks/useFinalProjectHistory";

export default function Navigation({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const { hasHistory, isCheckingHistory } = useFinalProjectHistory();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-auto">
      <div className="min-h-screen grid grid-cols-[auto_1fr]">
        <SideBar
          userRole={isHydrated && !isLoading ? user?.role || "" : ""}
          isMobileOpen={isMobileOpen}
          onMobileClose={closeMobileMenu}
          hasHistory={hasHistory}
          isCheckingHistory={isCheckingHistory}
        />
        <div className="min-h-screen col-span-2 lg:col-span-1 ">
          <Navbar onMenuClick={toggleMobileMenu} isMobileOpen={isMobileOpen} />
          <main className="min-h-screen p-6 bg-gray-100">{children}</main>
        </div>
      </div>
    </div>
  );
}
