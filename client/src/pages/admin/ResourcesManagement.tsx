"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { AdminEntityList } from "@/components/AdminEntityList";
import { useTranslations, useLocale } from "next-intl";
import { Database } from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
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
            render: (item: any) => (
                <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-900">{item.title}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.format} &bull; {item.size}</span>
                </div>
            )
        },
        { key: "category", label: tRes("columns.category") },
        { key: "date", label: tRes("columns.updated") },
    ];

    const items = [
        { id: "RES-01", title: "Soil Analysis Dataset", format: "CSV/Excel", size: "2.4MB", category: "Report", date: "2024-02-12" },
        { id: "RES-02", title: "Reforestation Blueprints", format: "PDF", size: "15MB", category: "Guide", date: "2024-02-05" },
        { id: "RES-03", title: "Environmental Policy 2024", format: "PDF", size: "1.2MB", category: "Policy", date: "2024-03-20" },
    ];

    const filteredItems = useMemo(() => {
        let result = items.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = filter === "all" || item.category.toLowerCase() === filter.toLowerCase();
            return matchesSearch && matchesFilter;
        });

        result.sort((a, b) => {
            if (sort === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
            if (sort === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
            if (sort === "title") return a.title.localeCompare(b.title);
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

    return (
        <AdminLayout>
            <AdminEntityList
                title={tSidebar("resources")}
                description={tRes("description")}
                items={paginatedItems}
                columns={columns}
                onAdd={() => console.log("New Resource")}
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
