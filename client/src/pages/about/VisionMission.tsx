"use client";

import { Layout } from "@/components/Layout";
import { images } from "@/lib/images";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Heart, Leaf, Target, Eye, Crosshair, Sparkles, TargetIcon, LeafIcon, HeartIcon, Star } from "lucide-react";
import Image from "next/image";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3
        }
    }
};

export default function VisionMission() {
    const t = useTranslations('aboutPage.visionMission');

    return (
        <Layout>
            <PageHero
                title={t('title')}
                subtitle={t('subtitle')}
                image={images.heroMission}
            />

            {/* Intro Quote */}
            <section className="py-32 bg-background relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <span className="text-[12rem] text-primary/10 font-serif absolute -top-32 -left-16 select-none">"</span>
                        <h2 className="text-3xl md:text-5xl font-heading font-black leading-tight text-slate-900 italic tracking-tight">
                            {t('visionText')}
                        </h2>
                        <span className="text-[12rem] text-primary/10 font-serif absolute -bottom-48 -right-16 rotate-180 select-none">"</span>
                    </motion.div>
                </div>
            </section>

            {/* Vision, Mission, and Purpose Cards */}
            <section className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        {/* Vision Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="bg-white rounded-[3rem] p-12 shadow-xl shadow-slate-200/50 border border-slate-100 relative group hover:border-primary/30 transition-all duration-500 flex flex-col overflow-hidden"
                        >
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-lg shadow-primary/10 group-hover:shadow-primary/30">
                                <Eye size={32} />
                            </div>
                            <h2 className="text-3xl font-black mb-6 text-slate-900 tracking-tight">{t('visionTitle')}</h2>
                            <p className="text-lg text-slate-500 leading-relaxed font-medium">
                                {t('visionText')}
                            </p>
                        </motion.div>

                        {/* Mission Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="bg-[#0f172a] rounded-[3rem] p-12 shadow-2xl border border-white/5 relative group hover:border-white/10 transition-all duration-500 flex flex-col overflow-hidden"
                        >
                            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-primary/20">
                                <Target size={32} />
                            </div>
                            <h2 className="text-3xl font-black mb-6 text-white tracking-tight">{t('missionTitle')}</h2>
                            <p className="text-lg text-slate-300 leading-relaxed font-medium">
                                {t('missionText')}
                            </p>
                        </motion.div>

                        {/* Purpose Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="bg-white rounded-[3rem] p-12 shadow-xl shadow-slate-200/50 border border-slate-100 relative group hover:border-secondary/30 transition-all duration-500 flex flex-col overflow-hidden"
                        >
                            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-8 group-hover:bg-secondary group-hover:text-white transition-all duration-500 shadow-lg shadow-secondary/10 group-hover:shadow-secondary/30">
                                <Star size={32} />
                            </div>
                            <h2 className="text-3xl font-black mb-6 text-slate-900 tracking-tight">{t('finalityTitle')}</h2>
                            <p className="text-lg text-slate-500 leading-relaxed font-medium">
                                {t('finalityText')}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Image Split Section */}
            <section className="relative py-32 bg-white overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 font-black text-xs uppercase tracking-[0.2em]">
                                <Leaf size={14} /> {t('natureLabel')}
                            </div>
                            <h3 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
                                {t('futureLabel')}
                            </h3>
                            <p className="text-xl text-slate-500 font-medium leading-relaxed">
                                {t('natureDesc')}
                            </p>
                            <div className="flex items-center gap-6 pt-4">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-14 h-14 rounded-full border-4 border-white overflow-hidden bg-slate-100 shadow-lg shadow-slate-200">
                                            <img src={`/images/avatar-${i}.jpg`} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg font-black text-slate-900 leading-none">50K+</span>
                                    <span className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Global Impact</span>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="absolute -inset-4 bg-primary/10 rounded-[3rem] blur-2xl transform rotate-3" />
                            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-700">
                                <img
                                    src={images.programNature}
                                    className="w-full h-[600px] object-cover"
                                    alt={t('natureLabel')}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
