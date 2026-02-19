"use client";

import { Layout } from '@/components/Layout';
import { useTranslations } from 'next-intl';
import { PageHero } from "@/components/PageHero";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, Handshake, Users, CheckCircle2, ArrowRight,
  Building2, Network
} from "lucide-react";
import { images } from "@/lib/images";
import { cn } from "@/lib/utils";
import { useState } from "react";

const TYPE_STYLES = [
  {
    icon: Handshake,
    gradient: "from-blue-500 to-indigo-700",
    glow: "bg-blue-500/10",
    accent: "text-blue-600",
    badge: "bg-blue-50 border-blue-200 text-blue-700",
    bar: "bg-blue-500",
    ring: "ring-blue-400/30",
    partnerBg: "bg-white hover:bg-slate-50",
  },
  {
    icon: Users,
    gradient: "from-emerald-500 to-teal-700",
    glow: "bg-emerald-500/10",
    accent: "text-emerald-600",
    badge: "bg-emerald-50 border-emerald-200 text-emerald-700",
    bar: "bg-emerald-500",
    ring: "ring-emerald-400/30",
    partnerBg: "bg-white hover:bg-slate-50",
  },
  {
    icon: Building2,
    gradient: "from-amber-500 to-orange-700",
    glow: "bg-amber-500/10",
    accent: "text-amber-600",
    badge: "bg-amber-50 border-amber-200 text-amber-700",
    bar: "bg-amber-500",
    ring: "ring-amber-400/30",
    partnerBg: "bg-white hover:bg-slate-50",
  },
  {
    icon: Network,
    gradient: "from-rose-500 to-pink-700",
    glow: "bg-rose-500/10",
    accent: "text-rose-600",
    badge: "bg-rose-50 border-rose-200 text-rose-700",
    bar: "bg-rose-500",
    ring: "ring-rose-400/30",
    partnerBg: "bg-white hover:bg-slate-50",
  },
];

// Partner Logos (Using reliable sources: Clearbit for international orgs, Unsplash for others)
const PARTNERS_BY_TYPE: Record<number, { name: string; logo: string }[]> = {
  0: [
    { name: "UN Women", logo: "https://logo.clearbit.com/unwomen.org" },
    { name: "UNICEF", logo: "https://logo.clearbit.com/unicef.org" },
    { name: "FAO", logo: "https://logo.clearbit.com/fao.org" },
    { name: "USAID", logo: "https://logo.clearbit.com/usaid.gov" },
  ],
  1: [
    { name: "AFEM", logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&q=80" },
    { name: "Coalition", logo: "https://images.unsplash.com/photo-1506719040632-7d58d7c0c057?w=200&h=200&q=80" },
    { name: "Wakilisha", logo: "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?w=200&h=200&q=80" },
    { name: "Rural Women", logo: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=200&h=200&q=80" },
  ],
  2: [
    { name: "BRALIMA", logo: "https://logo.clearbit.com/heineken.com" }, // Bralima is part of Heineken
    { name: "RAWBANK", logo: "https://logo.clearbit.com/rawbank.cd" },
    { name: "Congo Futur", logo: "https://images.unsplash.com/photo-1599305090623-668078df7c5f?w=200&h=200&q=80" },
  ],
  3: [
    { name: "CIVICUS", logo: "https://logo.clearbit.com/civicus.org" },
    { name: "AWEPON", logo: "https://images.unsplash.com/photo-1572044162444-ad60f128bde7?w=200&h=200&q=80" },
    { name: "AFARD", logo: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&q=80" },
    { name: "GROOTS", logo: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=200&q=80" },
  ],
};

export default function PartnershipsNetworks() {
  const t = useTranslations();
  const [activeType, setActiveType] = useState<number | null>(null);
  const [hoveredType, setHoveredType] = useState<number | null>(null);

  const displayedTypes = activeType !== null ? [activeType] : [0, 1, 2, 3];

  return (
    <Layout>
      <PageHero
        title={t('about.partnershipsNetworks')}
        subtitle={t('aboutPage.partnershipsNetworks.subtitle')}
        image={images.heroPartners || "/images/hero/partnerships.jpg"}
      />

      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-20 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-black text-xs uppercase tracking-[0.2em]"
            >
              <Globe size={14} /> {t('aboutPage.partnershipsNetworks.title')}
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]"
            >
              {t('aboutPage.partnershipsNetworks.intro')}
            </motion.h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start mb-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div className="space-y-6">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase border-l-4 border-primary pl-6">
                  {t('aboutPage.partnershipsNetworks.ourApproach.title')}
                </h3>
                <p className="text-slate-500 text-lg font-medium leading-relaxed">
                  {t('aboutPage.partnershipsNetworks.ourApproach.description')}
                </p>
              </div>

              <div className="p-8 lg:p-10 rounded-[3rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50">
                <h3 className="text-xl font-black text-slate-900 mb-6">
                  {t('aboutPage.partnershipsNetworks.benefits.title')}
                </h3>
                <ul className="grid gap-5">
                  {[1, 2, 3, 4].map((item) => (
                    <li key={item} className="flex items-center gap-4 group">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                        <CheckCircle2 size={16} />
                      </div>
                      <span className="text-base font-bold text-slate-600 transition-colors group-hover:text-slate-900">
                        {t(`aboutPage.partnershipsNetworks.benefits.items.${item}`)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {TYPE_STYLES.map((style, index) => (
                <motion.div
                  key={index}
                  onClick={() => setActiveType(activeType === index ? null : index)}
                  onMouseEnter={() => setHoveredType(index)}
                  onMouseLeave={() => setHoveredType(null)}
                  className={cn(
                    "p-7 rounded-[2.5rem] bg-white border border-slate-100 shadow-lg transition-all duration-500 text-center cursor-pointer",
                    hoveredType === index ? "translate-y-[-8px] border-primary/20 shadow-2xl" : "",
                    activeType === index ? `ring-4 ${style.ring}` : ""
                  )}
                >
                  <div className={cn(
                    "w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-white bg-gradient-to-br mb-5 transition-transform duration-500",
                    hoveredType === index ? "rotate-12 scale-110" : "",
                    style.gradient
                  )}>
                    <style.icon size={28} />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">
                    {t(`aboutPage.partnershipsNetworks.types.${index}.title`)}
                  </h4>
                  <p className="text-slate-500 font-medium text-xs leading-relaxed">
                    {t(`aboutPage.partnershipsNetworks.types.${index}.description`)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
              <div className="text-center md:text-left space-y-2">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                  {t('aboutPage.partnershipsNetworks.ecosystemTitle')}
                </h3>
                <div className="w-20 h-1.5 bg-primary rounded-full md:mx-0 mx-auto" />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveType(null)}
                  className={cn(
                    "px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wide transition-all duration-300",
                    activeType === null
                      ? "bg-primary text-white shadow-lg"
                      : "bg-white text-slate-600 border border-slate-200"
                  )}
                >
                  {t('aboutPage.partnershipsNetworks.filterAll')}
                </button>
                {TYPE_STYLES.map((style, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveType(activeType === i ? null : i)}
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wide transition-all border",
                      activeType === i
                        ? `bg-gradient-to-r ${style.gradient} text-white border-transparent`
                        : `bg-white border-slate-200 text-slate-600`
                    )}
                  >
                    <style.icon size={12} />
                    {t(`aboutPage.partnershipsNetworks.types.${i}.shortTitle`)}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeType ?? "all"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-12"
              >
                {displayedTypes.map((typeIdx) => {
                  const style = TYPE_STYLES[typeIdx];
                  const partners = PARTNERS_BY_TYPE[typeIdx] ?? [];

                  return (
                    <div key={typeIdx} className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className={cn("px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border", style.badge)}>
                          {t(`aboutPage.partnershipsNetworks.types.${typeIdx}.title`)}
                        </div>
                        <div className={cn("h-px flex-1", style.bar, "opacity-20")} />
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {partners.map((partner, pIdx) => (
                          <motion.div
                            key={partner.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: pIdx * 0.05 }}
                            className={cn(
                              "group aspect-square flex items-center justify-center p-6 rounded-3xl border border-slate-100 bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
                              "relative overflow-hidden"
                            )}
                          >
                            <img
                              src={partner.logo}
                              alt={partner.name}
                              className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500 p-2"
                            />
                            {/* Hover label */}
                            <div className="absolute inset-x-0 bottom-0 py-2 bg-slate-900/90 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                              <p className="text-[10px] font-black text-white text-center uppercase tracking-tighter">
                                {partner.name}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10 mix-blend-overlay" />
        <div className="container mx-auto px-4 relative z-10 text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            {t('aboutPage.partnershipsNetworks.cta.title')}
          </h2>
          <p className="text-white/80 text-lg font-medium max-w-2xl mx-auto">
            {t('aboutPage.partnershipsNetworks.cta.description')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-10 py-5 bg-white text-primary rounded-full font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-colors flex items-center gap-2">
              {t('aboutPage.partnershipsNetworks.cta.primaryButton')}
              <ArrowRight size={16} />
            </button>
            <button className="px-10 py-5 bg-transparent border-2 border-white/30 text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-colors">
              {t('aboutPage.partnershipsNetworks.cta.secondaryButton')}
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
