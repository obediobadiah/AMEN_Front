"use client";

import { Layout } from "@/components/Layout";
import { images } from "@/lib/images";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Users, Briefcase, Settings, Landmark, ChevronRight, User, Award, Gavel, Building2 } from "lucide-react";
import Image from "next/image";

interface Member {
    name: string;
    title: string;
}

interface Organ {
    id: string;
    icon: any;
    color: string;
}
import { PageHero } from "@/components/PageHero";
import { useState } from "react";
import React from "react";
import { cn } from "@/lib/utils";

export default function Governance() {
    const t = useTranslations('aboutPage.governance');
    const tTeam = useTranslations('aboutPage.governance.teamSection');
    const [activeFilter, setActiveFilter] = useState('all');

    const organs: Organ[] = [
        { id: "ag", icon: Users, color: "text-blue-600 bg-blue-50" },
        { id: "cd", icon: Landmark, color: "text-indigo-600 bg-indigo-50" },
        { id: "pe", icon: Briefcase, color: "text-amber-600 bg-amber-50" },
        { id: "dg", icon: Settings, color: "text-emerald-600 bg-emerald-50" },
    ];

    // Get values from translations
    const values = [
        { label: t('values.0.label'), color: 'text-blue-400' },
        { label: t('values.1.label'), color: 'text-emerald-400' },
        { label: t('values.2.label'), color: 'text-amber-400' },
        { label: t('values.3.label'), color: 'text-purple-400' }
    ] as const;
    const valueIcons = [Shield, Users, Gavel, Settings];

    // Helper function to get members for an organ
    const getOrganMembers = (organId: string): Member[] => {
        const membersData = t.raw(`organs.${organId}.members`);
        return Array.isArray(membersData) ? membersData : [];
    };

    return (
        <Layout>
            <PageHero
                title={t('title')}
                subtitle={t('subtitle')}
                image={images.heroGovernance}
            />

            {/* Introductory Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="container mx-auto px-4 max-w-5xl">

                    {/* Filter buttons */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-900 font-black text-xs uppercase tracking-[0.2em]"
                        >
                            <Shield size={14} className="text-primary" /> {tTeam('transparencyBadge')}
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mt-16 text-center"
                        >
                            {t('organsTitle')}
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed text-center"
                        >
                            {t('intro')}
                        </motion.p>
                    </div>

                    {/* Organs Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                        {organs.map((organ, i) => (
                            <motion.div
                                key={organ.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.7 }}
                                className="group bg-slate-50 rounded-[3rem] p-10 lg:p-14 border border-slate-100 hover:border-primary/20 hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all duration-700 relative overflow-hidden"
                            >
                                <div className="relative z-10 flex flex-col h-full">
                                    <div className={cn(
                                        "w-16 h-16 rounded-2xl flex items-center justify-center mb-10 transition-transform group-hover:scale-110 duration-500",
                                        organ.color
                                    )}>
                                        <organ.icon size={28} className="stroke-[2]" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight group-hover:text-primary transition-colors">
                                        {t(`organs.${organ.id}.title`)}
                                    </h3>
                                    <p className="text-lg text-slate-500 font-medium leading-relaxed mb-auto">
                                        {t(`organs.${organ.id}.desc`)}
                                    </p>
                                </div>
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/10 transition-colors" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Members Section */}
            <section className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-100/50 [mask-image:linear-gradient(0deg,transparent,white,transparent)]" />
                <div className="container mx-auto px-4 relative">
                    <div className="text-center max-w-4xl mx-auto mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary/10 text-primary font-black text-sm uppercase tracking-[0.2em] mb-8"
                        >
                            <Users size={16} className="text-primary" /> {tTeam('title')}
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6 mt-8"
                        >
                            {tTeam('subtitle')}
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-slate-500 font-medium max-w-3xl mx-auto"
                        >
                            <p className="w-full text-center text-sm text-slate-500 mb-4">{tTeam('filterLabel')}</p>
                        </motion.p>
                    </div>

                    {/* Filter buttons */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        <button
                            onClick={() => setActiveFilter('all')}
                            className={`px-6 py-2.5 rounded-full font-bold text-sm uppercase tracking-wide transition-colors ${activeFilter === 'all'
                                    ? 'bg-primary text-white'
                                    : 'bg-white text-slate-700 hover:bg-slate-100'
                                }`}
                        >
                            {tTeam('filterAll')}
                        </button>
                        {organs.map((organ) => (
                            <button
                                key={organ.id}
                                onClick={() => setActiveFilter(organ.id)}
                                className={`px-6 py-2.5 rounded-full font-bold text-sm uppercase tracking-wide transition-colors flex items-center gap-2 ${activeFilter === organ.id
                                        ? `bg-primary text-white`
                                        : 'bg-white text-slate-700 hover:bg-slate-100'
                                    }`}
                            >
                                <organ.icon size={16} />
                                {t(`organs.${organ.id}.shortTitle`)}
                            </button>
                        ))}
                    </div>

                    {/* Team Members Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
                        {organs
                            .filter(organ => activeFilter === 'all' || activeFilter === organ.id)
                            .flatMap(organ =>
                                getOrganMembers(organ.id).map((member, index) => (
                                    <motion.div
                                        key={`${organ.id}-${index}`}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1, duration: 0.5 }}
                                        className="group relative overflow-hidden rounded-3xl bg-white p-0.5"
                                    >
                                        <div className="absolute inset-0.5 bg-white/80 backdrop-blur-sm rounded-[1.1rem] group-hover:bg-white/90 transition-all duration-500" />
                                        <div className="relative p-6 h-full flex flex-col items-center text-center">
                                            <div className="w-32 h-32 rounded-full bg-slate-100 mb-6 overflow-hidden relative group-hover:ring-4 group-hover:ring-primary/20 transition-all duration-500">
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <User size={48} className="opacity-50" />
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900 mb-1 leading-tight group-hover:text-primary transition-colors">
                                                {member.name}
                                            </h3>
                                            <p className="text-sm text-primary font-semibold mb-3">
                                                {member.title}
                                            </p>
                                            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-4">
                                                {t(`organs.${organ.id}.title`)}
                                            </p>
                                            <div className="mt-auto pt-4 border-t border-slate-100 w-full">
                                                <div className="flex justify-center gap-3">
                                                    {organ.id === 'ag' && <Award className="text-amber-500" size={18} />}
                                                    {organ.id === 'cd' && <Gavel className="text-blue-500" size={18} />}
                                                    {organ.id === 'pe' && <Briefcase className="text-emerald-500" size={18} />}
                                                    {organ.id === 'dg' && <Building2 className="text-indigo-500" size={18} />}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 bg-[#0f172a] overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto space-y-10"
                    >
                        <h3 className="text-3xl md:text-5xl font-black text-white italic tracking-tight">
                            "{tTeam('description')}"
                        </h3>
                        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                            {values?.map((item, i) => (
                                <motion.div
                                    key={i}
                                    className="flex flex-col items-center gap-4 group"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-500">
                                        {valueIcons[i] && React.createElement(valueIcons[i], {
                                            size: 28,
                                            className: `${item.color} group-hover:scale-110 transition-transform duration-500`
                                        })}
                                    </div>
                                    <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-white transition-colors">
                                        {item.label}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>
        </Layout>
    );
}

