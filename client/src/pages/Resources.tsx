"use client";

import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { useTranslations } from 'next-intl';
import { images } from "@/lib/images";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Download, Search, Filter, BookOpen, Presentation, Database, ExternalLink, ArrowRight, X } from "lucide-react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export default function Resources() {
    const t = useTranslations();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeType, setActiveType] = useState("all");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const resourceTypes = ["all", "report", "guide", "infographic", "policy", "database"];

    const resources = useMemo(() => [
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
    ], [t]);

    const filteredResources = resources.filter(resource => {
        const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = activeType === "all" || resource.type === activeType;
        return matchesSearch && matchesType;
    });

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
        hidden: { scale: 0.95, opacity: 0, y: 20 },
        visible: {
            scale: 1,
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: "easeOut" }
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
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-3xl shadow-2xl border border-border/50 hover:border-primary/30 transition-all duration-300">
                                <div className="relative flex-1">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                    <Input
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder={t('resourcesPage.knowledgeHub.searchPlaceholder')}
                                        className="pl-14 h-16 bg-background/50 border border-border/50 rounded-2xl focus-visible:ring-primary text-lg hover:border-primary/50 transition-all"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    )}
                                </div>
                                <div className="flex gap-4">
                                    <Button
                                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                                        variant={isFilterOpen ? "default" : "outline"}
                                        className={cn(
                                            "h-16 px-8 rounded-2xl border-border text-lg font-medium gap-2 transition-all duration-300",
                                            isFilterOpen && "bg-primary text-white shadow-lg shadow-primary/20"
                                        )}
                                    >
                                        <Filter size={20} /> {t('resourcesPage.knowledgeHub.filterButton')}
                                    </Button>
                                    <Button className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all active:translate-y-0 group">
                                        {t('resourcesPage.knowledgeHub.searchButton')}
                                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </div>
                            </div>

                            {/* Filters Expansion */}
                            <AnimatePresence>
                                {isFilterOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="bg-card/50 backdrop-blur-md border border-border/50 rounded-3xl p-6 flex flex-wrap gap-3">
                                            {resourceTypes.map((type) => (
                                                <Button
                                                    key={type}
                                                    onClick={() => setActiveType(type)}
                                                    variant={activeType === type ? "default" : "outline"}
                                                    className={cn(
                                                        "rounded-xl h-12 px-6 font-bold transition-all duration-300",
                                                        activeType === type ? "bg-primary text-white shadow-md shadow-primary/10" : "hover:border-primary/50"
                                                    )}
                                                >
                                                    {type === "all" ? "All Resources" : t(`resourcesPage.types.${type}`)}
                                                </Button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>

            {/* Resources Grid */}
            <section className="py-24 bg-background/50">
                <div className="container mx-auto px-4">
                    {filteredResources.length > 0 ? (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            <AnimatePresence mode="popLayout">
                                {filteredResources.map((resource) => (
                                    <motion.div
                                        key={resource.id}
                                        layout
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit={{ opacity: 0, scale: 0.9 }}
                                    >
                                        <Card className="h-full bg-card border border-border/50 hover:border-primary/30 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-[2rem] overflow-hidden group">
                                            <div className="p-10 flex flex-col h-full justify-between space-y-8">
                                                <div className="space-y-6">
                                                    <div className="flex justify-between items-start">
                                                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-inner">
                                                            <resource.icon size={32} />
                                                        </div>
                                                        <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/30 transition-colors">
                                                            {t(`resourcesPage.types.${resource.type}`)}
                                                        </span>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <h3 className="text-2xl font-bold font-heading text-foreground group-hover:text-primary transition-colors leading-tight">
                                                            {resource.title}
                                                        </h3>
                                                        <p className="text-muted-foreground leading-relaxed line-clamp-3 font-light">
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
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20 space-y-6 bg-card/30 rounded-[3rem] border border-dashed border-border/50"
                        >
                            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                                <Search size={40} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold">No resources found</h3>
                                <p className="text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
                            </div>
                            <Button onClick={() => { setSearchQuery(""); setActiveType("all"); }} variant="outline" className="rounded-xl">
                                Clear all filters
                            </Button>
                        </motion.div>
                    )}

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
