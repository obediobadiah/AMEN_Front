"use client";

import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { useTranslations, useLocale } from 'next-intl';
import { images } from "@/lib/images";
import { Button } from "@/components/ui/button";
import { Play, Image as ImageIcon, ZoomIn, PlayCircle, FolderHeart, LayoutGrid, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMultimedia } from "@/hooks/use-multimedia";
import { useAlbums, Album } from "@/hooks/use-albums";
import { getImageUrl } from "@/lib/api-config";
import { MultimediaViewer } from "@/components/admin/MultimediaViewer"; // Can be reused here

export default function Multimedia() {
    const t = useTranslations();
    const locale = useLocale();

    const { multimedia, isLoading: isLoadingMedia } = useMultimedia();
    const { albums, isLoading: isLoadingAlbums } = useAlbums();

    const [viewMode, setViewMode] = useState<"all" | "albums">("all");
    const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState("all");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const albumId = params.get("album");
        if (albumId) {
            setSelectedAlbumId(parseInt(albumId));
        }
    }, []);

    const [viewerMedia, setViewerMedia] = useState<any>(null);
    const [isViewerOpen, setIsViewerOpen] = useState(false);

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

    const filteredItems = useMemo(() => {
        let items = displayMultimedia.map(item => ({
            ...item,
            id: item.id,
            type: item.type || "photo",
            titleText: (item.title as any)[locale] || item.title.fr || item.title.en,
            categoryText: item.category ? ((item.category as any)[locale] || item.category.fr || item.category.en) : "",
            image: getImageUrl(item.type === "video" ? item.thumbnail_url : item.media_url),
            videoUrl: item.type === "video" ? item.media_url : undefined
        }));

        if (activeTab === "all") return items;
        return items.filter(item => item.type === activeTab);
    }, [displayMultimedia, activeTab, locale]);

    const currentAlbum = useMemo(() =>
        selectedAlbumId ? publicAlbums.find(a => a.id === selectedAlbumId) : null
        , [selectedAlbumId, publicAlbums]);

    const isLoading = isLoadingMedia || isLoadingAlbums;

    if (isLoading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                </div>
            </Layout>
        );
    }

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

                        <div className="flex flex-col gap-4">
                            {selectedAlbumId && (
                                <button
                                    onClick={() => setSelectedAlbumId(null)}
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
                            <div className="flex justify-center p-2 bg-muted/40 rounded-[2.5rem] w-fit mx-auto border border-border/50 backdrop-blur-xl shadow-inner group">
                                <button
                                    onClick={() => setViewMode("all")}
                                    className={cn(
                                        "px-10 py-3.5 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all duration-700 relative",
                                        viewMode === "all" ? "bg-primary text-white shadow-2xl shadow-primary/30" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <div className="flex items-center gap-2 relative z-10">
                                        <LayoutGrid size={14} /> {t('admin.multimedia.filters.all') || "Gallery"}
                                    </div>
                                    {viewMode === "all" && (
                                        <motion.div layoutId="viewMode" className="absolute inset-0 bg-primary rounded-[1.5rem]" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                                    )}
                                </button>
                                <button
                                    onClick={() => setViewMode("albums")}
                                    className={cn(
                                        "px-10 py-3.5 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all duration-700 relative",
                                        viewMode === "albums" ? "bg-primary text-white shadow-2xl shadow-primary/30" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <div className="flex items-center gap-2 relative z-10">
                                        <FolderHeart size={14} /> Albums
                                    </div>
                                    {viewMode === "albums" && (
                                        <motion.div layoutId="viewMode" className="absolute inset-0 bg-primary rounded-[1.5rem]" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                                    )}
                                </button>
                            </div>
                        )}

                        {viewMode === "all" && !selectedAlbumId && (
                            <div className="flex justify-center flex-wrap gap-4 mt-8">
                                {["all", "photo", "video"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={cn(
                                            "px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500",
                                            activeTab === tab
                                                ? "bg-foreground text-background shadow-xl"
                                                : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                        )}
                                    >
                                        {tab === "all" ? "All" : tab + "s"}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {viewMode === "albums" && !selectedAlbumId ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                            {publicAlbums.map((album, idx) => {
                                const name = (album.name as any)[locale] || album.name.fr || album.name.en;
                                const count = multimedia.filter(m => m.album_id === album.id).length;
                                const img = getImageUrl(album.thumbnail_url);
                                return (
                                    <motion.div
                                        key={album.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        onClick={() => setSelectedAlbumId(album.id)}
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
                                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center backdrop-blur-[2px]">
                                                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center scale-0 group-hover:scale-100 transition-all duration-500 shadow-2xl">
                                                    <ArrowLeft size={24} className="text-primary rotate-180" />
                                                </div>
                                            </div>
                                            <div className="absolute top-6 right-6 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[10px] font-black uppercase tracking-widest">
                                                {count} Files
                                            </div>
                                        </div>
                                        <div className="space-y-2 px-4">
                                            <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">{name}</h3>
                                            {album.description && (
                                                <p className="text-sm text-muted-foreground line-clamp-1 italic italic italic">
                                                    {(album.description as any)[locale] || (album.description as any).fr}
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
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
                                        onClick={() => { setViewerMedia(item); setIsViewerOpen(true); }}
                                        className={cn(
                                            "group relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-muted cursor-pointer border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-700",
                                            idx % 5 === 0 && !selectedAlbumId ? "md:col-span-2 md:aspect-auto" : ""
                                        )}
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
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/40">
                                                        {item.type === "video" ? <Play fill="white" size={20} /> : <ZoomIn size={20} />}
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                                                        {item.categoryText}
                                                    </span>
                                                </div>
                                                <h4 className="text-white font-heading font-black text-2xl leading-tight">
                                                    {item.titleText}
                                                </h4>
                                            </div>
                                        </div>

                                        <div className="absolute bottom-6 left-6 px-4 py-1.5 rounded-xl bg-slate-950/40 backdrop-blur-md opacity-100 group-hover:opacity-0 transition-opacity z-10">
                                            <span className="text-white/80 text-[10px] font-black uppercase tracking-widest">
                                                {item.titleText}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </section>

            <MultimediaViewer
                open={isViewerOpen}
                onOpenChange={setIsViewerOpen}
                media={viewerMedia}
                allMedia={filteredItems as any}
                onNavigate={setViewerMedia}
            />
        </Layout>
    );
}
