"use client";

import { Layout } from "@/components/Layout";
import { images } from "@/lib/images";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, TrendingUp, ArrowRight, Target, MousePointer2, Sparkles } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { cn } from "@/lib/utils";
import { useState } from "react";

const PILLAR_STYLES = [
    {
        key: "strategy",
        icon: Sprout,
        gradient: "from-emerald-500 to-teal-700",
        glow: "#10b981",
        accentLight: "bg-emerald-50",
        accentText: "text-emerald-600",
        bulletColor: "bg-emerald-500",
        number: "01",
        badge: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
    },
    {
        key: "domain",
        icon: TrendingUp,
        gradient: "from-blue-500 to-indigo-700",
        glow: "#3b82f6",
        accentLight: "bg-blue-50",
        accentText: "text-blue-600",
        bulletColor: "bg-blue-500",
        number: "02",
        badge: "bg-blue-500/10 text-blue-700 border-blue-200",
    },
];

export default function StrategicOrientations() {
    const t = useTranslations('aboutPage.strategic');
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <Layout>
            <PageHero
                title={t('title')}
                subtitle={t('subtitle')}
                image={images.heroStrategy}
            />

            <section className="py-32 bg-slate-50 relative overflow-hidden">
                {/* Decorative background */}
                <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-white to-transparent" />
                <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px]" />

                <div className="container mx-auto px-4 relative z-10">
                    {/* Section header */}
                    <div className="text-center max-w-4xl mx-auto mb-24 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-black text-xs uppercase tracking-[0.2em]"
                        >
                            <MousePointer2 size={14} /> {t("introBan")}
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]"
                        >
                            {t('intro')}
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto"
                        >
                            {t('introDesc')}
                        </motion.p>
                    </div>

                    {/* Pillar cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
                        {PILLAR_STYLES.map((pillar, i) => {
                            const Icon = pillar.icon;
                            const isHovered = hoveredIndex === i;

                            return (
                                <motion.div
                                    key={pillar.key}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15, duration: 0.8, ease: "easeOut" }}
                                    onMouseEnter={() => setHoveredIndex(i)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    className="group relative"
                                >
                                    {/* Card */}
                                    <div className={cn(
                                        "relative bg-white rounded-[3rem] overflow-hidden border transition-all duration-700",
                                        isHovered
                                            ? "shadow-[0_30px_80px_-10px_rgba(0,0,0,0.18)] -translate-y-3 border-transparent"
                                            : "shadow-xl shadow-slate-200/60 border-slate-100"
                                    )}>
                                        {/* Top gradient header strip */}
                                        <div className={cn("h-2 w-full bg-gradient-to-r", pillar.gradient)} />

                                        {/* Animated glow blob */}
                                        <AnimatePresence>
                                            {isHovered && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.6 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.6 }}
                                                    transition={{ duration: 0.5 }}
                                                    className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-[100px] pointer-events-none"
                                                    style={{ backgroundColor: pillar.glow, opacity: 0.12 }}
                                                />
                                            )}
                                        </AnimatePresence>

                                        <div className="p-10 lg:p-14 relative z-10">
                                            {/* Card top row: number + icon */}
                                            <div className="flex items-start justify-between mb-10">

                                                <div className={cn(
                                                    "w-18 h-18 rounded-2xl flex items-center justify-center bg-gradient-to-br text-white shadow-xl transition-all duration-500",
                                                    pillar.gradient,
                                                    isHovered ? "scale-110 rotate-6" : ""
                                                )} style={{ width: 72, height: 72 }}>
                                                    <Icon size={34} className="stroke-[1.5]" />
                                                </div>
                                            </div>

                                            {/* Pillar badge */}
                                            <div className="mb-6">
                                                <span className={cn(
                                                    "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.15em] border",
                                                    pillar.badge
                                                )}>
                                                    <Sparkles size={12} />
                                                    {t(`pillars.${pillar.key}.title`)}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h3 className={cn(
                                                "text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-8 transition-colors duration-500 leading-tight",
                                                isHovered ? pillar.accentText : ""
                                            )}>
                                                {t(`pillars.${pillar.key}.title`)}
                                            </h3>

                                            {/* Items list */}
                                            <ul className="space-y-4">
                                                {(t.raw(`pillars.${pillar.key}.items`) as any[]).map((item: any, j: number) => (
                                                    <motion.li
                                                        key={j}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        whileInView={{ opacity: 1, x: 0 }}
                                                        viewport={{ once: true }}
                                                        transition={{ delay: j * 0.05 + 0.2 }}
                                                        className="flex items-start gap-4 group/item"
                                                    >
                                                        <span className={cn(
                                                            "flex-shrink-0 mt-2 w-2 h-2 rounded-full transition-transform duration-300 group-hover/item:scale-125",
                                                            pillar.bulletColor
                                                        )} />
                                                        <div className="flex-1">
                                                            {typeof item === 'string' ? (
                                                                <span className="text-slate-600 font-medium leading-relaxed">{item}</span>
                                                            ) : (
                                                                <>
                                                                    <span className="text-slate-900 font-bold text-[0.95rem]">{item.title}</span>
                                                                    {item.desc && (
                                                                        <p className="text-slate-500 font-medium text-sm leading-relaxed mt-0.5">{item.desc}</p>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </motion.li>
                                                ))}
                                            </ul>

                                            {/* Bottom CTA line */}
                                            <div className={cn(
                                                "mt-10 pt-8 border-t border-slate-100 flex items-center justify-between transition-all duration-500",
                                                isHovered ? "border-slate-200" : ""
                                            )}>
                                                <motion.div
                                                    animate={{ x: isHovered ? 6 : 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className={cn("w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br text-white", pillar.gradient)}
                                                >
                                                    <ArrowRight size={18} />
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Vision CTA Strip */}
            <section className="py-24 bg-primary overflow-hidden relative group">
                <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10 mix-blend-overlay" />
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px]" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="text-center md:text-left space-y-4 max-w-2xl">
                            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">{t("ReadySupport.title")}</h2>
                            <p className="text-white/80 text-xl font-medium">{t("ReadySupport.desc")}</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-3 px-12 py-6 bg-white text-primary rounded-full font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-50 transition-colors flex-shrink-0"
                        >
                            {t("ReadySupport.GetInvolve")}
                            <ArrowRight size={20} />
                        </motion.button>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
