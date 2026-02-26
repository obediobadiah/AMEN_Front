"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { AdminEntityList } from "@/components/AdminEntityList";
import { useTranslations, useLocale } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import {
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

export default function ProjectsManagement() {
    const tSidebar = useTranslations("admin.sidebar");
    const tProj = useTranslations("admin.projects");
    const tCommon = useTranslations("admin.common");
    const locale = useLocale();

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
            render: (item: any) => (
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">{item.title}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.location}</span>
                </div>
            )
        },
        {
            key: "status",
            label: tProj("columns.progress"),
            render: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${item.progress}%` }} />
                    </div>
                    <span className="text-[10px] font-black text-slate-500">{item.progress}%</span>
                </div>
            )
        },
        { key: "category", label: tProj("columns.focus") },
        { key: "impact", label: tProj("columns.impact") },
    ];

    const items = [
        { id: "PRJ-001", title: "Congo Basin Reforestation", location: "Orientation Province", progress: 75, category: "Environment", status: "Active", impact: "50k Trees", date: "2024-03-01" },
        { id: "PRJ-002", title: "Clean Water Kasai", location: "Kasai District", progress: 0, category: "Health", status: "Upcoming", impact: "12 Wells", date: "2024-04-15" },
        { id: "PRJ-003", title: "Tech Education Bandundu", location: "Bandundu", progress: 100, category: "Education", status: "Completed", impact: "5 Schools", date: "2023-12-10" },
    ];

    const filteredItems = useMemo(() => {
        let result = items.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.location.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesFilter = filter === "all" ||
                item.category.toLowerCase() === filter.toLowerCase() ||
                item.status.toLowerCase() === filter.toLowerCase();

            return matchesSearch && matchesFilter;
        });

        result.sort((a, b) => {
            if (sort === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
            if (sort === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
            if (sort === "progress") return b.progress - a.progress;
            if (sort === "name") return a.title.localeCompare(b.title);
            return 0;
        });

        return result;
    }, [searchQuery, filter, sort]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredItems.slice(start, start + itemsPerPage);
    }, [filteredItems, currentPage]);

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
            {["newest", "oldest", "progress", "name"].map((s) => (
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

    return (
        <AdminLayout>
            <AdminEntityList
                title={tSidebar("projects")}
                description={tProj("description")}
                items={paginatedItems}
                columns={columns}
                onAdd={() => console.log("Add New")}
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
            />
        </AdminLayout>
    );
}
