import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Menu,
  X,
  GraduationCap,
  ClipboardList,
} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    description: "Overview & stats",
  },
  {
    label: "Applications",
    href: "/admin/applications",
    icon: ClipboardList,
    description: "Review submissions",
  },
  {
    label: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
    description: "Analytics & exports",
  },
];

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + "/");

  const SidebarNav = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex flex-col gap-1 p-3">
      {navItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
              active
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-900/40"
                : "text-emerald-50/80 hover:bg-white/10 hover:text-white"
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight">{item.label}</p>
              <p
                className={cn(
                  "text-xs truncate",
                  active ? "text-emerald-100" : "text-emerald-200/50"
                )}
              >
                {item.description}
              </p>
            </div>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-5rem)] bg-slate-50 print:min-h-0 print:bg-white">
      {/* Desktop sidebar — fixed to viewport */}
      <aside className="hidden lg:flex fixed left-0 top-16 lg:top-20 z-40 h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] w-64 flex-col border-r border-emerald-900/20 bg-gradient-to-b from-emerald-800 via-teal-800 to-teal-900 print:hidden">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/20">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">Admin Panel</p>
            <p className="text-xs text-emerald-100/70">Online Registration</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarNav />
        </div>
        <div className="mt-auto p-4 border-t border-white/10 shrink-0">
          <div className="rounded-xl bg-white/10 backdrop-blur-sm p-3 flex items-start gap-2 ring-1 ring-white/10">
            <FileText className="h-4 w-4 text-emerald-200 mt-0.5 shrink-0" />
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Review pending applications and print reports from the sidebar.
            </p>
          </div>
        </div>
      </aside>

      {/* Main — offset for fixed sidebar on desktop */}
      <div className="lg:pl-64 min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-16 z-30 flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 print:hidden">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <span className="font-semibold text-sm text-slate-800">
              Admin Panel
            </span>
          </div>
          <span className="text-xs text-slate-500 truncate">
            {navItems.find((i) => isActive(i.href))?.label ?? "Admin"}
          </span>
        </div>

        <Outlet />
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-gradient-to-b from-emerald-800 via-teal-800 to-teal-900 shadow-xl lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center ring-1 ring-white/20">
                    <GraduationCap className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">Admin Panel</p>
                    <p className="text-xs text-emerald-100/70">Irshaad School</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl text-white hover:bg-white/10 hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <SidebarNav onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLayout;
