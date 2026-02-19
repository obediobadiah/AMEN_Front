"use client";

import { Layout } from "@/components/Layout";
import { images } from "@/lib/images";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Target, Heart, Briefcase, Utensils, Leaf, Users, Shield } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { cn } from "@/lib/utils";

export default function Objectives() {
    const t = useTranslations('aboutPage.objectives');

    const specificObjectives = [
        { 
            id: "1", 
            icon: Shield, 
            color: "text-rose-600 bg-rose-50",
            bgColor: "bg-rose-50"
        },
        { 
            id: "2", 
            icon: Briefcase, 
            color: "text-blue-600 bg-blue-50",
            bgColor: "bg-blue-50"
        },
        { 
            id: "3", 
            icon: Heart, 
            color: "text-amber-600 bg-amber-50",
            bgColor: "bg-amber-50"
        },
        { 
            id: "4", 
            icon: Leaf, 
            color: "text-emerald-600 bg-emerald-50",
            bgColor: "bg-emerald-50"
        },
        { 
            id: "5", 
            icon: Users, 
            color: "text-indigo-600 bg-indigo-50",
            bgColor: "bg-indigo-50"
        },
    ];

    return (
        <Layout>
            <PageHero
                title={t('title')}
                subtitle={t('subtitle')}
                image={images.heroObjectives}
            />

            {/* Global Objective Section */}
            <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-100/50 [mask-image:linear-gradient(0deg,transparent,white,transparent)]" />
                <div className="container mx-auto px-4 relative">
                    <div className="max-w-5xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary/10 text-primary font-black text-sm uppercase tracking-[0.2em] mb-8"
                        >
                            <Target size={16} className="text-primary" /> {t('goalLabel')}
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight mb-8"
                        >
                            {t('globalObjectiveTitle')}
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed max-w-4xl mx-auto"
                        >
                            {t('globalObjectiveText')}
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Specific Objectives Grid */}
            <section className="pb-24 bg-white relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-100/50 [mask-image:linear-gradient(0deg,transparent,white,transparent)]" />
                <div className="container mx-auto px-4 relative">
                    <div className="text-center max-w-4xl mx-auto mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
                            {t('specificObjectivesTitle')}
                        </h2>
                        <p className="text-xl text-slate-500 font-medium max-w-3xl mx-auto">
                            {t('specificObjectivesDesc')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {specificObjectives.map((obj, i) => (
                            <motion.div
                                key={obj.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className={`group relative overflow-hidden rounded-3xl ${obj.bgColor} p-0.5`}
                            >
                                <div className="absolute inset-0.5 bg-white/80 backdrop-blur-sm rounded-[1.1rem] group-hover:bg-white/90 transition-all duration-500" />
                                <div className="relative p-8 h-full flex flex-col">
                                    <div className={cn(
                                        "w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg",
                                        obj.color
                                    )}>
                                        <obj.icon size={28} className="stroke-[2]" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 mb-4 leading-tight group-hover:text-primary transition-colors">
                                        {t(`specific.${obj.id}.title`)}
                                    </h3>
                                    <p className="text-slate-600 mb-6 flex-1">
                                        {t(`specific.${obj.id}.desc`)}
                                    </p>
                                    <div className="h-1 w-12 bg-slate-200 group-hover:w-20 group-hover:bg-primary transition-all duration-500 rounded-full" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Implementation Stats */}
            <section className="py-24 bg-[#0f172a] text-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
                        {[
                            { val: "50k+", label: t('stats.beneficiaries') },
                            { val: "12", label: t('stats.years') },
                            { val: "25+", label: t('stats.projects') },
                            { val: "100%", label: t('stats.commitment') }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="space-y-4"
                            >
                                <div className="text-5xl md:text-7xl font-black text-primary tracking-tighter">{stat.val}</div>
                                <div className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </Layout>
    );
}

