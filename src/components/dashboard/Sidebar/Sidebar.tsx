"use client";

import logo from "@/assets/anotherLogo.png";
import Cookies from "js-cookie";
import {
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
  Percent,
  Settings,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface SidebarProps {
  onCloseClick?: () => void;
}

const Sidebar = ({ onCloseClick }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      href: "/admin/user-management",
      icon: LayoutDashboard,
      label: "User Management",
    },
    {
      href: "/admin/sales-activity",
      icon: Package,
      label: "Sales & Activity",
    },
    
    {
      href: "/admin/settings",
      icon: Settings,
      label: "Settings",
    },
  ];

  const handleLogout = () => {
    Cookies.remove("token");

    // Redirect to login page
    router.push("/login");
  };

  return (
    <div className="relative">
      <aside className="w-full lg:w-72 h-screen bg-white  flex flex-col">
        <button
          onClick={onCloseClick}
          className="absolute top-4 right-4 lg:hidden p-2 rounded-md hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo Section */}
        <div className="p-6 ">
          <div className="flex items-center justify-center">
            <Image className="w-[150px] object-contain" src={logo} alt="logo" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={index}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base  transition-colors ${
                      isActive
                        ? "bg-[#0E1826] text-white font-medium"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                    onClick={onCloseClick} // Close sidebar on mobile when clicking menu item
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
