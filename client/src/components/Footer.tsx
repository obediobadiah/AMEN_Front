"use client";

import Link from "next/link";
import { Facebook, Twitter, Linkedin, Instagram, ArrowRight } from "lucide-react";
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations();

  // Define nav links locally to use translations
  const footerLinks = [
    { name: t('nav.home'), href: "/" },
    { name: t('nav.about'), href: "/about/vision-mission" },
    { name: t('nav.activities'), href: "/activities/programs" }, // Using programs as main link for activities
    { name: t('nav.getInvolved'), href: "/get-involved" },
    { name: t('nav.news'), href: "/news/actualites" },
    { name: t('nav.contact'), href: "/contact" },
    { name: t('nav.donate'), href: "/donate" },
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="text-primary-foreground p-2 rounded-lg">
                <img
                  src="/images/logo amen w.svg"
                  alt="AMEN Logo"
                  className="h-14 w-auto"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-2xl leading-none text-white">AMEN</span>
              </div>
            </div>
            <p className="text-secondary-foreground/70 text-sm leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all text-secondary-foreground/60">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all text-secondary-foreground/60">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all text-secondary-foreground/60">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-secondary-foreground font-heading text-xl mb-6">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm flex items-center gap-2"
                  >
                    <ArrowRight size={14} className="opacity-50" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Causes */}
          <div>
            <h3 className="text-secondary-foreground font-heading text-xl mb-6">{t('footer.ourCauses')}</h3>
            <ul className="space-y-3">
              <li className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm">{t('footer.causes.womenEmpowerment')}</li>
              <li className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm">{t('footer.causes.cleanWater')}</li>
              <li className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm">{t('footer.causes.education')}</li>
              <li className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm">{t('footer.causes.environmentalProtection')}</li>
              <li className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm">{t('footer.causes.emergencyRelief')}</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-secondary-foreground font-heading text-xl mb-6">{t('footer.newsletter')}</h3>
            <p className="text-secondary-foreground/70 text-sm mb-4">{t('footer.newsletterDescription')}</p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                className="w-full bg-secondary/50 border border-secondary-foreground/10 rounded-lg px-4 py-3 text-sm text-secondary-foreground placeholder:text-secondary-foreground/40 focus:outline-none focus:border-primary transition-colors"
              />
              <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-lg text-sm transition-colors uppercase tracking-wide">
                {t('footer.subscribe')}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-secondary-foreground/60 text-xs">
            © {new Date().getFullYear()} AMEN. {t('footer.copyright')}
          </p>
          <div className="flex gap-6">
            <Link href="/admin/login" className="text-secondary-foreground/60 hover:text-primary text-xs transition-colors">
              {t('footer.adminLogin')}
            </Link>
            <a href="#" className="text-secondary-foreground/60 hover:text-primary text-xs transition-colors">{t('footer.privacyPolicy')}</a>
            <a href="#" className="text-secondary-foreground/60 hover:text-primary text-xs transition-colors">{t('footer.termsOfService')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
