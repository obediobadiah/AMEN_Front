"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { AdminEntityList } from "@/components/AdminEntityList";
import { useTranslations, useLocale } from "next-intl";
import { PlayCircle, Image as ImageIcon } from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

export default function MultimediaManagement() {
    const tSidebar = useTranslations("admin.sidebar");
    const tMedia = useTranslations("admin.multimedia");
    const tCommon = useTranslations("admin.common");
    const locale = useLocale();

    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [sort, setSort] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const columns = [
        { key: "id", label: tMedia("columns.mediaId") },
        {
            key: "title",
            label: tMedia("columns.content"),
            render: (item: any) => (
                <div className="flex items-center gap-4">
                    <div className="w-16 h-10 rounded-lg bg-slate-100 overflow-hidden relative group">
                        <img src={item.thumbnail} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        {item.type === "Video" && <PlayCircle size={14} className="absolute inset-0 m-auto text-white shadow-lg" />}
                    </div>
                    <span className="text-sm font-black text-slate-900">{item.title}</span>
                </div>
            )
        },
        { key: "type", label: tMedia("columns.type") },
        { key: "date", label: tMedia("columns.addedOn") },
    ];

    const items = [
        { id: "MED-01", title: "Field Work Kasai 2024", type: "Photo", thumbnail: "/images/blog-1.jpg", date: "2024-02-10" },
        { id: "MED-02", title: "NGO Identity Vision", type: "Video", thumbnail: "/images/blog-2.jpg", date: "2024-01-25" },
    ];

    const filteredItems = useMemo(() => {
        let result = items.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = filter === "all" || item.type.toLowerCase() === filter.toLowerCase();
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
            {["all", "photo", "video", "document"].map((f) => (
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

    return (
        <AdminLayout>
            <AdminEntityList
                title={tSidebar("multimedia")}
                description={tMedia("description")}
                items={paginatedItems}
                columns={columns}
                onAdd={() => console.log("Add Media")}
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
