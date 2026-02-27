"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { AdminEntityList } from "@/components/AdminEntityList";
import { useTranslations, useLocale } from "next-intl";
import { PlayCircle, Image as ImageIcon, Film, Badge, FolderHeart, LayoutGrid, ArrowLeft, MoreVertical, Edit2, Trash2, Globe, Lock } from "lucide-react";
import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMultimedia, Multimedia, MultimediaCreate, MultimediaUpdate } from "@/hooks/use-multimedia";
import { useAlbums, Album, AlbumCreate, AlbumUpdate } from "@/hooks/use-albums";
import { MultimediaDialog } from "@/components/admin/MultimediaDialog";
import { AlbumDialog } from "@/components/admin/AlbumDialog";
import { MultimediaViewer } from "@/components/admin/MultimediaViewer";
import { toast } from "sonner";
import { format } from "date-fns";
import { getImageUrl } from "@/lib/api-config";
import { Button } from "@/components/ui/button";
import {
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent
} from "@/components/ui/dropdown-menu";

export default function MultimediaManagement() {
    const tSidebar = useTranslations("admin.sidebar");
    const tMedia = useTranslations("admin.multimedia");
    const tAlbums = useTranslations("admin.albums");
    const tCommon = useTranslations("admin.common");
    const locale = useLocale();

    const { multimedia, isLoading: isLoadingMedia, createMultimedia, updateMultimedia, deleteMultimedia, isCreating: isCreatingMedia } = useMultimedia();
    const { albums, isLoading: isLoadingAlbums, createAlbum, updateAlbum, deleteAlbum, isCreating: isCreatingAlbum } = useAlbums();

    const [viewMode, setViewMode] = useState<"library" | "albums">("library");
    const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null);

    const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState<Multimedia | null>(null);

    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [viewerMedia, setViewerMedia] = useState<Multimedia | null>(null);

    const [isAlbumDialogOpen, setIsAlbumDialogOpen] = useState(false);
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [sort, setSort] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 30;

    const currentAlbum = useMemo(() =>
        selectedAlbumId ? albums.find(a => a.id === selectedAlbumId) : null
        , [selectedAlbumId, albums]);

    const displayMultimedia = useMemo(() => {
        if (selectedAlbumId) {
            return multimedia.filter(m => m.album_id === selectedAlbumId);
        }
        return multimedia;
    }, [multimedia, selectedAlbumId]);

    const filteredItems = useMemo(() => {
        let result = displayMultimedia.filter(item => {
            const titleFr = item.title?.fr?.toLowerCase() || "";
            const titleEn = item.title?.en?.toLowerCase() || "";
            const search = searchQuery.toLowerCase();
            const matchesSearch = titleFr.includes(search) || titleEn.includes(search);
            const matchesFilter = filter === "all" || item.type?.toLowerCase() === filter.toLowerCase();
            return matchesSearch && matchesFilter;
        });

        result.sort((a, b) => {
            if (sort === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            if (sort === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            if (sort === "title") {
                const titleA = (a.title as any)[locale] || a.title?.fr || "";
                const titleB = (b.title as any)[locale] || b.title?.fr || "";
                return titleA.localeCompare(titleB);
            }
            return 0;
        });

        return result;
    }, [displayMultimedia, searchQuery, filter, sort, locale]);

    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredItems.slice(start, start + itemsPerPage);
    }, [filteredItems, currentPage]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const columns = [
        { key: "id", label: "ID" },
        {
            key: "title",
            label: tMedia("columns.title") || "Title",
            render: (item: Multimedia) => {
                const titleStr = (item.title as any)[locale] || item.title?.fr || item.title?.en || "";
                const imageUrl = getImageUrl(item.type === "video" ? item.thumbnail_url : item.media_url);
                return (
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 border-slate-100 shadow-sm relative">
                            {imageUrl ? (
                                <img src={imageUrl} alt={titleStr} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300">
                                    <ImageIcon size={20} />
                                </div>
                            )}
                            {item.type === "video" && (
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                    <PlayCircle size={16} className="text-white fill-white/20" />
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="font-black text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                                {titleStr}
                            </span>
                        </div>
                    </div>
                );
            }
        },
        {
            key: "type",
            label: tCommon("type") || "Type",
            render: (item: Multimedia) => (
                <Badge className={cn(
                    "rounded-xl px-3 py-1 text-[10px] font-black uppercase tracking-widest border-0 shadow-sm",
                    item.type === "video" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                )}>
                    {item.type}
                </Badge>
            )
        },
        {
            key: "category",
            label: tMedia("dialog.categoryLabel") || "Category",
            render: (item: Multimedia) => (
                <span className="text-sm font-bold text-slate-500">
                    {item.category ? ((item.category as any)[locale] || item.category.fr || item.category.en) : "-"}
                </span>
            )
        },
        {
            key: "date",
            label: tCommon("date") || "Date",
            render: (item: Multimedia) => (
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {format(new Date(item.created_at), "MMM dd, yyyy")}
                </span>
            )
        }
    ];

    const handleAddMedia = () => {
        setSelectedMedia(null);
        setIsMediaDialogOpen(true);
    };

    const handleEditMedia = (item: Multimedia) => {
        setSelectedMedia(item);
        setIsMediaDialogOpen(true);
    };

    const handleDeleteMedia = async (item: Multimedia) => {
        if (confirm(tMedia("deleteConfirm"))) {
            try {
                await deleteMultimedia(item.id);
                toast.success(tMedia("deleteSuccess"));
            } catch (err) {
                toast.error(tMedia("deleteError"));
            }
        }
    };

    const handleAddAlbum = () => {
        setSelectedAlbum(null);
        setIsAlbumDialogOpen(true);
    };

    const handleEditAlbum = (album: Album) => {
        setSelectedAlbum(album);
        setIsAlbumDialogOpen(true);
    };

    const handleDeleteAlbum = async (album: Album) => {
        if (confirm(tAlbums("messages.deleteConfirm"))) {
            try {
                await deleteAlbum(album.id);
                toast.success(tAlbums("messages.deleteSuccess"));
            } catch (err) {
                toast.error(tCommon("error"));
            }
        }
    };

    const onMediaSubmit = async (data: any) => {
        try {
            if (selectedMedia) {
                const finalData = { ...data };
                if (Array.isArray(finalData.media_url)) {
                    finalData.media_url = finalData.media_url[0] || "";
                }
                await updateMultimedia({ id: selectedMedia.id, data: finalData });
                toast.success(tMedia("saveSuccess"));
            } else {
                // If we are currently viewing an album, pre-fill its ID
                const payload = { ...data };
                if (selectedAlbumId && !payload.album_id) {
                    payload.album_id = selectedAlbumId;
                }

                if (Array.isArray(payload.media_url) && payload.media_url.length > 0) {
                    // Create multiple entries
                    for (const url of payload.media_url) {
                        const singlePayload = { ...payload, media_url: url };
                        await createMultimedia(singlePayload);
                    }
                } else {
                    const singleUrl = Array.isArray(payload.media_url) ? payload.media_url[0] : payload.media_url;
                    await createMultimedia({ ...payload, media_url: singleUrl });
                }
                toast.success(tMedia("saveSuccess"));
            }
            setIsMediaDialogOpen(false);
        } catch (err) {
            console.error("Failed to save media:", err);
            toast.error(tMedia("saveError"));
        }
    };

    const onAlbumSubmit = async (data: any) => {
        try {
            if (selectedAlbum) {
                await updateAlbum({ id: selectedAlbum.id, data });
                toast.success(tAlbums("messages.updateSuccess"));
            } else {
                await createAlbum(data);
                toast.success(tAlbums("messages.saveSuccess"));
            }
            setIsAlbumDialogOpen(false);
        } catch (err) {
            toast.error(tCommon("error"));
        }
    };

    const renderMediaCard = (item: Multimedia) => {
        const title = (item.title as any)[locale] || item.title.fr || item.title.en;
        const category = item.category ? ((item.category as any)[locale] || item.category.fr || item.category.en) : "";
        const imageUrl = getImageUrl(item.type === "video" ? item.thumbnail_url : item.media_url);

        return (
            <div className="flex flex-col gap-5 pt-4 group/card">
                <div className="aspect-[4/3] rounded-[2rem] bg-slate-100 overflow-hidden relative border-4 border-white shadow-xl shadow-slate-200/50 group-hover/card:shadow-primary/20 transition-all duration-500">
                    {imageUrl ? (
                        <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <ImageIcon size={40} className="opacity-20" />
                        </div>
                    )}

                    {item.type === "video" && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                                <PlayCircle size={28} className="text-white fill-white/20" />
                            </div>
                        </div>
                    )}

                    <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className={cn(
                            "rounded-xl px-3 py-1 text-[10px] font-black uppercase tracking-widest border-0 shadow-lg",
                            item.type === "video" ? "bg-blue-600 text-white" : "bg-emerald-600 text-white"
                        )}>
                            {item.type}
                        </Badge>
                    </div>
                </div>

                <div className="px-2 space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                        {category && <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{category}</span>}
                        <h3 className="font-black text-slate-900 text-lg leading-tight line-clamp-2 group-hover/card:text-primary transition-colors">{title}</h3>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {format(new Date(item.created_at), "MMM dd, yyyy")}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    const renderAlbumCard = (album: Album) => {
        const name = (album.name as any)[locale] || album.name.fr || album.name.en;
        const count = multimedia.filter(m => m.album_id === album.id).length;
        const imageUrl = getImageUrl(album.thumbnail_url);

        return (
            <div
                onClick={() => { setSelectedAlbumId(album.id); setViewMode("library"); }}
                className="flex flex-col gap-6 pt-4 group/album cursor-pointer"
            >
                <div className="aspect-square rounded-[2.5rem] bg-slate-50 overflow-hidden relative border-4 border-white shadow-xl shadow-slate-200/50 group-hover/album:shadow-primary/30 group-hover/album:-translate-y-2 transition-all duration-500">
                    {imageUrl ? (
                        <img src={imageUrl} alt={name} className="w-full h-full object-cover group-hover/album:scale-110 transition-transform duration-700" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-200">
                            <FolderHeart size={64} className="opacity-40" />
                        </div>
                    )}

                    <div className="absolute top-6 left-6 flex gap-2">
                        <Badge className={cn(
                            "rounded-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border-0 shadow-2xl",
                            album.is_public ? "bg-primary text-white" : "bg-slate-900 text-white"
                        )}>
                            <div className="flex items-center gap-1.5">
                                {album.is_public ? <Globe size={10} /> : <Lock size={10} />}
                                {album.is_public ? tAlbums("filters.public") : tAlbums("filters.private")}
                            </div>
                        </Badge>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-20 translate-y-4 group-hover/album:translate-y-0 opacity-0 group-hover/album:opacity-100 transition-all duration-500">
                        <div className="flex items-center justify-between text-white">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">{tAlbums("content")}</span>
                                <span className="font-black text-xl">{count} {tAlbums("files")}</span>
                            </div>
                            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl hover:bg-white hover:text-primary transition-all shadow-2xl"
                                onClick={(e) => { e.stopPropagation(); handleEditAlbum(album); }}>
                                <Edit2 size={18} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-4 space-y-2">
                    <h3 className="font-black text-slate-900 text-2xl leading-none group-hover/album:text-primary transition-all">{name}</h3>
                    {album.description && (
                        <p className="text-sm font-medium text-slate-400 line-clamp-1 italic italic">
                            {(album.description as any)[locale] || (album.description as any).fr || ""}
                        </p>
                    )}
                </div>
            </div>
        );
    };

    const filterContent = (
        <>
            <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                {tCommon("filters")}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="mx-2 bg-slate-100" />
            {["all", "photo", "video"].map((f) => (
                <DropdownMenuItem
                    key={f}
                    onClick={() => {
                        setFilter(f);
                        setCurrentPage(1);
                    }}
                    className={cn(
                        "rounded-xl px-3 py-2.5 cursor-pointer font-bold text-sm transition-colors",
                        filter === f ? "bg-primary/5 text-primary" : "text-slate-600 hover:bg-slate-50"
                    )}
                >
                    {tMedia(`filters.${f}`)}
                </DropdownMenuItem>
            ))}
        </>
    );

    const sortContent = (
        <>
            <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                {tCommon("sort")}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="mx-2 bg-slate-100" />
            {["newest", "oldest", "title"].map((s) => (
                <DropdownMenuItem
                    key={s}
                    onClick={() => setSort(s)}
                    className={cn(
                        "rounded-xl px-3 py-2.5 cursor-pointer font-bold text-sm transition-colors",
                        sort === s ? "bg-primary/5 text-primary" : "text-slate-600 hover:bg-slate-50"
                    )}
                >
                    {tMedia(`sort.${s}`)}
                </DropdownMenuItem>
            ))}
        </>
    );

    if (isLoadingMedia || isLoadingAlbums) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                        <p className="font-bold text-slate-400 animate-pulse tracking-widest uppercase text-xs">{tMedia("loading")}</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
                {/* Header & Controls */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            {selectedAlbumId && (
                                <button
                                    onClick={() => { setSelectedAlbumId(null); setViewMode("albums"); }}
                                    className="p-3 bg-slate-100 text-slate-400 hover:bg-primary hover:text-white rounded-2xl transition-all shadow-sm active:scale-95"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                            )}
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                                {selectedAlbumId ? ((currentAlbum?.name as any)[locale] || currentAlbum?.name.fr) : tSidebar("multimedia")}
                            </h2>
                        </div>
                        <p className="text-slate-500 font-medium text-lg max-w-2xl leading-relaxed">
                            {selectedAlbumId ? (currentAlbum?.description ? ((currentAlbum.description as any)[locale] || currentAlbum.description.fr) : "") : tMedia("description")}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
                        <div className="flex items-center p-2 bg-slate-100/50 backdrop-blur-sm rounded-[2rem] border border-slate-200/50 shadow-inner">
                            <button
                                onClick={() => { setViewMode("library"); setSelectedAlbumId(null); }}
                                className={cn(
                                    "flex items-center gap-3 px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all duration-500",
                                    (viewMode === "library" && !selectedAlbumId) ? "bg-white text-primary shadow-xl ring-1 ring-slate-200/50" : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
                                )}
                            >
                                <LayoutGrid size={16} />
                                {tMedia("library")}
                            </button>
                            <button
                                onClick={() => { setViewMode("albums"); setSelectedAlbumId(null); }}
                                className={cn(
                                    "flex items-center gap-3 px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all duration-500",
                                    (viewMode === "albums" || selectedAlbumId) ? "bg-white text-primary shadow-xl ring-1 ring-slate-200/50" : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
                                )}
                            >
                                <FolderHeart size={16} />
                                {tAlbums("title")}
                            </button>
                        </div>
                        {viewMode === "library" && (
                            <Button onClick={handleAddMedia} className="h-14 px-8 rounded-[1.5rem] bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-primary/30 font-bold transition-all">
                                <Plus size={18} className="mr-2" /> {tCommon("createNew")}
                            </Button>
                        )}
                    </div>
                </div>

                {viewMode === "albums" && !selectedAlbumId ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                        {/* Add New Album Card */}
                        <div
                            onClick={handleAddAlbum}
                            className="aspect-square rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-white hover:border-primary/50 transition-all duration-500 flex flex-col items-center justify-center gap-6 group cursor-pointer shadow-sm hover:shadow-2xl hover:-translate-y-2 mt-4"
                        >
                            <div className="p-8 bg-white rounded-[2.5rem] shadow-xl group-hover:scale-110 transition-transform duration-500 ring-1 ring-slate-100">
                                <FolderHeart size={48} className="text-primary" />
                            </div>
                            <div className="text-center space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-primary transition-colors">{tAlbums("digitalCollections")}</span>
                                <p className="font-black text-slate-900 text-lg">{tAlbums("newAlbum")}</p>
                            </div>
                        </div>

                        {/* Album Listing */}
                        {albums.map(album => (
                            <div key={album.id} className="relative group">
                                {renderAlbumCard(album)}
                                <div className="absolute top-8 right-8 z-20">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-xl text-slate-400 hover:text-primary transition-all">
                                                <MoreVertical size={18} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-2xl border-slate-100 shadow-2xl p-2 min-w-[160px]">
                                            <DropdownMenuItem onClick={() => handleEditAlbum(album)} className="rounded-xl font-bold py-3 px-4 gap-3 cursor-pointer">
                                                <Edit2 size={16} /> {tAlbums("editDetails")}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-slate-50" />
                                            <DropdownMenuItem onClick={() => handleDeleteAlbum(album)} className="rounded-xl font-bold py-3 px-4 gap-3 text-rose-500 hover:bg-rose-50 cursor-pointer">
                                                <Trash2 size={16} /> {tAlbums("deleteAlbum")}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <AdminEntityList
                        title="" // Handled by custom header above
                        description=""
                        items={paginatedItems}
                        columns={columns}
                        onAdd={handleAddMedia}
                        onEdit={handleEditMedia}
                        onDelete={handleDeleteMedia}
                        renderCard={renderMediaCard}
                        defaultView="grid"
                        searchValue={searchQuery}
                        onSearchChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        onView={(item) => { setViewerMedia(item); setIsViewerOpen(true); }}
                        hideHeader={true}
                        filterContent={filterContent}
                        sortContent={sortContent}
                    />
                )}
            </div>

            <MultimediaViewer
                open={isViewerOpen}
                onOpenChange={setIsViewerOpen}
                media={viewerMedia}
                allMedia={filteredItems}
                onNavigate={setViewerMedia}
            />

            <MultimediaDialog
                open={isMediaDialogOpen}
                onOpenChange={setIsMediaDialogOpen}
                onSubmit={onMediaSubmit}
                media={selectedMedia}
                isSubmitting={isCreatingMedia}
            />

            <AlbumDialog
                open={isAlbumDialogOpen}
                onOpenChange={setIsAlbumDialogOpen}
                onSubmit={onAlbumSubmit}
                album={selectedAlbum}
                isSubmitting={isCreatingAlbum}
            />
        </AdminLayout>
    );
}
