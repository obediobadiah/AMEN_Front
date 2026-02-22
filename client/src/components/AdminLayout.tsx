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
  X,
  Heart,
  Image,
  MessageSquare,
  Globe,
  Calendar,
  BookOpen,
  Briefcase,
  Database,
  ChevronRight,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslations, useLocale } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const t = useTranslations("admin");

  const switchLocale = (newLocale: string) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
    window.location.reload();
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

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
    { name: t("sidebar.settings"), href: "/admin/settings", icon: Settings },
  ];

  const SidebarContent = (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-300 border-r border-slate-800">
      {/* Logo & Brand */}
      <div className="p-8 flex items-center gap-4 border-b border-slate-800/50">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-white p-2.5 rounded-2xl"
        >
          <img src="/images/logo amen w.svg" alt="AMEN" className="h-8 w-auto" />
        </motion.div>
        <div className="flex flex-col">
          <span className="font-heading font-black text-white text-base tracking-tighter leading-none">{t("sidebar.portalTitle")}</span>
          <span className="text-[10px] font-bold text-primary tracking-[0.2em] mt-1 uppercase opacity-80">{t("sidebar.role")}</span>
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

      {/* User Session */}
      <div className="p-6 border-t border-slate-800/50 bg-slate-900/50">
        <div className="flex items-center gap-4 mb-6 px-2">
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src="/images/avatar-placeholder.png" />
              <AvatarFallback className="bg-slate-800 text-primary font-bold">AD</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-[#0f172a] rounded-full" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-black text-white truncate leading-tight">{t("sidebar.welcomeAdmin")}</span>
            <span className="text-xs text-slate-500 font-medium truncate italic">admin@amen-ngo.org</span>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-center gap-3 h-12 rounded-xl border-slate-800 bg-transparent text-slate-400 hover:bg-destructive hover:text-white hover:border-destructive transition-all duration-300 font-bold text-xs uppercase tracking-widest"
          asChild
        >
          <Link href="/admin/login">
            <LogOut size={16} /> {t("sidebar.logout")}
          </Link>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans selection:bg-primary selection:text-white">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 shrink-0 fixed inset-y-0 z-50">
        {SidebarContent}
      </div>

      {/* Mobile Trigger */}
      <div className="lg:hidden fixed top-6 left-6 z-50">
        {hasMounted ? (
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
        ) : (
          <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl bg-white shadow-xl border-slate-100 text-slate-600">
            <Menu size={24} />
          </Button>
        )}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-80 min-h-screen flex flex-col relative">
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 h-24 flex items-center justify-between px-8 md:px-12 sticky top-0 z-40">
          <div className="flex flex-col">
            <h1 className="font-heading font-black text-2xl text-slate-900 tracking-tight">
              {sidebarItems.find(i => i.href === pathname)?.name || t("sidebar.dashboard")}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("sidebar.systemLive")}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hidden md:flex gap-2.5 h-11 px-5 rounded-xl font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-all" asChild>
              <Link href="/" target="_blank">
                <Globe size={18} /> {t("sidebar.viewWebsite")}
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex gap-2.5 h-11 px-5 rounded-xl font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-all">
                  <Globe size={18} /> {locale === 'fr' ? 'FR' : 'EN'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[140px] rounded-2xl p-2 bg-white/90 backdrop-blur-xl border-slate-100 shadow-2xl">
                <DropdownMenuItem
                  onClick={() => switchLocale("fr")}
                  className={cn("rounded-xl font-bold py-3 transition-colors", locale === 'fr' ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-50")}
                >
                  Français (FR)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => switchLocale("en")}
                  className={cn("rounded-xl font-bold py-3 transition-colors", locale === 'en' ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-50")}
                >
                  English (EN)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="w-px h-8 bg-slate-100 mx-2 hidden md:block" />
            <Avatar className="h-10 w-10 border border-slate-100 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
              <AvatarFallback className="bg-slate-50 text-slate-400 text-xs font-bold uppercase">AD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="p-8 md:p-12 lg:p-16 max-w-7xl w-full mx-auto flex-1">
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

        {/* Subtle decorative background */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] pointer-events-none -z-10 rounded-full" />
      </main>
    </div>
  );
}
