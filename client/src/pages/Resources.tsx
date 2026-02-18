"use client";

import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { useTranslations } from 'next-intl';
import { images } from "@/lib/images";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Download, Search, Filter, BookOpen, Presentation, Database, ExternalLink, ArrowRight } from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function Resources() {
    const t = useTranslations();



const resources = [
    {
        id: 1,
        title: t('resourcesPage.resources.annualReport.title'),
        description: t('resourcesPage.resources.annualReport.description'),
        type: "report",
        size: "4.5 MB",
        date: "Jan 2024",
        icon: FileText
    },
    {
        id: 2,
        title: t('resourcesPage.resources.forestryGuide.title'),
        description: t('resourcesPage.resources.forestryGuide.description'),
        type: "guide",
        size: "12.2 MB",
        date: "Mar 2024",
        icon: BookOpen
    },
    {
        id: 3,
        title: t('resourcesPage.resources.agricultureGuide.title'),
        description: t('resourcesPage.resources.agricultureGuide.description'),
        type: "guide",
        size: "8.1 MB",
        date: "Feb 2024",
        icon: Presentation
    },
    {
        id: 4,
        title: t('resourcesPage.resources.policyBrief.title'),
        description: t('resourcesPage.resources.policyBrief.description'),
        type: "policy",
        size: "2.3 MB",
        date: "Nov 2023",
        icon: Database
    },
    {
        id: 5,
        title: t('resourcesPage.resources.environmentalData.title'),
        description: t('resourcesPage.resources.environmentalData.description'),
        type: "database",
        size: t('resourcesPage.common.varies'),
        date: t('resourcesPage.common.updatedWeekly'),
        icon: FileText
    },
    {
        id: 6,
        title: t('resourcesPage.resources.businessToolkit.title'),
        description: t('resourcesPage.resources.businessToolkit.description'),
        type: "guide",
        size: "15.4 MB",
        date: "Dec 2023",
        icon: BookOpen
    }
];


    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { scale: 0.95, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: { duration: 0.4 }
        }
    };

    return (
        <Layout>
            <PageHero
                title={t('resourcesPage.title')}
                subtitle={t('resourcesPage.subtitle')}
                image={images.programWomen}
            />

            {/* Resource Center Intro & Search */}
            <section className="py-24 bg-background/80 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <div className="text-center space-y-6">
                            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground leading-tight">
                                {t('resourcesPage.knowledgeHub.title')}
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                {t('resourcesPage.intro')}
                            </p>
                        </div>

                        {/* Search & Filter Bar */}
                        <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-2xl shadow-lg border border-border/50 hover:border-primary/30 transition-colors">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                <Input
                                    placeholder={t('resourcesPage.knowledgeHub.searchPlaceholder')}
                                    className="pl-12 h-14 bg-background/50 border border-border/50 rounded-2xl focus-visible:ring-primary text-lg hover:border-primary/50 transition-colors"
                                />
                            </div>
                            <Button variant="outline" className="h-14 px-8 rounded-2xl border-border hover:bg-accent/50 hover:border-primary/30 text-lg font-medium gap-2 transition-colors">
                                <Filter size={20} /> {t('resourcesPage.knowledgeHub.filterButton')}
                            </Button>
                            <Button className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                                {t('resourcesPage.knowledgeHub.searchButton')}
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Resources Grid */}
            <section className="py-24 bg-background/50">
                <div className="container mx-auto px-4">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {resources.map((resource) => (
                            <motion.div key={resource.id} variants={itemVariants}>
                                <Card className="h-full bg-card border border-border/50 hover:border-primary/30 shadow-lg hover:shadow-xl transition-all duration-500 rounded-3xl overflow-hidden group">
                                    <div className="p-10 flex flex-col h-full justify-between space-y-8">
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-start">
                                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 shadow-inner">
                                                    <resource.icon size={32} />
                                                </div>
                                                <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/30 transition-colors">
                                                    {t(`resourcesPage.types.${resource.type}`, {
                                                        defaultValue: resource.type // Fallback to the original value if translation is missing
                                                    })}
                                                </span>
                                            </div>
                                            <div className="space-y-3">
                                                <h3 className="text-2xl font-bold font-heading text-foreground group-hover:text-primary transition-colors">
                                                    {resource.title}
                                                </h3>
                                                <p className="text-muted-foreground leading-relaxed line-clamp-3">
                                                    {resource.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between text-sm font-medium text-muted-foreground border-t border-border pt-6">
                                                <div className="flex items-center gap-2">
                                                    <ExternalLink size={14} className="text-primary" />
                                                    <span>{resource.date}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Database size={14} className="text-primary" />
                                                    <span>{resource.size}</span>
                                                </div>
                                            </div>
                                            <Button className="w-full h-14 rounded-2xl bg-background border-2 border-primary/20 hover:border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-bold text-lg group/btn shadow-sm hover:shadow-md">
                                                {t('resourcesPage.download')} <Download className="ml-2 h-5 w-5 transition-transform group-hover/btn:translate-y-1" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="mt-20 text-center">
                        <Button variant="link" className="text-primary text-lg font-bold gap-2 hover:no-underline group">
                            {t('resourcesPage.knowledgeHub.contactCta')} <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Subscription/Help Section */}
            <section className="py-24 bg-background/80 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-12 md:p-20 relative overflow-hidden shadow-2xl">
                        {/* Decorative background logo or pattern */}
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px]" />
                        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px]" />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
                            <div className="space-y-8">
                                <h2 className="text-4xl md:text-6xl font-heading font-bold text-white leading-tight">
                                    {t('resourcesPage.subscription.title')}
                                </h2>
                                <p className="text-xl text-white/70 leading-relaxed max-w-xl">
                                    {t('resourcesPage.subscription.description')}
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Input
                                        placeholder={t('resourcesPage.subscription.emailPlaceholder')}
                                        className="h-16 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus-visible:ring-primary text-lg px-8 hover:border-white/30 transition-colors"
                                    />
                                    <Button className="h-16 px-12 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all">
                                        {t('resourcesPage.subscription.subscribeButton')}
                                    </Button>
                                </div>
                            </div>
                            <div className="hidden lg:block">
                                <div className="relative">
                                    <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-2xl animate-pulse" />
                                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] space-y-8 hover:border-white/20 transition-colors">
                                        <div className="space-y-4">
                                            <h4 className="text-2xl font-bold font-heading text-white">
                                                {t('resourcesPage.subscription.highlights.title')}
                                            </h4>
                                            <p className="text-white/60">
                                                {t('resourcesPage.subscription.highlights.description')}
                                            </p>
                                        </div>
                                        <div className="space-y-6">
                                            {t.raw('resourcesPage.subscription.highlights.items').map((item: string, idx: number) => (
                                                <div key={idx} className="flex items-center gap-4 group cursor-pointer">
                                                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all border border-white/5">
                                                        <FileText size={20} />
                                                    </div>
                                                    <span className="text-white/90 font-medium group-hover:text-primary transition-colors">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
