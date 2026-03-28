"use client";

import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { useTranslations, useLocale } from 'next-intl';
import { images } from "@/lib/images";
import { Button } from "@/components/ui/button";
import { Play, Image as ImageIcon, ZoomIn, PlayCircle, FolderHeart, LayoutGrid, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMultimedia, Multimedia as MultimediaType } from "@/hooks/use-multimedia";
import { useAlbums, Album } from "@/hooks/use-albums";
import { getImageUrl } from "@/lib/api-config";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { MultimediaViewer } from "@/components/admin/MultimediaViewer";

export default function Multimedia() {
    const t = useTranslations();
    const locale = useLocale();

    const { multimedia, isLoading: isLoadingMedia } = useMultimedia();
    const { albums, isLoading: isLoadingAlbums } = useAlbums();

    const [activeTab, setActiveTab] = useState<"all" | "photo" | "video" | "albums">("all");
    const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const [viewerMedia, setViewerMedia] = useState<any>(null);
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const albumId = params.get("album");
        if (albumId) {
            setSelectedAlbumId(parseInt(albumId));
            setActiveTab("all");
        }
    }, []);

    const publicAlbums = useMemo(() => albums.filter(a => a.is_public), [albums]);

    const displayMultimedia = useMemo(() => {
        const publicAlbumIds = new Set(publicAlbums.map(a => a.id));
        let visibleMedia = multimedia.filter(m => {
            return !m.album_id || publicAlbumIds.has(m.album_id);
        });

        if (selectedAlbumId) {
            return visibleMedia.filter(m => m.album_id === selectedAlbumId);
        }
        return visibleMedia;
    }, [multimedia, selectedAlbumId, publicAlbums]);

    const filteredMediaItems = useMemo(() => {
        let items = displayMultimedia.map(item => ({
            ...item,
            id: item.id,
            type: item.type || "photo",
            titleText: (item.title as any)[locale] || item.title.fr || item.title.en,
            categoryText: item.category ? ((item.category as any)[locale] || item.category.fr || item.category.en) : "",
            image: getImageUrl(item.type === "video" ? item.thumbnail_url : item.media_url),
            videoUrl: item.type === "video" ? item.media_url : undefined
        }));

        if (activeTab === "all" || activeTab === "albums") return items;
        return items.filter(item => item.type === activeTab);
    }, [displayMultimedia, activeTab, locale]);

    const currentAlbum = useMemo(() =>
        selectedAlbumId ? publicAlbums.find(a => a.id === selectedAlbumId) : null
        , [selectedAlbumId, publicAlbums]);

    // Pagination logic
    const totalItems = activeTab === "albums" && !selectedAlbumId ? publicAlbums.length : filteredMediaItems.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        if (activeTab === "albums" && !selectedAlbumId) {
            return publicAlbums.slice(start, start + itemsPerPage);
        }
        return filteredMediaItems.slice(start, start + itemsPerPage);
    }, [activeTab, selectedAlbumId, publicAlbums, filteredMediaItems, currentPage, itemsPerPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        const element = document.getElementById('multimedia-grid');
        if (element) {
            const yOffset = -100;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const handleTabChange = (tab: "all" | "photo" | "video" | "albums") => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const handleAlbumSelect = (id: number) => {
        setSelectedAlbumId(id);
        setCurrentPage(1);
        setActiveTab("all");
    };

    const isLoading = isLoadingMedia || isLoadingAlbums;

    if (isLoading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        <p className="font-bold text-muted-foreground animate-pulse tracking-widest uppercase text-xs">
                            {t('common.loading')}
                        </p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <PageHero
                title={t('multimediaPage.title')}
                subtitle={t('multimediaPage.subtitle')}
                image={images.heroMultimedia}
            />

            <section className="py-24 bg-background relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center space-y-10 mb-20">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 text-primary text-xs font-black tracking-[0.3em] uppercase border border-primary/20 backdrop-blur-md"
                        >
                            <ImageIcon size={14} className="mb-0.5" />
                            <span>{t('multimediaPage.tabs.photo')} & {t('multimediaPage.tabs.video')}</span>
                        </motion.div>

                        <div className="flex flex-col gap-4">
                            {selectedAlbumId && (
                                <button
                                    onClick={() => { setSelectedAlbumId(null); setCurrentPage(1); }}
                                    className="flex items-center gap-3 text-primary font-black uppercase tracking-widest text-xs mx-auto hover:gap-5 transition-all w-fit"
                                >
                                    <ArrowLeft size={16} /> Back to Library
                                </button>
                            )}
                            <h2 className="text-5xl md:text-7xl font-heading font-black text-foreground tracking-tight leading-[0.9]">
                                {selectedAlbumId ? ((currentAlbum?.name as any)[locale] || currentAlbum?.name.fr) : t('multimediaPage.title')}
                            </h2>
                        </div>

                        <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
                            {selectedAlbumId ? (currentAlbum?.description ? ((currentAlbum.description as any)[locale] || currentAlbum.description.fr) : "") : t('multimediaPage.intro')}
                        </p>

                        {!selectedAlbumId && (
                            <div className="flex justify-center flex-wrap gap-4 mt-8">
                                {["all", "photo", "video", "albums"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => handleTabChange(tab as any)}
                                        className={cn(
                                            "px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500",
                                            activeTab === tab
                                                ? "bg-primary text-white shadow-xl shadow-primary/30"
                                                : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                        )}
                                    >
                                        {t(`multimediaPage.tabs.${tab}`)}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div id="multimedia-grid" className="scroll-mt-24 space-y-16">
                        <motion.div
                            key={`${activeTab}-${selectedAlbumId}-${currentPage}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        >
                            {activeTab === "albums" && !selectedAlbumId ? (
                                (paginatedItems as Album[]).map((album, idx) => {
                                    const name = (album.name as any)[locale] || album.name.fr || album.name.en;
                                    const count = multimedia.filter(m => m.album_id === album.id).length;
                                    const img = getImageUrl(album.thumbnail_url);
                                    return (
                                        <motion.div
                                            key={album.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            onClick={() => handleAlbumSelect(album.id)}
                                            className="group cursor-pointer space-y-6"
                                        >
                                            <div className="aspect-square rounded-[3rem] overflow-hidden bg-muted relative border border-border/50 shadow-xl group-hover:shadow-primary/20 transition-all duration-700 group-hover:-translate-y-2">
                                                {img ? (
                                                    <img src={img} alt={name} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                                                        <FolderHeart size={80} />
                                                    </div>
                                                )}
                                                <div className="absolute top-6 right-6 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[10px] font-black uppercase tracking-widest">
                                                    {count} Files
                                                </div>
                                            </div>
                                            <div className="space-y-2 px-4">
                                                <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">{name}</h3>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            ) : (
                                (paginatedItems as any[]).map((item, idx) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                                        onClick={() => { setViewerMedia(item); setIsViewerOpen(true); }}
                                        className="group relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-muted cursor-pointer border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-700"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.titleText}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        <div className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl text-white border border-white/20 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-all duration-500 z-20">
                                            {item.type === "video" ? <PlayCircle size={24} /> : <ImageIcon size={24} />}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-10 text-left">
                                            <div className="space-y-4 translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                                                <h4 className="text-white font-heading font-black text-2xl leading-tight">
                                                    {item.titleText}
                                                </h4>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
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
                </div>
            </section>

            <MultimediaViewer
                open={isViewerOpen}
                onOpenChange={setIsViewerOpen}
                media={viewerMedia}
                allMedia={filteredMediaItems as any}
                onNavigate={setViewerMedia}
            />
        </Layout>
    );
}
