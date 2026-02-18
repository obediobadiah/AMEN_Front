"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  Search,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Globe,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from 'next-intl';

type NavItem = {
  name: string;
  href?: string;
  children?: NavItem[];
};

function NavLinkItem({
  item,
  pathname,
  level = 0,
  openDropdown,
  onDropdownToggle,
  onDropdownClose,
}: {
  item: NavItem;
  pathname: string;
  level?: number;
  openDropdown?: string | null;
  onDropdownToggle?: (name: string) => void;
  onDropdownClose?: () => void;
}) {
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.href ? pathname === item.href : false;
  const isTopLevel = level === 0;
  const isOpen = isTopLevel && openDropdown === item.name;

  if (!hasChildren) {
    if (!item.href) return null; // Should not happen for leaf nodes
    return (
      <Link
        href={item.href}
        className={cn(
          "block px-4 py-2.5 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-primary/50",
          isActive
            ? "text-primary border-b-2 border-primary"
            : "text-foreground/90 hover:text-primary"
        )}
      >
        {item.name}
      </Link>
    );
  }

  const handleTriggerClick = (e: React.MouseEvent) => {
    if (isTopLevel && onDropdownToggle) {
      e.preventDefault();
      onDropdownToggle(item.name);
    }
  };

  return (
    <div
      className={cn("group/menu relative", isTopLevel && "flex")}
      onMouseLeave={isTopLevel ? onDropdownClose : undefined}
    >
      <button
        type="button"
        onClick={handleTriggerClick}
        className={cn(
          "flex items-center gap-1 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted/30 w-full text-left cursor-pointer bg-transparent border-none",
          isActive
            ? "text-primary font-semibold"
            : "text-foreground/90 hover:text-primary"
        )}
      >
        {item.name}
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 shrink-0 transition-transform",
            isTopLevel ? "rotate-90" : "rotate-0 group-hover/menu:translate-x-0.5",
            isOpen && isTopLevel && "rotate-90"
          )}
        />
      </button>
      {/* Mega dropdown - full width (100%) - visible on hover OR click (touch) */}
      <div
        className={cn(
          "absolute transition-all duration-200 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden",
          "opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible backdrop-blur-sm bg-background/95",
          isOpen && "!opacity-100 !visible",
          isTopLevel
            ? "top-full left-0 mt-1 w-64 py-2"
            : "top-0 left-full ml-1 w-56 py-1"
        )}
      >
        <div className="max-h-[70vh] overflow-y-auto">
          {item.children!.map((section) => (
            <div key={section.name} className="border-b border-border/30 last:border-0">
              {section.children ? (
                <div className="pb-2 pl-4 pr-2 pt-2">
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {section.name}
                  </div>
                  <div className="ml-1 space-y-0.5">
                    {section.children.map((leaf) => (
                      <Link
                        key={leaf.name}
                        href={leaf.href || '#'}
                        className="block px-2 py-1.5 text-sm text-foreground/85 hover:text-primary hover:bg-muted/30 rounded-md transition-colors"
                        onClick={onDropdownClose}
                      >
                        {leaf.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  href={section.href || '#'}
                  className="block px-4 py-2.5 text-sm font-medium text-foreground/90 hover:bg-muted/30 transition-colors"
                  onClick={onDropdownClose}
                >
                  {section.name}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Define navLinks with translations dynamically
  const navLinks: NavItem[] = [
    {
      name: t('nav.home'),
      href: "/"
    },
    {
      name: t('nav.about'),
      // href removed
      children: [
        { name: t('about.history'), href: "/about" },
        { name: t('about.visionMission'), href: "/about/vision-mission" },
        { name: t('about.objectives'), href: "/about/objectives" },
        { name: t('about.governance'), href: "/about/governance" },
        { name: t('about.strategicOrientations'), href: "/about/strategic-orientations" }
      ]
    },
    {
      name: t('nav.activities'),
      // href removed
      children: [
        { name: t('activities.programs'), href: "/programs" },
        { name: t('activities.projectsInitiatives'), href: "/projects" },
        { name: t('activities.resources'), href: "/resources" }
      ]
    },
    {
      name: t('nav.getInvolved'),
      href: "/get-involved"
    },
    {
      name: t('nav.news'),
      // href removed
      children: [
        { name: t('newsSection.actualites'), href: "/news/actualites" },
        { name: t('newsSection.publications'), href: "/news/publications" },
        { name: t('newsSection.multimedia'), href: "/news/multimedia" },
        { name: t('newsSection.events'), href: "/news/events" }
      ]
    },
    {
      name: t('nav.contact'),
      href: "/contact"
    }
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setOpenDropdown(null);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDropdownToggle = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const switchLocale = (newLocale: string) => {
    // Set cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    // Refresh page
    router.refresh();
    // Force a full reload to ensure server-side translation picking up new cookie
    window.location.reload();
  };

  return (
    <header className="w-full z-50 fixed top-0 left-0 transition-all duration-300">
      {/* Top Bar */}
      <div className="hidden md:block bg-secondary text-secondary-foreground/90 text-xs shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10">
            {/* Social Links */}
            <div className="flex items-center space-x-1">
              <span className="text-secondary-foreground/60 text-xs font-medium mr-2">{t('nav.followUs')}</span>
              {[
                { icon: <Facebook size={12} />, label: "Facebook" },
                { icon: <Twitter size={12} />, label: "Twitter" },
                { icon: <Linkedin size={12} />, label: "LinkedIn" },
                { icon: <Instagram size={12} />, label: "Instagram" }
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-6 h-6 rounded-full flex items-center justify-center text-secondary-foreground/60 hover:text-primary hover:bg-primary/10 transition-colors duration-200"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Contact Info */}
            <div className="flex items-center space-x-6">
              <a
                href="tel:+243999999999"
                className="flex items-center gap-2 text-secondary-foreground/80 hover:text-primary transition-colors group"
              >
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Phone size={12} className="text-primary" />
                </div>
                <span>+243 999 999 999</span>
              </a>
              <a
                href="mailto:info@amen-ngo.org"
                className="flex items-center gap-2 text-secondary-foreground/80 hover:text-primary transition-colors group"
              >
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail size={12} className="text-primary" />
                </div>
                <span>info@amen-ngo.org</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div
        className={cn(
          "w-full transition-all duration-300 bg-background/95 backdrop-blur-md border-b border-border/50",
          scrolled ? "py-3 shadow-lg shadow-black/5" : "py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="group-hover:scale-105 transition-all duration-300">
              <img
                src="/images/logo amen.svg"
                alt="AMEN Logo"
                className="h-12 w-auto"
              />
            </div>
          </Link>

          {/* Desktop Nav - Mega Menu (hover on desktop, click/tap on touch) */}
          <nav
            ref={navRef}
            className="hidden lg:flex items-center gap-1 flex-1 justify-center"
          >
            {navLinks.map((link) => (
              <NavLinkItem
                key={link.name}
                item={link}
                pathname={pathname}
                openDropdown={openDropdown}
                onDropdownToggle={handleDropdownToggle}
                onDropdownClose={() => setOpenDropdown(null)}
              />
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 font-medium text-foreground/80 hover:text-foreground">
                  <Globe size={16} /> {locale === 'fr' ? 'FR' : 'EN'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[140px]">
                <DropdownMenuItem onClick={() => switchLocale("fr")}>
                  Français (FR)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchLocale("en")}>
                  English (EN)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-6 w-px bg-border" />

            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
              <Search className="h-5 w-5" />
            </Button>
            <Button className="rounded-full font-bold bg-primary hover:bg-primary/90 text-white px-6 h-10 shadow-lg shadow-primary/25 hover:shadow-primary/30 transition-shadow">
              {t('nav.donate')}
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden h-10 w-10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[85vw] max-w-sm">
              <div className="flex flex-col gap-2 pt-8">
                {navLinks.map((link) => (
                  <MobileNavItem key={link.name} item={link} pathname={pathname} />
                ))}
                <div className="pt-6 mt-4 border-t border-border space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="font-yeseva text-2xl leading-none text-foreground tracking-tight">{t('nav.language')}:</span>
                    <div className="flex gap-2">
                      <Button
                        variant={locale === "fr" ? "default" : "outline"}
                        size="sm"
                        onClick={() => switchLocale("fr")}
                      >
                        FR
                      </Button>
                      <Button
                        variant={locale === "en" ? "default" : "outline"}
                        size="sm"
                        onClick={() => switchLocale("en")}
                      >
                        EN
                      </Button>
                    </div>
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-full font-bold">
                    {t('nav.donate')}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header >
  );
}

function MobileNavItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const hasChildren = item.children && item.children.length > 0;
  const [open, setOpen] = useState(false);

  if (!hasChildren) {
    if (!item.href) return null;
    return (
      <Link
        href={item.href}
        className={cn(
          "block py-3 px-4 text-base font-medium rounded-lg transition-colors",
          pathname === item.href ? "text-primary bg-primary/5" : "text-foreground hover:bg-muted/50"
        )}
      >
        {item.name}
      </Link>
    );
  }

  return (
    <div className="border-b border-border/50 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-3 px-4 text-base font-medium text-foreground hover:bg-muted/50 rounded-lg transition-colors"
      >
        {item.name}
        <ChevronRight className={cn("h-4 w-4 transition-transform", open && "rotate-90")} />
      </button>
      {open && (
        <div className="pl-6 pb-3 space-y-1">
          {item.children!.map((child) =>
            child.children ? (
              <div key={child.name} className="pt-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  {child.name}
                </div>
                <div className="space-y-0.5">
                  {child.children.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.href || '#'}
                      className="block py-2 px-3 text-sm text-foreground/80 hover:text-primary hover:bg-muted/30 rounded-lg"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={child.name}
                href={child.href || '#'}
                className="block py-2 px-3 text-sm text-foreground/80 hover:text-primary hover:bg-muted/30 rounded-lg"
              >
                {child.name}
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}
