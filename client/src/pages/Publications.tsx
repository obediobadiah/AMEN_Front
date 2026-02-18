"use client";

import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { useTranslations } from 'next-intl';
import { images } from "@/lib/images";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, ArrowRight, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Publications() {
    const t = useTranslations();
    const [filter, setFilter] = useState("all");

    const publications = [
        {
            id: 1,
            title: t('publicationsPage.items.1.title'),
            description: t('publicationsPage.items.1.description'),
            category: "annual",
            date: "Jan 2024",
            size: "4.2 MB",
            type: "PDF"
        },
        {
            id: 2,
            title: t('publicationsPage.items.2.title'),
            description: t('publicationsPage.items.2.description'),
            category: "technical",
            date: "Nov 2023",
            size: "12.5 MB",
            type: "PDF"
        },
        {
            id: 3,
            title: t('publicationsPage.items.3.title'),
            description: t('publicationsPage.items.3.description'),
            category: "technical",
            date: "Aug 2023",
            size: "8.1 MB",
            type: "PDF"
        },
        {
            id: 4,
            title: t('publicationsPage.items.4.title'),
            description: t('publicationsPage.items.4.description'),
            category: "research",
            date: "Jun 2023",
            size: "5.7 MB",
            type: "PDF"
        },
        {
            id: 5,
            title: t('publicationsPage.items.5.title'),
            description: t('publicationsPage.items.5.description'),
            category: "annual",
            date: "Feb 2022",
            size: "2.8 MB",
            type: "PDF"
        },
        {
            id: 6,
            title: t('publicationsPage.items.6.title'),
            description: t('publicationsPage.items.6.description'),
            category: "technical",
            date: "Oct 2023",
            size: "3.4 MB",
            type: "PDF"
        }
    ];

    const filteredPubs = filter === "all"
        ? publications
        : publications.filter(pub => pub.category === filter);

    return (
        <Layout>
            <PageHero
                title={t('publicationsPage.title')}
                subtitle={t('publicationsPage.subtitle')}
                image={images.heroActivities}
            />

            <section className="py-24 bg-background relative overflow-hidden">
                {/* Background Decorative Circles */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[80px] -z-10 -translate-x-1/2 translate-y-1/2" />

                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center space-y-10 mb-24">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary mx-auto border border-primary/20 backdrop-blur-sm shadow-xl shadow-primary/5"
                        >
                            <BookOpen size={48} />
                        </motion.div>
                        <h2 className="text-5xl md:text-7xl font-heading font-black text-foreground tracking-tight leading-[0.9]">
                            {t('publicationsPage.title')}
                        </h2>
                        <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
                            {t('publicationsPage.intro')}
                        </p>

                        {/* Filter Tabs - Premium Styled */}
                        <div className="flex flex-wrap justify-center gap-3 p-2 bg-muted/40 rounded-[2.5rem] w-fit mx-auto border border-border/50 backdrop-blur-xl shadow-inner">
                            {["all", "annual", "technical", "research"].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={cn(
                                        "px-10 py-3.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-700 relative",
                                        filter === cat
                                            ? "bg-primary text-white shadow-2xl shadow-primary/30"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {t(`publicationsPage.categories.${cat}`)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12">
                        {filteredPubs.map((pub, idx) => (
                            <motion.div
                                key={pub.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative bg-card p-8 md:p-12 rounded-[3.5rem] border border-border/40 hover:border-primary/40 transition-all duration-700 hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] flex flex-col sm:flex-row gap-10 items-start overflow-hidden"
                            >
                                {/* Decorative background gradient on hover */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                <div className="relative w-full sm:w-32 aspect-[3/4] bg-muted/30 rounded-[1.5rem] flex-shrink-0 flex items-center justify-center group-hover:bg-primary/5 transition-colors duration-700 overflow-hidden border border-border/50 shadow-lg group-hover:shadow-primary/10">
                                    <FileText size={64} className="text-muted-foreground/30 group-hover:text-primary/40 transform transition-transform group-hover:scale-110" />
                                    <div className="absolute inset-0 border-r-8 border-primary/10 group-hover:border-primary transition-all duration-500" />
                                    <div className="absolute bottom-0 left-0 w-full h-2 bg-primary/20 group-hover:h-4 group-hover:bg-primary transition-all duration-500" />
                                </div>

                                <div className="flex-grow space-y-6">
                                    <div className="flex flex-wrap items-center gap-6">
                                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
                                            {t(`publicationsPage.categories.${pub.category}`)}
                                        </span>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-black uppercase tracking-widest">
                                            <Calendar size={14} className="text-primary" />
                                            {pub.date}
                                        </div>
                                    </div>

                                    <h3 className="text-2xl md:text-3xl font-black font-heading text-foreground group-hover:text-primary transition-colors leading-tight">
                                        {pub.title}
                                    </h3>

                                    <p className="text-lg text-muted-foreground leading-relaxed line-clamp-2 font-light">
                                        {pub.description}
                                    </p>

                                    <div className="pt-8 flex flex-wrap items-center justify-between gap-6 border-t border-border/30">
                                        <div className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-3">
                                            <span className="w-2 h-2 rounded-full bg-primary" />
                                            {pub.type} <span className="opacity-30">•</span> {pub.size}
                                        </div>
                                        <Button className="h-14 px-10 rounded-2xl bg-foreground hover:bg-primary text-background font-black uppercase tracking-widest text-xs transition-all flex items-center gap-3 group/btn shadow-xl shadow-black/10 hover:-translate-y-1">
                                            {t('publicationsPage.download')}
                                            <Download size={20} className="transition-transform group-hover/btn:translate-y-1" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </Layout>
    );
}
