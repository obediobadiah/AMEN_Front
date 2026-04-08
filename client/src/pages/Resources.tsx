"use client";

import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { useTranslations } from 'next-intl';
import { images } from "@/lib/images";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Download, Search, Filter, BookOpen, Presentation, Database, ExternalLink, ArrowRight, X, FileQuestion, Eye } from "lucide-react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { useState, useMemo, Key } from "react";
import { cn } from "@/lib/utils";
import { useResources, ResourceItem } from "@/hooks/use-resources";
import { useLocale } from "next-intl";
import { getImageUrl } from "@/lib/api-config";
import { format } from "date-fns";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { FileViewer } from "@/components/FileViewer";

// Map category string to an icon component
function getCategoryIcon(category?: string) {
    const cat = (category || "").toLowerCase();
    if (cat === "guide") return BookOpen;
    if (cat === "infographic") return Presentation;
    if (cat === "database") return Database;
    return FileText;
}

export default function Resources() {
    const t = useTranslations();
    const locale = useLocale();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeType, setActiveType] = useState("all");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { resources, isLoading, recordDownload } = useResources();

    // Viewer state
    const [viewerOpen, setViewerOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ResourceItem | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const resourceTypes = ["all", "guide", "infographic", "database", "toolkit"];

    // Translate a localised JSONB dict to display string
    const getLocalTitle = (item: ResourceItem) =>
        (item.title as any)[locale] || item.title?.fr || item.title?.en || "";

    const getLocalDesc = (item: ResourceItem) =>
        item.description
            ? ((item.description as any)[locale] || item.description?.fr || item.description?.en || "")
            : "";

    const filteredResources = useMemo(() => {
        return resources.filter(item => {
            const title = getLocalTitle(item).toLowerCase();
            const desc = getLocalDesc(item).toLowerCase();
            const search = searchQuery.toLowerCase();
            const matchesSearch = title.includes(search) || desc.includes(search);
            const matchesType = activeType === "all" || item.category?.toLowerCase() === activeType.toLowerCase();
            return matchesSearch && matchesType;
        });
    }, [resources, searchQuery, activeType, locale]);

    // Derived pagination values
    const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
    const paginatedResources = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredResources.slice(start, start + itemsPerPage);
    }, [filteredResources, currentPage, itemsPerPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        const element = document.getElementById('resources-grid');
        if (element) {
            const yOffset = -100;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    // Reset page when filtering
    const handleSearchChange = (val: string) => {
        setSearchQuery(val);
        setCurrentPage(1);
    };

    const handleTypeChange = (type: string) => {
        setActiveType(type);
        setCurrentPage(1);
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
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

    const handleView = async (item: ResourceItem) => {
        if (item.file_url) {
            setSelectedItem(item);
            setViewerOpen(true);
            try { await recordDownload(item.id); } catch (e) { /* silently ignore stats error */ }
        }
    };

    return (
        <Layout>
            <PageHero
                title={t('resourcesPage.title')}
                subtitle={t('resourcesPage.subtitle')}
                image={images.heroResourcesCenter}
            />

            {/* Resource Center Intro & Search */}
            <section className="py-24 bg-background/80 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <div className="text-center space-y-6">
                            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground leading-tight">
                                {t('resourcesPage.ResourceCenter.title')}
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
                                        onChange={(e) => handleSearchChange(e.target.value)}
                                        placeholder={t('resourcesPage.ResourceCenter.searchPlaceholder')}
                                        className="pl-14 h-16 bg-background/50 border border-border/50 rounded-2xl focus-visible:ring-primary text-lg hover:border-primary/50 transition-all"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => handleSearchChange("")}
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
                                        <Filter size={20} /> {t('resourcesPage.ResourceCenter.filterButton')}
                                    </Button>
                                    <Button className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all active:translate-y-0 group">
                                        {t('resourcesPage.ResourceCenter.searchButton')}
                                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </div>
                            </div>

                            {/* Filter Type Pills */}
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
                                                    onClick={() => handleTypeChange(type)}
                                                    variant={activeType === type ? "default" : "outline"}
                                                    className={cn(
                                                        "rounded-xl h-12 px-6 font-bold transition-all duration-300",
                                                        activeType === type ? "bg-primary text-white shadow-md shadow-primary/10" : "hover:border-primary/50"
                                                    )}
                                                >
                                                    {type === "all"
                                                        ? t('resourcesPage.types.all')
                                                        : t(`resourcesPage.types.${type}`)}
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
            <section id="resources-grid" className="py-24 bg-background/50">
                <div className="container mx-auto px-4">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="rounded-[2rem] bg-card border border-border/30 h-80 animate-pulse" />
                            ))}
                        </div>
                    ) : paginatedResources.length > 0 ? (
                        <div className="space-y-16">
                            <motion.div
                                key={currentPage}
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch"
                            >
                                <AnimatePresence mode="popLayout">
                                    {paginatedResources.map((resource) => {
                                        const Icon = getCategoryIcon(resource.category);
                                        const title = getLocalTitle(resource);
                                        const desc = getLocalDesc(resource);
                                        const dateStr = resource.created_at
                                            ? format(new Date(resource.created_at), "MMM yyyy")
                                            : "";

                                        return (
                                            <motion.div
                                                key={resource.id}
                                                layout
                                                variants={itemVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className="h-full"
                                            >
                                                <Card className="flex flex-col bg-card border border-border/50 hover:border-primary/30 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-[2rem] overflow-hidden group h-full">
                                                    {/* Thumbnail — first page of the PDF */}
                                                    {resource.thumbnail_url && (
                                                        <div className="relative w-full h-48 flex-shrink-0 overflow-hidden">
                                                            <img
                                                                src={getImageUrl(resource.thumbnail_url)}
                                                                alt={title}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).parentElement!.style.display = "none";
                                                                }}
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                                            <span className="absolute top-3 right-3 text-[10px] font-black uppercase tracking-widest text-white bg-primary/80 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                                                {resource.file_type || "PDF"}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Card body — grows to fill remaining space */}
                                                    <div className="flex flex-col flex-1 p-8 gap-6">
                                                        {/* Top: icon + category badge + title + desc */}
                                                        <div className="space-y-5 flex-1">
                                                            <div className="flex justify-between items-start">
                                                                {!resource.thumbnail_url && (
                                                                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-inner">
                                                                        <Icon size={28} />
                                                                    </div>
                                                                )}
                                                                <span className={cn(
                                                                    "text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/30 transition-colors",
                                                                    resource.thumbnail_url && "ml-auto"
                                                                )}>
                                                                    {resource.category
                                                                        ? (["report", "guide", "infographic", "policy", "database"].includes(resource.category.toLowerCase())
                                                                            ? t(`resourcesPage.types.${resource.category.toLowerCase()}`)
                                                                            : resource.category)
                                                                        : t('resourcesPage.types.report')}
                                                                </span>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <h3 className="text-xl font-bold font-heading text-foreground group-hover:text-primary transition-colors leading-tight cursor-pointer" onClick={() => handleView(resource)}>
                                                                    {title}
                                                                </h3>
                                                                {desc && (
                                                                    <p className="text-muted-foreground leading-relaxed line-clamp-3 font-light text-sm">
                                                                        {desc}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Bottom: meta + buttons — always at the bottom */}
                                                        <div className="space-y-4 mt-auto">
                                                            <div className="flex items-center justify-between text-sm font-medium text-muted-foreground border-t border-border pt-4">
                                                                <div className="flex items-center gap-2">
                                                                    <ExternalLink size={14} className="text-primary" />
                                                                    <span>{dateStr}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Database size={14} className="text-primary" />
                                                                    <span>{resource.file_size || "-"}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </motion.div>
                                        );

                                    })}
                                </AnimatePresence>
                            </motion.div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (currentPage > 1) handlePageChange(currentPage - 1);
                                                }}
                                                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>

                                        {[...Array(totalPages)].map((_, i) => {
                                            const page = i + 1;
                                            if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                                                return (
                                                    <PaginationItem key={page}>
                                                        <PaginationLink
                                                            href="#"
                                                            isActive={currentPage === page}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handlePageChange(page);
                                                            }}
                                                            className="cursor-pointer"
                                                        >
                                                            {page}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                );
                                            } else if (page === currentPage - 2 || page === currentPage + 2) {
                                                return (
                                                    <PaginationItem key={page}>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                );
                                            }
                                            return null;
                                        })}

                                        <PaginationItem>
                                            <PaginationNext
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (currentPage < totalPages) handlePageChange(currentPage + 1);
                                                }}
                                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            )}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20 space-y-6 bg-card/30 rounded-[3rem] border border-dashed border-border/50"
                        >
                            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                                <FileQuestion size={40} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold">{t('resourcesPage.noResults.title')}</h3>
                                <p className="text-muted-foreground">{t('resourcesPage.noResults.description')}</p>
                            </div>
                            <Button onClick={() => { setSearchQuery(""); setActiveType("all"); }} variant="outline" className="rounded-xl">
                                {t('resourcesPage.noResults.clearFilters')}
                            </Button>
                        </motion.div>
                    )}

                    <div className="mt-20 text-center">
                        <Button variant="link" className="text-primary text-lg font-bold gap-2 hover:no-underline group">
                            {t('resourcesPage.ResourceCenter.contactCta')} <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Subscription / Help Section */}
            <section className="py-24 bg-background/80 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-12 md:p-20 relative overflow-hidden shadow-2xl">
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

            <FileViewer
                isOpen={viewerOpen}
                onClose={() => setViewerOpen(false)}
                url={selectedItem?.file_url ? getImageUrl(selectedItem.file_url) : null}
                title={selectedItem ? getLocalTitle(selectedItem) : ""}
            />
        </Layout>
    );
}
