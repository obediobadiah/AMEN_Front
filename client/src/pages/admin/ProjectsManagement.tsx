"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { AdminEntityList } from "@/components/AdminEntityList";
import { useTranslations, useLocale } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { cn, formatImpact } from "@/lib/utils";
import { useState, useMemo } from "react";
import { useProjects, Project, ProjectCreate } from "@/hooks/use-projects";
import { ProjectsDialog } from "@/components/admin/ProjectsDialog";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/api-config";
import { ImageIcon, Briefcase, MapPin, TrendingUp } from "lucide-react";
import {
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

export default function ProjectsManagement() {
    const tSidebar = useTranslations("admin.sidebar");
    const tProj = useTranslations("admin.projects");
    const tCommon = useTranslations("admin.common");
    const locale = useLocale();

    const { projects, isLoading, createProject, updateProject, deleteProject, isCreating } = useProjects();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [sort, setSort] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const columns = [
        { key: "id", label: "ID" },
        {
            key: "title",
            label: tProj("columns.name"),
            render: (item: Project) => (
                <div className="flex items-center gap-4">
                    {item.image_url ? (
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 border-slate-100 shadow-sm">
                            <img src={getImageUrl(item.image_url)} alt="Thumbnail" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-12 h-12 rounded-xl shrink-0 bg-slate-50 border-2 border-slate-100 flex items-center justify-center text-slate-300">
                            <Briefcase size={20} />
                        </div>
                    )}
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">
                            {(item.title as any)[locale] || item.title.fr || item.title.en}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest line-clamp-1">
                            {item.location ? ((item.location as any)[locale] || (item.location as any).fr || (item.location as any).en) : "-"}
                        </span>
                    </div>
                </div>
            )
        },
        {
            key: "status",
            label: tProj("columns.progress"),
            render: (item: Project) => (
                <Badge className={cn(
                    "rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest",
                    item.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                        item.status === "Completed" ? "bg-blue-50 text-blue-600 border-blue-100" :
                            "bg-slate-100 text-slate-500 border-slate-200"
                )}>
                    {item.status ? tProj(`dialog.${item.status.toLowerCase()}`) : tProj("dialog.upcoming")}
                </Badge>
            )
        },
        {
            key: "category",
            label: tProj("columns.focus"),
            render: (item: Project) => (
                <span className="text-sm font-bold text-slate-600">
                    {item.category ? ((item.category as any)[locale] || (item.category as any).fr || (item.category as any).en) : "-"}
                </span>
            )
        },

        {
            key: "impact",
            label: tProj("columns.impact"),
            render: (item: Project) => (
                <span className="text-sm font-bold text-slate-600">
                    {formatImpact(item.impact_stats ? ((item.impact_stats as any)[locale] || (item.impact_stats as any).fr || (item.impact_stats as any).en) : "-")}
                </span>
            )
        },
    ];

    const filteredItems = useMemo(() => {
        let result = projects.filter(item => {
            const titleFr = item.title?.fr?.toLowerCase() || "";
            const titleEn = item.title?.en?.toLowerCase() || "";
            const search = searchQuery.toLowerCase();
            const matchesSearch = titleFr.includes(search) || titleEn.includes(search);

            const categoryLabel = (item.category ? ((item.category as any).en || (item.category as any).fr || "").toLowerCase() : "");
            const statusLabel = item.status?.toLowerCase() || "upcoming";

            const matchesFilter = filter === "all" ||
                (filter === "environment" && categoryLabel.includes("environment")) ||
                (filter === "health" && categoryLabel.includes("health")) ||
                (filter === "education" && categoryLabel.includes("education")) ||
                (filter === "humanitarian" && categoryLabel.includes("humanitarian")) ||
                (filter === "infrastructure" && categoryLabel.includes("infrastructure")) ||
                (filter === "active" && statusLabel === "active") ||
                (filter === "completed" && statusLabel === "completed") ||
                (filter === "upcoming" && statusLabel === "upcoming");


            return matchesSearch && matchesFilter;
        });

        result.sort((a, b) => {
            if (sort === "newest") return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
            if (sort === "oldest") return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
            if (sort === "name") {
                const titleA = (a.title as any)[locale] || a.title?.fr || "";
                const titleB = (b.title as any)[locale] || b.title?.fr || "";
                return titleA.localeCompare(titleB);
            }
            return 0;
        });

        return result;
    }, [projects, searchQuery, filter, sort, locale]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredItems.slice(start, start + itemsPerPage);
    }, [filteredItems, currentPage]);

    const handleAdd = () => {
        setSelectedProject(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (item: Project) => {
        setSelectedProject(item);
        setIsDialogOpen(true);
    };

    const handleDelete = async (item: Project) => {
        if (confirm(tProj("messages.deleteConfirm"))) {
            try {
                await deleteProject(item.id);
                toast.success(tProj("messages.deleteSuccess"));
            } catch (err) {
                toast.error(tProj("messages.error"));
            }
        }
    };

    const handleExport = () => {
        const headers = ["ID", "Title (FR)", "Title (EN)", "Category", "Status", "Location", "Impact"];
        const rows = filteredItems.map(item => [
            item.id,
            item.title?.fr || "",
            item.title?.en || "",
            item.category || "",
            item.status || "",
            (item.location as any)?.fr || "",
            (item.impact_stats as any)?.fr || "",
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `amen_projects_export_${format(new Date(), "yyyy-MM-dd")}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(tCommon("exportSuccess"));
    };

    const onSubmit = async (data: any) => {
        try {
            if (selectedProject) {
                await updateProject({ id: selectedProject.id, data });
                toast.success(tProj("messages.updateSuccess"));
            } else {
                await createProject(data as ProjectCreate);
                toast.success(tProj("messages.saveSuccess"));
            }
            setIsDialogOpen(false);
        } catch (err) {
            toast.error(tProj("messages.error"));
            console.error(err);
        }
    };

    const renderCard = (item: Project) => {
        const titleStr = (item.title as any)[locale] || item.title?.fr || item.title?.en || "";
        const descStr = item.description ? ((item.description as any)[locale] || item.description?.fr || item.description?.en || "") : "";
        const impactStr = formatImpact(item.impact_stats ? ((item.impact_stats as any)[locale] || (item.impact_stats as any).fr || (item.impact_stats as any).en) : "");
        const locStr = item.location ? ((item.location as any)[locale] || (item.location as any).fr || (item.location as any).en || "") : "";

        return (
            <div className="flex flex-col gap-3 sm:gap-4">
                <div className="w-full h-40 sm:h-48 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-50 relative group-hover:shadow-xl transition-all duration-500 border-2 border-slate-100">
                    {item.image_url ? (
                        <img
                            src={getImageUrl(item.image_url)}
                            alt={titleStr}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Briefcase size={32} className="opacity-50 sm:size-12" />
                        </div>
                    )}
                    <Badge className={cn(
                        "absolute top-3 sm:top-4 left-3 sm:left-4 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 shadow-lg text-[8px] sm:text-[10px] font-black uppercase tracking-widest border-0 flex items-center gap-1.5 sm:gap-2",
                        item.status === "Active" ? "bg-emerald-500 text-white" :
                            item.status === "Completed" ? "bg-blue-500 text-white" : "bg-slate-800 text-white"
                    )}>
                        {item.status ? tProj(`dialog.${item.status.toLowerCase()}`) : tProj("dialog.upcoming")}
                    </Badge>
                </div>

                <div className="space-y-2 sm:space-y-3 px-1">
                    <div className="flex items-center gap-2 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest mt-1 sm:mt-2">
                        <span>
                            {item.category ? ((item.category as any)[locale] || (item.category as any).fr || (item.category as any).en) : ""}
                        </span>
                    </div>


                    <h3 className="font-heading font-black text-lg sm:text-xl text-slate-900 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                        {titleStr}
                    </h3>

                    {descStr && (
                        <p className="text-xs sm:text-sm font-medium text-slate-500 line-clamp-2 leading-relaxed">
                            {descStr}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-3 sm:pt-4 border-t border-slate-100">
                        {impactStr && (
                            <div className="flex items-center gap-1.5 sm:gap-2 text-slate-500 text-[10px] sm:text-xs font-bold">
                                <TrendingUp size={12} className="text-primary sm:size-[14px]" />
                                <span>{impactStr}</span>
                            </div>
                        )}
                        {locStr && (
                            <div className="flex items-center gap-1.5 sm:gap-2 text-slate-500 text-[10px] sm:text-xs font-bold">
                                <MapPin size={12} className="text-primary sm:size-[14px]" />
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
            {["all", "environment", "health", "education", "humanitarian", "active", "completed", "upcoming"].map((f) => (
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
                    {tProj(`filters.${f}`)}
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
            {["newest", "oldest", "name"].map((s) => (
                <DropdownMenuItem
                    key={s}
                    onClick={() => setSort(s)}
                    className={cn(
                        "rounded-xl px-3 py-2.5 cursor-pointer font-bold text-sm transition-colors",
                        sort === s ? "bg-primary/5 text-primary" : "text-slate-600 hover:bg-slate-50"
                    )}
                >
                    {tProj(`sort.${s}`)}
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
                        <p className="font-bold text-slate-400 animate-pulse tracking-widest uppercase text-xs">{tProj("loading")}</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <AdminEntityList
                    title={tSidebar("projects")}
                    description={tProj("description")}
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
                    searchPlaceholder={tProj("searchPlaceholder")}
                />
            </div>
            <ProjectsDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSubmit={onSubmit}
                project={selectedProject}
                isSubmitting={isCreating}
            />
        </AdminLayout>
    );
}
