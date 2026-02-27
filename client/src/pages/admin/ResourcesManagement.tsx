"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { AdminEntityList } from "@/components/AdminEntityList";
import { useTranslations, useLocale } from "next-intl";
import { Database, FileText, Download, Clock } from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useResources, ResourceItem, ResourceCreate } from "@/hooks/use-resources";
import { ResourcesDialog } from "@/components/admin/ResourcesDialog";
import { toast } from "sonner";
import { format } from "date-fns";
import {
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

export default function ResourcesManagement() {
    const tSidebar = useTranslations("admin.sidebar");
    const tRes = useTranslations("admin.resources");
    const tCommon = useTranslations("admin.common");
    const locale = useLocale();

    const { resources, isLoading, createResource, updateResource, deleteResource, isCreating } = useResources();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [sort, setSort] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const columns = [
        { key: "id", label: "ID" },
        {
            key: "title",
            label: tRes("columns.title"),
            render: (item: ResourceItem) => (
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                        <FileText size={24} />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">
                            {(item.title as any)[locale] || item.title.fr || item.title.en}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                            {item.file_type || "Document"} &bull; {item.file_size || "-"}
                        </span>
                    </div>
                </div>
            )
        },
        { key: "category", label: tRes("columns.category") },
        {
            key: "updated",
            label: tRes("columns.updated"),
            render: (item: ResourceItem) => (
                <div className="flex items-center gap-2 text-slate-400">
                    <Clock size={14} />
                    <span className="text-sm">
                        {item.created_at ? format(new Date(item.created_at), "MMM dd, yyyy") : "-"}
                    </span>
                </div>
            )
        },
    ];

    const filteredItems = useMemo(() => {
        let result = resources.filter(item => {
            const titleFr = item.title?.fr?.toLowerCase() || "";
            const titleEn = item.title?.en?.toLowerCase() || "";
            const search = searchQuery.toLowerCase();
            const matchesSearch = titleFr.includes(search) || titleEn.includes(search);

            const matchesFilter = filter === "all" || item.category?.toLowerCase() === filter.toLowerCase();
            return matchesSearch && matchesFilter;
        });

        result.sort((a, b) => {
            if (sort === "newest") return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
            if (sort === "oldest") return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
            if (sort === "title") {
                const titleA = (a.title as any)[locale] || a.title?.fr || "";
                const titleB = (b.title as any)[locale] || b.title?.fr || "";
                return titleA.localeCompare(titleB);
            }
            return 0;
        });

        return result;
    }, [resources, searchQuery, filter, sort, locale]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredItems.slice(start, start + itemsPerPage);
    }, [filteredItems, currentPage]);

    const handleAdd = () => {
        setSelectedResource(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (item: ResourceItem) => {
        setSelectedResource(item);
        setIsDialogOpen(true);
    };

    const handleDelete = async (item: ResourceItem) => {
        if (confirm(tRes("messages.deleteConfirm"))) {
            try {
                await deleteResource(item.id);
                toast.success(tRes("messages.deleteSuccess"));
            } catch (err) {
                toast.error(tRes("messages.error"));
            }
        }
    };

    const handleExport = () => {
        const headers = ["ID", "Title (FR)", "Title (EN)", "Category", "File Type", "Size", "Date"];
        const rows = filteredItems.map(item => [
            item.id,
            item.title?.fr || "",
            item.title?.en || "",
            item.category || "",
            item.file_type || "",
            item.file_size || "",
            item.created_at || "",
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `amen_resources_export_${format(new Date(), "yyyy-MM-dd")}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(tCommon("exportSuccess"));
    };

    const onSubmit = async (data: any) => {
        try {
            if (selectedResource) {
                await updateResource({ id: selectedResource.id, data });
                toast.success(tRes("messages.updateSuccess"));
            } else {
                await createResource(data as ResourceCreate);
                toast.success(tRes("messages.saveSuccess"));
            }
            setIsDialogOpen(false);
        } catch (err) {
            toast.error(tRes("messages.error"));
            console.error(err);
        }
    };

    const renderCard = (item: ResourceItem) => {
        const titleStr = (item.title as any)[locale] || item.title?.fr || item.title?.en || "";
        const descStr = item.description ? ((item.description as any)[locale] || item.description?.fr || item.description?.en || "") : "";

        return (
            <div className="flex flex-col gap-5 p-2">
                <div className="w-full aspect-square rounded-[2rem] bg-slate-50 border-2 border-slate-100 flex flex-col items-center justify-center gap-4 relative group-hover:bg-white group-hover:shadow-2xl group-hover:border-transparent transition-all duration-500 overflow-hidden">
                    <div className="p-6 bg-white rounded-[1.5rem] shadow-xl shadow-slate-200/50 group-hover:scale-110 transition-transform duration-500 border border-slate-50 relative z-10">
                        <FileText size={48} className="text-primary" />
                    </div>
                    <div className="flex flex-col items-center gap-1 relative z-10">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{item.file_type || "PDF"}</span>
                        <span className="text-xs font-black text-slate-500">{item.file_size || "0 MB"}</span>
                    </div>

                    {/* Quick Download Overlay */}
                    {item.file_url && (
                        <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center p-8 text-center text-white backdrop-blur-sm">
                            <a
                                href={item.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-3 scale-75 group-hover:scale-100 transition-transform duration-500"
                            >
                                <Download size={40} className="animate-bounce" />
                                <span className="font-black uppercase tracking-widest text-xs">Download Asset</span>
                            </a>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest">
                        <span>{item.category || "General"}</span>
                    </div>
                    <h3 className="font-heading font-black text-lg text-slate-900 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                        {titleStr}
                    </h3>
                    {descStr && (
                        <p className="text-sm font-medium text-slate-400 line-clamp-2 leading-relaxed">
                            {descStr}
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
            {["all", "report", "guide", "infographic", "policy"].map((f) => (
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
                    {tRes(`filters.${f}`)}
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
                    {tRes(`sort.${s}`)}
                </DropdownMenuItem>
            ))}
        </>
    );

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                        <p className="font-bold text-slate-400 animate-pulse tracking-widest uppercase text-xs">{tRes("loading") || "Fetching Resources..."}</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <AdminEntityList
                    title={tSidebar("resources")}
                    description={tRes("description")}
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
                    searchPlaceholder="Search materials by title..."
                />
            </div>
            <ResourcesDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSubmit={onSubmit}
                resource={selectedResource}
                isSubmitting={isCreating}
            />
        </AdminLayout>
    );
}
