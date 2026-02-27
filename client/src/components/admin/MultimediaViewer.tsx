"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Multimedia } from "@/hooks/use-multimedia";
import { getImageUrl } from "@/lib/api-config";
import { X, ChevronLeft, ChevronRight, PlayCircle, Maximize2, Download } from "lucide-react";
import { useLocale } from "next-intl";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MultimediaViewerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    media: Multimedia | null;
    allMedia: Multimedia[];
    onNavigate: (media: Multimedia) => void;
}

export function MultimediaViewer({ open, onOpenChange, media, allMedia, onNavigate }: MultimediaViewerProps) {
    const locale = useLocale();
    const [isFullscreen, setIsFullscreen] = useState(false);

    if (!media) return null;

    const currentIndex = allMedia.findIndex(m => m.id === media.id);
    const hasNext = currentIndex < allMedia.length - 1;
    const hasPrev = currentIndex > 0;

    const title = (media.title as any)[locale] || media.title.fr || media.title.en;
    const category = media.category ? ((media.category as any)[locale] || media.category.fr || media.category.en) : "";
    const mediaUrl = getImageUrl(media.media_url);

    const handleNext = () => {
        if (hasNext) onNavigate(allMedia[currentIndex + 1]);
    };

    const handlePrev = () => {
        if (hasPrev) onNavigate(allMedia[currentIndex - 1]);
    };

    const isYoutube = media.type === "video" && (media.media_url.includes("youtube.com") || media.media_url.includes("youtu.be"));

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cn(
                "p-0 border-none shadow-none transition-all duration-500 max-w-[95vw] lg:max-w-[1200px] overflow-hidden rounded-[3rem] bg-transparent backdrop-blur-3xl",
                isFullscreen && "max-w-[100vw] h-[100vh] rounded-none bg-black/95"
            )}>
                <div className="relative w-full h-full flex flex-col">
                    {/* Top Bar */}
                    <div className="absolute top-0 inset-x-0 p-8 flex items-center justify-between z-50 pointer-events-none">
                        <div className="flex flex-col gap-1 pointer-events-auto">
                            {category && <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{category}</span>}
                            <h3 className="text-xl font-black text-white tracking-tight drop-shadow-2xl">{title}</h3>
                        </div>
                        <div className="flex items-center gap-4 pointer-events-auto">
                            <button onClick={handlePrev} disabled={!hasPrev} className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl text-white backdrop-blur-xl transition-all disabled:opacity-30 border border-white/10 shadow-2xl">
                                <ChevronLeft size={24} />
                            </button>
                            <button onClick={handleNext} disabled={!hasNext} className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl text-white backdrop-blur-xl transition-all disabled:opacity-30 border border-white/10 shadow-2xl">
                                <ChevronRight size={24} />
                            </button>
                            <div className="w-px h-8 bg-white/10 mx-2" />
                            <button onClick={() => onOpenChange(false)} className="p-4 bg-rose-500/20 hover:bg-rose-500 rounded-2xl text-white backdrop-blur-xl transition-all border border-rose-500/20 shadow-2xl">
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Media Display */}
                    <div className="flex-1 flex items-center justify-center p-20 min-h-[70vh]">
                        <div className="relative group max-h-full max-w-full">
                            {media.type === "video" ? (
                                isYoutube ? (
                                    <div className="aspect-video w-full max-w-5xl rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/10">
                                        <iframe
                                            src={media.media_url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                                            className="w-full h-full border-0"
                                            allowFullScreen
                                        />
                                    </div>
                                ) : (
                                    <video
                                        src={mediaUrl}
                                        controls
                                        className="max-h-[75vh] rounded-[2.5rem] shadow-2xl border-4 border-white/10"
                                    />
                                )
                            ) : (
                                <img
                                    src={mediaUrl}
                                    alt={title}
                                    className="max-h-[75vh] object-contain rounded-[2.5rem] shadow-2xl border-4 border-white/10 cursor-zoom-in"
                                    onClick={() => setIsFullscreen(!isFullscreen)}
                                />
                            )}
                        </div>
                    </div>

                    {/* Bottom Controls (optional) */}
                    <div className="absolute bottom-6 inset-x-0 flex justify-center z-50 pointer-events-none">
                        <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-3xl rounded-[2rem] border border-white/10 pointer-events-auto shadow-2xl">
                            <button className="p-4 hover:bg-white/20 rounded-2xl text-white transition-all">
                                <Download size={20} />
                            </button>
                            <button className="p-4 hover:bg-white/20 rounded-2xl text-white transition-all" onClick={() => setIsFullscreen(!isFullscreen)}>
                                <Maximize2 size={20} />
                            </button>
                            <div className="px-6 border-l border-white/10">
                                <span className="text-xs font-black text-white/40 uppercase tracking-[0.2em] italic">
                                    Asset ID: {media.id}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
