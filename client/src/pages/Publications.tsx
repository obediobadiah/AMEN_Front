"use client";

import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { useTranslations, useLocale } from 'next-intl';
import { images } from "@/lib/images";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Calendar, ArrowRight, BookOpen, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { usePublications } from "@/hooks/use-publications";
import { getImageUrl } from "@/lib/api-config";
import { useMemo } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { format } from "date-fns";
import { FileViewer } from "@/components/FileViewer";

export default function Publications() {
    const t = useTranslations();
    const locale = useLocale();
    const [activeCategory, setActiveCategory] = useState("all");
    const { publications, isLoading, recordDownload } = usePublications();

    const [viewerOpen, setViewerOpen] = useState(false);
    const [selectedPub, setSelectedPub] = useState<any>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const filteredPublications = useMemo(() => {
        return activeCategory === "all"
            ? publications
            : publications.filter(pub => {
                const pubCat = (pub.category as any)?.[locale] || (pub.category as any)?.fr || pub.category;
                return pubCat === activeCategory;
            });
    }, [publications, activeCategory, locale]);

    const handleView = async (pub: any) => {
        if (!pub.file_url) return;
        setSelectedPub(pub);
        setViewerOpen(true);
        try {
            await recordDownload(pub.id);
        } catch (error) {
            console.error("Failed to record view statistic", error);
        }
    };

    const totalPages = Math.ceil(filteredPublications.length / itemsPerPage);
    const paginatedPublications = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredPublications.slice(start, start + itemsPerPage);
    }, [filteredPublications, currentPage, itemsPerPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        const element = document.getElementById('publications-grid');
        if (element) {
            const yOffset = -100;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const handleCategoryChange = (cat: string) => {
        setActiveCategory(cat);
        setCurrentPage(1);
    };

    return (
        <Layout>
            <PageHero
                title={t('publicationsPage.title')}
                subtitle={t('publicationsPage.subtitle')}
                image={images.heroPublication}
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
                        <div className="flex flex-wrap gap-2 p-1.5 bg-muted/30 rounded-full border border-border/50 backdrop-blur-sm">
                            {["all", "annual", "technical", "research"].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => handleCategoryChange(cat)}
                                    className={cn(
                                        "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500",
                                        activeCategory === cat
                                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    )}
                                >
                                    {t(`publicationsPage.categories.${cat}`)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        </div>
                    ) : filteredPublications.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground text-xl">
                            {t('publicationsPage.noRecords')}
                        </div>
                    ) : (
                        <>
                            {/* Publications List */}
                            <div id="publications-grid" className="scroll-mt-24 space-y-16">
                                <motion.div
                                    key={`${activeCategory}-${currentPage}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                >
                                    {paginatedPublications.map((pub, idx) => (
                                        <motion.div
                                            key={pub.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="group flex flex-col bg-card rounded-[2rem] border border-border/40 overflow-hidden hover:border-primary/30 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500"
                                        >
                                            {/* ... same article content ... */}
                                            <div className="relative aspect-[3/4] overflow-hidden">
                                                <img
                                                    src={getImageUrl(pub.thumbnail_url) || images.heroPublication}
                                                    alt={(pub.title as any)[locale] || (pub.title as any).fr}
                                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                                                    <div className="px-3 py-1 rounded-lg bg-primary/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest">
                                                        {(pub.category as any)?.[locale] || (pub.category as any)?.fr || pub.category}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-8 flex-grow flex flex-col space-y-4">
                                                <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                                    <FileText size={12} className="text-primary" />
                                                    <span>AMEN Platform</span>
                                                </div>

                                                <h3 className="text-xl font-heading font-black text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-2">
                                                    {(pub.title as any)[locale] || (pub.title as any).fr || (pub.title as any).en}
                                                </h3>

                                                <p className="text-sm text-muted-foreground font-light leading-relaxed line-clamp-3">
                                                    {(pub.description as any)?.[locale] || (pub.description as any)?.fr || ""}
                                                </p>

                                                <div className="pt-4 mt-auto">
                                                    {pub.file_url ? (
                                                        <Button
                                                            onClick={() => handleView(pub)}
                                                            className="w-full h-12 rounded-xl bg-slate-900 hover:bg-primary text-white font-black uppercase tracking-widest text-[10px] group/btn flex items-center justify-center gap-3 transition-all"
                                                        >
                                                            <Eye size={14} className="group-hover/btn:-translate-y-1 transition-transform" />
                                                            {t('publicationsPage.view')}
                                                        </Button>
                                                    ) : (
                                                        <Button disabled className="w-full h-12 rounded-xl bg-muted text-muted-foreground font-black uppercase tracking-widest text-[10px]">
                                                            Available Soon
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
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
                        </>
                    )}
                </div>
            </section>

            <FileViewer
                isOpen={viewerOpen}
                onClose={() => setViewerOpen(false)}
                url={selectedPub?.file_url ? getImageUrl(selectedPub.file_url) : null}
                title={selectedPub ? (selectedPub.title[locale] || selectedPub.title.fr || selectedPub.title.en || "") : ""}
            />
        </Layout>
    );
}
