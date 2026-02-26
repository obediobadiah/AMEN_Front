"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { AdminEntityList } from "@/components/AdminEntityList";
import { useTranslations, useLocale } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useEvents, Event, EventCreate } from "@/hooks/use-events";
import { useState, useMemo } from "react";
import { EventsDialog } from "@/components/admin/EventsDialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { getImageUrl } from "@/lib/api-config";
import { ImageIcon, Clock, MapPin } from "lucide-react";
import {
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

export default function EventsManagement() {
    const tSidebar = useTranslations("admin.sidebar");
    const tEv = useTranslations("admin.events");
    const tCommon = useTranslations("admin.common");
    const locale = useLocale();

    const { events, isLoading, createEvent, updateEvent, deleteEvent, isCreating } = useEvents();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [sort, setSort] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const columns = [
        { key: "id", label: "ID" },
        {
            key: "title",
            label: tEv("columns.name"),
            render: (item: Event) => (
                <div className="flex items-center gap-4">
                    {item.thumbnail_url ? (
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 border-slate-100 shadow-sm">
                            <img src={getImageUrl(item.thumbnail_url)} alt="Thumbnail" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-12 h-12 rounded-xl shrink-0 bg-slate-50 border-2 border-slate-100 flex items-center justify-center text-slate-300">
                            <ImageIcon size={20} />
                        </div>
                    )}
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">
                            {(item.title as any)[locale] || item.title.fr || item.title.en}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest line-clamp-1">
                            {item.location ? ((item.location as any)[locale] || item.location.fr || item.location.en) : "-"}
                        </span>
                    </div>
                </div>
            )
        },
        {
            key: "status",
            label: tEv("columns.status"),
            render: (item: Event) => (
                <Badge className={cn(
                    "rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest",
                    item.status === "Upcoming" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-slate-100 text-slate-500 border-slate-200"
                )}>
                    {item.status === "Upcoming" ? tEv("columns.upcoming") : tEv("columns.past")}
                </Badge>
            )
        },
        {
            key: "date",
            label: tEv("columns.date"),
            render: (item: Event) => (
                <span className="text-sm">
                    {item.start_date ? format(new Date(item.start_date), "MMM dd, yyyy") : "-"}
                </span>
            )
        },
    ];

    const filteredItems = useMemo(() => {
        let result = events.filter(item => {
            const titleFr = item.title?.fr?.toLowerCase() || "";
            const titleEn = item.title?.en?.toLowerCase() || "";
            const search = searchQuery.toLowerCase();
            const matchesSearch = titleFr.includes(search) || titleEn.includes(search);

            const categoryLabel = item.category?.toLowerCase() || "workshop";
            const statusLabel = item.status?.toLowerCase() || "upcoming";

            const matchesFilter = filter === "all" ||
                (filter === "workshop" && categoryLabel === "workshop") ||
                (filter === "conference" && categoryLabel === "conference") ||
                (filter === "field" && categoryLabel === "field activity") ||
                (filter === "upcoming" && statusLabel === "upcoming") ||
                (filter === "past" && statusLabel === "past");

            return matchesSearch && matchesFilter;
        });

        // Sorting
        result.sort((a, b) => {
            if (sort === "newest") return new Date(b.start_date || 0).getTime() - new Date(a.start_date || 0).getTime();
            if (sort === "oldest") return new Date(a.start_date || 0).getTime() - new Date(b.start_date || 0).getTime();
            if (sort === "title") {
                const titleA = (a.title as any)[locale] || a.title?.fr || "";
                const titleB = (b.title as any)[locale] || b.title?.fr || "";
                return titleA.localeCompare(titleB);
            }
            return 0;
        });

        return result;
    }, [events, searchQuery, filter, sort, locale]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredItems.slice(start, start + itemsPerPage);
    }, [filteredItems, currentPage]);

    const handleAdd = () => {
        setSelectedEvent(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (item: Event) => {
        setSelectedEvent(item);
        setIsDialogOpen(true);
    };

    const handleDelete = async (item: Event) => {
        if (confirm(tEv("deleteConfirm"))) {
            try {
                await deleteEvent(item.id);
                toast.success(tEv("deleteSuccess"));
            } catch (err) {
                toast.error(tEv("deleteError"));
            }
        }
    };


    const handleExport = () => {
        const headers = ["ID", "Title (FR)", "Title (EN)", "Description (FR)", "Description (EN)", "Location (FR)", "Location (EN)", "Start Date", "End Date", "Status", "Category"];
        const rows = filteredItems.map(item => [
            item.id,
            item.title?.fr || "",
            item.title?.en || "",
            item.description?.fr || "",
            item.description?.en || "",
            item.location?.fr || "",
            item.location?.en || "",
            item.start_date || "",
            item.end_date || "",
            item.status || "",
            item.category || "",
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `amen_events_export_${format(new Date(), "yyyy-MM-dd")}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(tEv("exportSuccess"));
    };


    const onSubmit = async (data: any) => {
        try {
            if (selectedEvent) {
                await updateEvent({ id: selectedEvent.id, data });
                toast.success(tEv("saveSuccess"));
            } else {
                await createEvent(data as EventCreate);
                toast.success(tEv("saveSuccess"));
            }
        } catch (err) {
            toast.error(tEv("saveError"));
            console.error(err);
        }
    };

    const renderCard = (item: Event) => {
        const titleStr = (item.title as any)[locale] || item.title?.fr || item.title?.en || "";
        const descStr = item.description ? ((item.description as any)[locale] || item.description?.fr || item.description?.en || "") : "";
        const locStr = item.location ? ((item.location as any)[locale] || item.location?.fr || item.location?.en || "") : "";

        return (
            <div className="flex flex-col gap-4">
                {/* Thumbnail */}
                <div className="w-full h-48 rounded-2xl overflow-hidden bg-slate-50 relative group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 border-2 border-slate-100">
                    {item.thumbnail_url ? (
                        <img
                            src={getImageUrl(item.thumbnail_url)}
                            alt={titleStr}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <ImageIcon size={48} className="opacity-50" />
                        </div>
                    )}
                    <Badge className={cn(
                        "absolute top-4 left-4 rounded-full px-3 py-1 shadow-lg text-[10px] font-black uppercase tracking-widest border-0 flex items-center gap-2",
                        item.status === "Upcoming" ? "bg-primary text-white" : "bg-slate-800 text-white"
                    )}>
                        {item.status === "Upcoming" ? tEv("columns.upcoming") : tEv("columns.past")}
                    </Badge>
                </div>

                {/* Content */}
                <div className="space-y-3 px-1">
                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mt-2">
                        <span>{item.category || "Workshop"}</span>
                    </div>

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
                            <Clock size={14} className="text-primary" />
                            <span>{item.start_date ? format(new Date(item.start_date), "MMM dd, yyyy") : "-"}</span>
                        </div>
                        {locStr && (
                            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                                <MapPin size={14} className="text-primary" />
                                <span className="line-clamp-1">{locStr}</span>
                            </div>
                        )}
                    </div>
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
            {["all", "workshop", "conference", "field", "upcoming", "past"].map((f) => (
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
                    {tEv(`filters.${f}`)}
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
                    {tEv(`sort.${s}`)}
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
                        <p className="font-bold text-slate-400 animate-pulse tracking-widest uppercase text-xs">{tEv("loading")}</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <AdminEntityList
                    title={tSidebar("events")}
                    description={tEv("description")}
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
                    searchPlaceholder="Search events..."
                />
            </div>
            <EventsDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSubmit={onSubmit}
                event={selectedEvent}
                isSubmitting={isCreating}
            />
        </AdminLayout>
    );
}
