"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  Heart,
  Image,
  MessageSquare,
  Globe,
  Calendar,
  BookOpen,
  Briefcase,
  Database,
  ChevronRight,
  UserCheck,
  ShieldCheck,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTranslations, useLocale } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const t = useTranslations("admin");
  const { user, isAuthenticated, isAdmin, logout, isLoading } = useAuth();

  const switchLocale = (newLocale: string) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
    window.location.reload();
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && !isLoading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [hasMounted, isLoading, isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  // All nav items — no admin-only items here anymore
  const sidebarItems = [
    { name: t("sidebar.dashboard"), href: "/admin/dashboard", icon: LayoutDashboard },
    { name: t("sidebar.news"), href: "/admin/news", icon: FileText },
    { name: t("sidebar.events"), href: "/admin/events", icon: Calendar },
    { name: t("sidebar.publications"), href: "/admin/publications", icon: BookOpen },
    { name: t("sidebar.multimedia"), href: "/admin/multimedia", icon: Image },
    { name: t("sidebar.projects"), href: "/admin/projects", icon: Briefcase },
    { name: t("sidebar.resources"), href: "/admin/resources", icon: Database },
    { name: t("sidebar.governance"), href: "/admin/governance", icon: UserCheck },
    { name: t("sidebar.donations"), href: "/admin/donations", icon: Heart },
    { name: t("sidebar.contacts"), href: "/admin/contacts", icon: MessageSquare },
  ];

  const userInitials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : "??";

  const SidebarContent = (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-300 border-r border-slate-800">
      {/* Logo & Brand */}
      <div className="p-8 flex items-center gap-4 border-b border-slate-800/50">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="text-white p-2.5 rounded-2xl">
          <img src="/images/logo amen w.svg" alt="AMEN" className="h-8 w-auto" />
        </motion.div>
        <div className="flex flex-col">
          <span className="font-heading font-black text-white text-base tracking-tighter leading-none">{t("sidebar.portalTitle")}</span>
          <span className="text-[10px] font-bold text-primary tracking-[0.2em] mt-1 uppercase opacity-80">
            {isAdmin ? t("sidebar.roleAdmin") : t("sidebar.roleStaff")}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto custom-scrollbar">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsSidebarOpen(false)}
            className={cn(
              "group flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 relative",
              pathname === item.href
                ? "bg-primary text-white shadow-xl shadow-primary/20"
                : "hover:bg-white/[0.03] hover:text-white"
            )}
          >
            <div className="flex items-center gap-3.5">
              <item.icon size={20} className={cn(
                "transition-transform duration-300 group-hover:scale-110",
                pathname === item.href ? "text-white" : "text-slate-500 group-hover:text-primary"
              )} />
              <span>{item.name}</span>
            </div>
            {pathname === item.href && (
              <motion.div layoutId="activeNav" className="absolute right-3">
                <ChevronRight size={14} className="text-white/50" />
              </motion.div>
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom: View Website */}
      <div className="p-6 border-t border-slate-800/50">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-center gap-2 w-full h-11 rounded-2xl text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary hover:bg-white/[0.03] transition-all"
        >
          <Globe size={14} />
          {t("sidebar.viewWebsite")}
        </Link>
      </div>
    </div>
  );

  if (!hasMounted || isLoading) return null;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans selection:bg-primary selection:text-white">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 shrink-0 fixed inset-y-0 z-50">
        {SidebarContent}
      </div>

      {/* Mobile Trigger */}
      <div className="lg:hidden fixed top-6 left-6 z-50">
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl bg-white shadow-xl border-slate-100 text-slate-600 hover:text-primary transition-all">
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80 border-none bg-transparent">
            {SidebarContent}
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-80 min-h-screen flex flex-col relative w-full overflow-hidden">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 h-20 md:h-24 flex items-center justify-between px-4 sm:px-8 md:px-12 sticky top-0 z-40">
          <div className="flex flex-col ml-14 lg:ml-0">
            <h1 className="font-heading font-black text-lg sm:text-2xl text-slate-900 tracking-tight line-clamp-1">
              {sidebarItems.find((i) => i.href === pathname)?.name
                /* also check admin-only routes not in sidebarItems list */
                || (pathname === "/admin/users" ? t("sidebar.users") : null)
                || (pathname === "/admin/settings" ? t("sidebar.settings") : null)
                || t("sidebar.dashboard")}
            </h1>
            <div className="flex items-center gap-2 mt-0.5 md:mt-1">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">{t("sidebar.systemLive")}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Language switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex gap-1.5 md:gap-2.5 h-10 md:h-11 px-3 md:px-5 rounded-xl font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-all">
                  <Globe size={16} className="md:size-[18px]" />
                  <span className="text-sm md:text-base">{locale === "fr" ? "FR" : "EN"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[140px] rounded-2xl p-2 bg-white/90 backdrop-blur-xl border-slate-100 shadow-2xl">
                <DropdownMenuItem
                  onClick={() => switchLocale("fr")}
                  className={cn("rounded-xl font-bold py-3 transition-colors", locale === "fr" ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-50")}
                >
                  Français (FR)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => switchLocale("en")}
                  className={cn("rounded-xl font-bold py-3 transition-colors", locale === "en" ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-50")}
                >
                  English (EN)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="w-px h-6 md:h-8 bg-slate-100 mx-1 md:mx-2 hidden sm:block" />

            {/* ── User Avatar Dropdown ── */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="relative flex items-center gap-2 rounded-2xl p-1 pr-3 hover:bg-slate-100 transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                  aria-label="User menu"
                >
                  <div className="relative">
                    <Avatar className="h-9 w-9 md:h-10 md:w-10 border-2 border-slate-100 group-hover:border-primary/30 transition-all">
                      <AvatarFallback className="bg-primary/10 text-primary font-black text-xs">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    {/* Online dot */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  </div>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-xs font-black text-slate-800 leading-tight max-w-[120px] truncate">{user?.name}</span>
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-wider",
                      isAdmin ? "text-primary" : "text-slate-400"
                    )}>
                      {isAdmin ? t("sidebar.roleAdmin") : t("sidebar.roleStaff")}
                    </span>
                  </div>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-72 rounded-2xl p-2 bg-white border-slate-100 shadow-2xl shadow-slate-200/60"
              >
                {/* User info header */}
                <div className="px-3 py-3 flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary font-black text-sm">{userInitials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-slate-900 text-sm truncate">{user?.name}</p>
                    <p className="text-[11px] text-slate-400 font-medium truncate">{user?.email}</p>
                    <Badge variant="outline" className={cn(
                      "mt-1 text-[9px] font-black uppercase tracking-widest px-2 py-0 rounded-full",
                      isAdmin ? "border-primary/30 text-primary bg-primary/5" : "border-slate-200 text-slate-500 bg-slate-50"
                    )}>
                      {isAdmin ? <><ShieldCheck size={8} className="mr-1" />{t("sidebar.roleAdmin")}</> : <><User size={8} className="mr-1" />{t("sidebar.roleStaff")}</>}
                    </Badge>
                  </div>
                </div>

                {/* <DropdownMenuSeparator className="my-1 bg-slate-100" /> */}

                {/* Profile link */}
                {/* <DropdownMenuItem
                  className="rounded-xl px-3 py-2.5 font-bold text-sm text-slate-700 hover:bg-slate-50 hover:text-primary cursor-pointer gap-2.5"
                  onClick={() => router.push("/admin/dashboard")}
                >
                  <User size={16} className="text-slate-400" />
                  {t("userMenu.profile")}
                </DropdownMenuItem> */}

                {/* Admin-only items */}
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator className="my-1 bg-slate-100" />
                    <DropdownMenuLabel className="px-3 py-1 text-[9px] font-black uppercase tracking-widest text-slate-400">
                      {t("sidebar.adminZone")}
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                      className="rounded-xl px-3 py-2.5 font-bold text-sm text-slate-700 hover:bg-slate-50 hover:text-primary cursor-pointer gap-2.5"
                      onClick={() => router.push("/admin/users")}
                    >
                      <Users size={16} className="text-slate-400" />
                      {t("sidebar.users")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="rounded-xl px-3 py-2.5 font-bold text-sm text-slate-700 hover:bg-slate-50 hover:text-primary cursor-pointer gap-2.5"
                      onClick={() => router.push("/admin/settings")}
                    >
                      <Settings size={16} className="text-slate-400" />
                      {t("sidebar.settings")}
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator className="my-1 bg-slate-100" />

                {/* Sign Out */}
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="rounded-xl px-3 py-2.5 font-bold text-sm text-red-500 hover:bg-red-50 hover:text-red-600 cursor-pointer gap-2.5"
                >
                  <LogOut size={16} />
                  {t("sidebar.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-8 md:p-10 lg:p-12 xl:p-16 max-w-7xl w-full mx-auto flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Subtle bg glow */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] pointer-events-none -z-10 rounded-full" />
      </main>
    </div>
  );
}
