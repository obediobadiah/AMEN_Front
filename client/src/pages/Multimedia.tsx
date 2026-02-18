"use client";

import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { useTranslations } from 'next-intl';
import { images } from "@/lib/images";
import { Button } from "@/components/ui/button";
import { Play, Image as ImageIcon, ZoomIn, PlayCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Multimedia() {
    const t = useTranslations();
    const [activeTab, setActiveTab] = useState("all");

    const gallery = [
        { id: 1, type: "photo", title: t('multimediaPage.gallery.1.title'), category: t('multimediaPage.gallery.1.category'), image: images.news1 },
        { id: 2, type: "video", title: t('multimediaPage.gallery.2.title'), category: t('multimediaPage.gallery.2.category'), image: images.news2, videoUrl: "https://example.com/video1" },
        { id: 3, type: "photo", title: t('multimediaPage.gallery.3.title'), category: t('multimediaPage.gallery.3.category'), image: images.news3 },
        { id: 4, type: "photo", title: t('multimediaPage.gallery.4.title'), category: t('multimediaPage.gallery.4.category'), image: images.heroPrograms },
        { id: 5, type: "video", title: t('multimediaPage.gallery.5.title'), category: t('multimediaPage.gallery.5.category'), image: images.heroProjects, videoUrl: "https://example.com/video2" },
        { id: 6, type: "photo", title: t('multimediaPage.gallery.6.title'), category: t('multimediaPage.gallery.6.category'), image: images.heroActivities },
        { id: 7, type: "photo", title: t('multimediaPage.gallery.7.title'), category: t('multimediaPage.gallery.7.category'), image: images.heroContact },
        { id: 8, type: "video", title: t('multimediaPage.gallery.8.title'), category: t('multimediaPage.gallery.8.category'), image: images.news1, videoUrl: "https://example.com/video3" },
    ];

    const filteredItems = activeTab === "all"
        ? gallery
        : gallery.filter(item => item.type === activeTab);

    return (
        <Layout>
            <PageHero
                title={t('multimediaPage.title')}
                subtitle={t('multimediaPage.subtitle')}
                image={images.news3}
            />

            <section className="py-24 bg-background relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(var(--primary-rgb),0.05),transparent_50%)]" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-10 mb-20">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 text-primary text-xs font-black tracking-[0.3em] uppercase border border-primary/20 backdrop-blur-md"
                        >
                            <ImageIcon size={14} className="mb-0.5" />
                            <span>{t('multimediaPage.tabs.photos')} & {t('multimediaPage.tabs.videos')}</span>
                        </motion.div>
                        <h2 className="text-5xl md:text-7xl font-heading font-black text-foreground tracking-tight leading-[0.9]">
                            {t('multimediaPage.title')}
                        </h2>
                        <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
                            {t('multimediaPage.intro')}
                        </p>

                        {/* Tabs - Premium Styled */}
                        <div className="flex justify-center p-2 bg-muted/40 rounded-[2.5rem] w-fit mx-auto border border-border/50 backdrop-blur-xl shadow-inner group">
                            {["all", "photo", "video"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "px-10 py-3.5 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all duration-700 relative",
                                        activeTab === tab
                                            ? "bg-primary text-white shadow-2xl shadow-primary/30"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {tab === "all" ? t('actualitesPage.categories.all') : t(`multimediaPage.tabs.${tab}s`)}
                                    {activeTab === tab && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-primary rounded-[1.5rem] -z-10"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredItems.map((item, idx) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                                    className={cn(
                                        "group relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-muted cursor-pointer border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-700",
                                        item.id % 5 === 0 ? "md:col-span-2 md:aspect-auto" : ""
                                    )}
                                >
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />

                                    {/* Type Badge (Top Right) */}
                                    <div className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl text-white border border-white/20 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-all duration-500 z-20">
                                        {item.type === "video" ? <PlayCircle size={24} /> : <ImageIcon size={24} />}
                                    </div>

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-10 text-left">
                                        <div className="space-y-4 translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/40">
                                                    {item.type === "video" ? <Play fill="white" size={20} /> : <ZoomIn size={20} />}
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                                                    {item.category}
                                                </span>
                                            </div>
                                            <h4 className="text-white font-heading font-black text-2xl leading-tight">
                                                {item.title}
                                            </h4>
                                            {item.type === "video" && (
                                                <span className="text-white/50 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                                    <PlayCircle size={14} /> {t('multimediaPage.watchVideo')}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Static Title (Bottom Left - Always visible) */}
                                    <div className="absolute bottom-6 left-6 px-4 py-1.5 rounded-xl bg-slate-950/40 backdrop-blur-md opacity-100 group-hover:opacity-0 transition-opacity z-10">
                                        <span className="text-white/80 text-[10px] font-black uppercase tracking-widest">
                                            {item.title}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </section>
        </Layout>
    );
}
