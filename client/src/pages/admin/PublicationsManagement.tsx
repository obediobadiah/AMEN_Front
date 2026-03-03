"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { AdminEntityList } from "@/components/AdminEntityList";
import { useTranslations, useLocale } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { usePublications, Publication, PublicationCreate } from "@/hooks/use-publications";
import { useState, useMemo } from "react";
import { PublicationsDialog } from "@/components/admin/PublicationsDialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { getImageUrl } from "@/lib/api-config";
import { FileDown, FileText, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PublicationsManagement() {
    const tSidebar = useTranslations("admin.sidebar");
    const tPub = useTranslations("admin.publications");
    const tCommon = useTranslations("admin.common");
    const locale = useLocale();

    const { publications, isLoading, createPublication, updatePublication, deletePublication, isCreating } = usePublications();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [sort, setSort] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const columns = [
        { key: "id", label: "ID" },
        {
            key: "title",
            label: tPub("columns.title"),
            render: (item: Publication) => (
                <div className="flex items-center gap-4">
                    {item.thumbnail_url ? (
                        <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0 border-2 border-slate-100 shadow-sm">
                            <img src={getImageUrl(item.thumbnail_url)} alt="Thumbnail" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-12 h-16 rounded-lg shrink-0 bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center text-emerald-600">
                            <FileText size={20} />
                        </div>
                    )}
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">
                            {(item.title as any)[locale] || item.title.fr || item.title.en}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{item.file_type || "PDF"}</span>
                            <span>{item.file_size || "-"}</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            key: "type",
            label: tPub("columns.type"),
            render: (item: Publication) => (
                <Badge className="rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 border-slate-200">
                    {tPub(`filters.${item.category || "annual"}`)}
                </Badge>
            )
        },
        {
            key: "date",
            label: tPub("columns.year"),
            render: (item: Publication) => (
                <span className="text-sm font-medium text-slate-700">
                    {item.date ? format(new Date(item.date), "MMM yyyy") : "-"}
                </span>
            )
        },
        {
            key: "downloads",
            label: tPub("columns.downloads"),
            render: (item: Publication) => (
                <span className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Download size={14} className="text-slate-400" />
                    {item.downloads || 0}
                </span>
            )
        },
    ];

    const filteredItems = useMemo(() => {
        let result = publications.filter(item => {
            const titleFr = item.title?.fr?.toLowerCase() || "";
            const titleEn = item.title?.en?.toLowerCase() || "";
            const search = searchQuery.toLowerCase();
            const matchesSearch = titleFr.includes(search) || titleEn.includes(search);

            const matchesFilter = filter === "all" || item.category === filter;
            return matchesSearch && matchesFilter;
        });

        // Apply sorting
        result.sort((a, b) => {
            if (sort === "newest") return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
            if (sort === "oldest") return new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime();
            if (sort === "downloads") return (b.downloads || 0) - (a.downloads || 0);
            if (sort === "title") {
                const titleA = (a.title as any)[locale] || a.title?.fr || "";
                const titleB = (b.title as any)[locale] || b.title?.fr || "";
                return titleA.localeCompare(titleB);
            }
            return 0;
        });

        return result;
    }, [publications, searchQuery, filter, sort, locale]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredItems.slice(start, start + itemsPerPage);
    }, [filteredItems, currentPage]);

    const handleAdd = () => {
        setSelectedPublication(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (item: Publication) => {
        setSelectedPublication(item);
        setIsDialogOpen(true);
    };

    const handleDelete = async (item: Publication) => {
        if (confirm(tPub("messages.deleteConfirm"))) {
            try {
                await deletePublication(item.id);
                toast.success(tPub("messages.deleteSuccess"));
            } catch (err) {
                toast.error(tPub("messages.error"));
            }
        }
    };

    const handleExport = () => {
        if (filteredItems.length === 0) {
            toast.error(tPub("messages.noRecordsToExport"));
            return;
        }
        const headers = ["ID", "Title (FR)", "Title (EN)", "Description (FR)", "Description (EN)", "Category", "Date", "File Size", "File Type", "Downloads", "File URL"];
        const rows = filteredItems.map(item => [
            item.id,
            item.title?.fr || "",
            item.title?.en || "",
            item.description?.fr || "",
            item.description?.en || "",
            item.category || "",
            item.date || "",
            item.file_size || "",
            item.file_type || "",
            item.downloads || 0,
            item.file_url || "",
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `amen_publications_export_${format(new Date(), "yyyy-MM-dd")}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Export successful");
    };

    const onSubmit = async (formData: any) => {
        try {
            if (selectedPublication) {
                await updatePublication({
                    id: selectedPublication.id,
                    data: formData
                });
                toast.success(tPub("messages.updateSuccess"));
            } else {
                await createPublication(formData as PublicationCreate);
                toast.success(tPub("messages.saveSuccess"));
            }
            setIsDialogOpen(false);
        } catch (err) {
            toast.error(tPub("messages.error"));
            console.error(err);
        }
    };

    const filterContent = (
        <>
            <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                {tPub("filters.all")}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="mx-2 bg-slate-100" />
            {["all", "annual", "technical", "research"].map((cat) => (
                <DropdownMenuItem
                    key={cat}
                    onClick={() => {
                        setFilter(cat);
                        setCurrentPage(1);
                    }}
                    className={cn(
                        "rounded-xl px-3 py-2.5 cursor-pointer font-bold text-sm transition-colors",
                        filter === cat ? "bg-primary/5 text-primary" : "text-slate-600 hover:bg-slate-50"
                    )}
                >
                    {tPub(`filters.${cat}`)}
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
            {["newest", "oldest", "downloads", "title"].map((s) => (
                <DropdownMenuItem
                    key={s}
                    onClick={() => setSort(s)}
                    className={cn(
                        "rounded-xl px-3 py-2.5 cursor-pointer font-bold text-sm transition-colors",
                        sort === s ? "bg-primary/5 text-primary" : "text-slate-600 hover:bg-slate-50"
                    )}
                >
                    {tPub(`sort.${s}`)}
                </DropdownMenuItem>
            ))}
        </>
    );

    const renderCard = (item: Publication) => {
        const titleStr = (item.title as any)[locale] || item.title?.fr || item.title?.en || "";
        const descStr = item.description ? ((item.description as any)[locale] || item.description?.fr || item.description?.en || "") : "";

        return (
            <div className="flex flex-col gap-4">
                <div className="w-full aspect-[3/4] max-h-64 rounded-2xl overflow-hidden bg-slate-50 relative group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 border-2 border-slate-100 flex items-center justify-center">
                    {item.thumbnail_url ? (
                        <img
                            src={getImageUrl(item.thumbnail_url)}
                            alt={titleStr}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-4">
                            <FileText size={48} className="text-emerald-200" />
                            <span className="font-bold tracking-widest uppercase text-xs text-slate-400">DOCUMENT</span>
                        </div>
                    )}
                    <Badge className="absolute top-4 left-4 rounded-full px-3 py-1 shadow-lg text-[10px] font-black uppercase tracking-widest border-0 flex items-center gap-2 bg-white text-slate-900">
                        {tPub(`filters.${item.category || "annual"}`)}
                    </Badge>
                </div>

                <div className="space-y-3 px-1">
                    <h3 className="font-heading font-black text-xl text-slate-900 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                        {titleStr}
                    </h3>

                    {descStr && (
                        <p className="text-sm font-medium text-slate-500 line-clamp-2 leading-relaxed">
                            {descStr}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                            <Calendar size={14} className="text-primary" />
                            <span>{item.date ? format(new Date(item.date), "MMM yyyy") : "-"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full ml-auto">
                            {item.file_type || "PDF"} • {item.file_size || "-"}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                        <p className="font-bold text-slate-400 animate-pulse tracking-widest uppercase text-xs">Loading publications...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <AdminEntityList
                    title={tSidebar("publications")}
                    description={tPub("description")}
                    items={paginatedItems}
                    columns={columns}
                    renderCard={renderCard}
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onExport={handleExport}
                    filterContent={filterContent}
                    sortContent={sortContent}
                    searchValue={searchQuery}
                    onSearchChange={(val) => {
                        setSearchQuery(val);
                        setCurrentPage(1);
                    }}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    searchPlaceholder="Search publications..."
                />
            </div>
            <PublicationsDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSubmit={onSubmit}
                publication={selectedPublication}
                isSubmitting={isCreating}
            />
        </AdminLayout>
    );
}
