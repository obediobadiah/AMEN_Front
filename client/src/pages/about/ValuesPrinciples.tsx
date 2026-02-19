"use client";

import { Layout } from '@/components/Layout';
import { useTranslations } from 'next-intl';
import { PageHero } from "@/components/PageHero";
import { motion, AnimatePresence } from "framer-motion";
import { Globe2, TrendingUp, Award, Scale, ShieldCheck, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { images } from "@/lib/images";

const VALUE_ICONS = [Globe2, TrendingUp, Award, Scale, ShieldCheck];

const VALUE_STYLES = [
  {
    gradient: "from-violet-500 to-purple-700",
    glow: "bg-violet-500/20",
    light: "bg-violet-50",
    accent: "text-violet-600",
    border: "border-violet-200",
    number: "text-violet-300",
  },
  {
    gradient: "from-blue-500 to-cyan-600",
    glow: "bg-blue-500/20",
    light: "bg-blue-50",
    accent: "text-blue-600",
    border: "border-blue-200",
    number: "text-blue-300",
  },
  {
    gradient: "from-emerald-500 to-teal-600",
    glow: "bg-emerald-500/20",
    light: "bg-emerald-50",
    accent: "text-emerald-600",
    border: "border-emerald-200",
    number: "text-emerald-300",
  },
  {
    gradient: "from-amber-500 to-orange-600",
    glow: "bg-amber-500/20",
    light: "bg-amber-50",
    accent: "text-amber-600",
    border: "border-amber-200",
    number: "text-amber-300",
  },
  {
    gradient: "from-rose-500 to-pink-600",
    glow: "bg-rose-500/20",
    light: "bg-rose-50",
    accent: "text-rose-600",
    border: "border-rose-200",
    number: "text-rose-300",
  },
];

export default function ValuesPrinciples() {
  const t = useTranslations();
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  return (
    <Layout>
      <PageHero
        title={t('about.valuesPrinciples')}
        subtitle={t('aboutPage.valuesPrinciples.subtitle')}
        image={images.heroValues}
      />

      {/* Intro section */}
      <section className="py-28 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -mr-96 -mt-96" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] -ml-48 -mb-48" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-20 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-black text-xs uppercase tracking-[0.2em]"
            >
              <UserCheck size={14} /> {t('aboutPage.valuesPrinciples.title')}
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]"
            >
              {t('aboutPage.valuesPrinciples.intro')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto"
            >
              {t('aboutPage.valuesPrinciples.introDesc')}
            </motion.p>
          </div>

          {/* Values Grid - 5 values in a masonry-style layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[1, 2, 3, 4, 5].map((id, idx) => {
              const style = VALUE_STYLES[idx];
              const Icon = VALUE_ICONS[idx];
              const isHovered = hoveredValue === id;

              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.7 }}
                  onMouseEnter={() => setHoveredValue(id)}
                  onMouseLeave={() => setHoveredValue(null)}
                  className={cn(
                    "group relative bg-white rounded-[2.5rem] overflow-hidden border shadow-xl transition-all duration-700 cursor-default",
                    isHovered ? "shadow-2xl -translate-y-3 border-transparent" : "border-slate-100 shadow-slate-200/50",
                    // Make the 5th card span 2 cols on md
                    id === 5 ? "md:col-span-2 lg:col-span-1" : ""
                  )}
                >
                  {/* Animated background glow on hover */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={cn("absolute inset-0 opacity-10", style.glow)}
                      />
                    )}
                  </AnimatePresence>

                  {/* Top gradient bar */}
                  <div className={cn("h-1.5 w-full bg-gradient-to-r", style.gradient)} />

                  <div className="p-10 relative z-10">
                    {/* Number + Icon row */}
                    <div className="flex items-start justify-between mb-8">
                      <span className={cn("text-7xl font-black leading-none opacity-20 select-none", style.number)}>
                        0{id}
                      </span>
                      <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br flex-shrink-0 shadow-lg transition-all duration-500",
                        style.gradient,
                        isHovered ? "rotate-12 scale-110" : ""
                      )}>
                        <Icon size={30} />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className={cn(
                      "text-2xl font-black text-slate-900 tracking-tight mb-4 transition-colors duration-500",
                      isHovered ? style.accent : ""
                    )}>
                      {t(`aboutPage.valuesPrinciples.values.items.${id}.title`)}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-500 font-medium leading-relaxed text-[0.95rem]">
                      {t(`aboutPage.valuesPrinciples.values.items.${id}.description`)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-28 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10 mix-blend-overlay" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] animate-pulse" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto space-y-10"
          >
            <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight">
              {t('aboutPage.valuesPrinciples.commitment.title')}
            </h3>
            <p className="text-white/80 text-xl md:text-2xl font-medium max-w-2xl mx-auto">
              {t('aboutPage.valuesPrinciples.commitment.description')}
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-6 bg-white text-primary rounded-full font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-50 transition-colors"
              >
                {t('aboutPage.valuesPrinciples.commitment.cta')}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
