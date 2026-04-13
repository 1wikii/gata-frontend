"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Home,
  FileText,
  Users,
  Calendar,
  Star,
  HelpCircle,
  Mail,
  ChevronDown,
  Settings,
} from "lucide-react";
import { SIDEBAR_MENU } from "@/constants/navbar";

interface SideBarProps {
  userRole: "student" | "lecturer" | "admin";
  isMobileOpen: boolean;
  onMobileClose: () => void;
  hasHistory: boolean | null;
  isCheckingHistory: boolean;
}

type ExpandedMenus = { [key: string]: boolean };

type MenuItemType = {
  icon?: React.ElementType;
  label?: string;
  path?: string | null;
  hasSubmenu?: boolean;
  submenu?: { label: string; path: string | null }[];
  section?: string;
};

const SideBar = ({
  userRole,
  isMobileOpen,
  onMobileClose,
  hasHistory,
  isCheckingHistory,
}: SideBarProps) => {
  const [expandedMenus, setExpandedMenus] = useState<ExpandedMenus>({});
  const [activePath, setActivePath] = useState<string | null>(null);

  // keys for localStorage (namespaced by role)
  const EXPANDED_KEY = `sidebar_expanded_${userRole}`;
  const ACTIVE_KEY = `sidebar_active_${userRole}`;

  // Menu configurations for different roles
  const menuConfigs = SIDEBAR_MENU;

  const supportMenus: MenuItemType[] = [
    { icon: HelpCircle, label: "Panduan", path: "/panduan" },
    { icon: Mail, label: "Kontak", path: "/kontak" },
  ];

  const currentMenus: MenuItemType[] = menuConfigs[userRole] || [];

  // Filter menus based on hasHistory for student role
  const filteredMenus = useMemo(() => {
    if (userRole !== "student" || isCheckingHistory) {
      return currentMenus;
    }

    // If user is a student and doesn't have history, hide these menus
    if (hasHistory === false) {
      return currentMenus.filter(
        (menu) =>
          menu.label !== "Bimbingan" &&
          menu.label !== "Pendaftaran Sidang" &&
          menu.label !== "Penilaian" &&
          menu.label !== "Hasil Sidang"
      );
    }

    // If user has history, show all menus
    return currentMenus;
  }, [currentMenus, userRole, hasHistory, isCheckingHistory]);

  const getRoleTitle = (role: string) => {
    const roleTitles: { [key: string]: string } = {
      student: "Mahasiswa",
      lecturer: "Dosen",
      admin: "Admin",
    };
    return roleTitles[role];
  };

  // load persisted state from localStorage on mount
  useEffect(() => {
    try {
      // Always set activePath from current URL
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        setActivePath(currentPath);
        localStorage.setItem(ACTIVE_KEY, currentPath);
      }

      // Load expanded menus state
      const rawExpanded = localStorage.getItem(EXPANDED_KEY);
      if (rawExpanded) {
        const parsed = JSON.parse(rawExpanded);
        setExpandedMenus(parsed);
      }

      // Auto-expand menu if current path matches a submenu item
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        const newExpanded: ExpandedMenus = { ...expandedMenus };

        filteredMenus.forEach((menu, index) => {
          if (
            menu.submenu &&
            menu.submenu.some((sub) => sub.path === currentPath)
          ) {
            newExpanded[index] = true;
          }
        });

        setExpandedMenus(newExpanded);
      }
    } catch (e) {
      // ignore parse errors
      if (typeof window !== "undefined") {
        setActivePath(window.location.pathname);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]);

  // persist expandedMenus when it changes
  useEffect(() => {
    try {
      localStorage.setItem(EXPANDED_KEY, JSON.stringify(expandedMenus));
    } catch (e) {
      // ignore
    }
  }, [expandedMenus, EXPANDED_KEY]);

  // persist activePath when it changes
  useEffect(() => {
    try {
      if (activePath) localStorage.setItem(ACTIVE_KEY, activePath);
    } catch (e) {
      // ignore
    }
  }, [activePath, ACTIVE_KEY]);

  const toggleSubmenu = (index: number | string) => {
    setExpandedMenus((prev: ExpandedMenus) => {
      const next = {
        ...prev,
        [index]: !prev[index],
      };
      try {
        localStorage.setItem(EXPANDED_KEY, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // When user clicks a menu item:
  // - if path null => toggle submenu
  // - if path string => set activePath (persisted) then navigate (causes reload)

  const onMenuClick = (item: MenuItemType, index: number | string) => {
    // Skip if this is a section header
    if ("section" in item && item.section) {
      return;
    }

    if (item.path) {
      // set active path BEFORE navigation so localStorage will contain it
      try {
        setActivePath(item.path);
        localStorage.setItem(ACTIVE_KEY, item.path);
      } catch (e) {}
      // navigate (will reload the page)
      window.location.href = item.path;
      onMobileClose(); // Close mobile sidebar on navigation
    } else {
      // toggle submenu
      toggleSubmenu(index);
    }
  };

  const onSubmenuClick = (subItemPath: string | null) => {
    const path = subItemPath || "/";
    try {
      setActivePath(path);
      localStorage.setItem(ACTIVE_KEY, path);
    } catch (e) {}
    window.location.href = path;
    onMobileClose(); // Close mobile sidebar on navigation
  };

  const isItemActive = (item: MenuItemType): boolean => {
    // Skip if this is a section header
    if ("section" in item && item.section) {
      return false;
    }

    // Get current path from browser
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : activePath;

    // Check if item's direct path matches
    if (item.path && item.path === currentPath) return true;

    // Check if any submenu path matches current path
    if (item.submenu && item.submenu.some((s) => s.path === currentPath)) {
      return true;
    }

    return false;
  };

  const MenuItem = ({
    item,
    index,
    isSupport = false,
  }: {
    item: MenuItemType;
    index: number | string;
    isSupport?: boolean;
  }) => {
    const hasSubmenu = item.hasSubmenu && item.submenu;
    const isExpanded = !!expandedMenus[index];
    const active = isItemActive(item);

    return (
      <div>
        <button
          onClick={() => onMenuClick(item, index)}
          className={`h-full w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-colors cursor-pointer ${
            isSupport
              ? "text-blue-200 hover:bg-blue-700/50 hover:text-white"
              : active
              ? "bg-white/10 text-white" // highlighted
              : "text-white hover:bg-blue-700"
          }`}
        >
          <div className="flex items-center space-x-3">
            {item.icon && <item.icon size={20} />}
            <span className="font-medium">{item.label}</span>
          </div>
          {hasSubmenu && (
            <ChevronDown
              size={16}
              className={`transform transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          )}
        </button>

        {/* Submenu */}
        {hasSubmenu && isExpanded && item.submenu && (
          <div className="ml-4 mt-2 space-y-1">
            {item.submenu.map((subItem, subIndex) => {
              const subActive = subItem.path === activePath;
              return (
                <button
                  onClick={() => onSubmenuClick(subItem.path)}
                  key={subIndex}
                  className={`w-full text-left px-6 py-2 rounded-lg transition-colors text-sm cursor-pointer ${
                    subActive
                      ? "bg-white/10 text-white"
                      : "text-blue-200 hover:text-white hover:bg-blue-700/50"
                  }`}
                >
                  {subItem.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-blue-600 to-blue-700 transform transition-transform duration-300 z-50 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Header */}
        <div className="flex items-center px-6 py-4 border-b border-blue-500/30">
          <div className="flex items-center space-x-3">
            <a href="/" className="cursor-pointer">
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`}
                alt="Logo"
                width={50}
                height={50}
              />
            </a>
            <div>
              <h2 className="text-white font-bold text-lg">
                {getRoleTitle(userRole)}
              </h2>
              <a href="/" className="text-blue-200 text-xs cursor-pointer">
                GATA
              </a>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {/* Main menus */}
          {filteredMenus.map((item, index) => {
            // If item has section property, render section header
            if ("section" in item && item.section) {
              return (
                <div key={`section-${index}`} className="pt-4">
                  <div className="px-4 pb-2">
                    <p className="text-blue-300 text-xs font-semibold uppercase tracking-wider">
                      {item.section}
                    </p>
                  </div>
                </div>
              );
            }
            // Otherwise render menu item normally
            return <MenuItem key={index} item={item} index={index} />;
          })}

          {/* Support section */}
          <div className="pt-6">
            <div className="px-4 pb-2">
              <p className="text-blue-300 text-xs font-semibold uppercase tracking-wider">
                BANTUAN
              </p>
            </div>
            {supportMenus.map((item, index) => (
              <MenuItem
                key={`support-${index}`}
                item={item}
                index={`support-${index}`}
                isSupport
              />
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
};

export default SideBar;
