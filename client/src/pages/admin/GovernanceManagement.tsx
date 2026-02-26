"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { AdminEntityList } from "@/components/AdminEntityList";
import { useTranslations, useLocale } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

export default function GovernanceManagement() {
    const tSidebar = useTranslations("admin.sidebar");
    const tGov = useTranslations("admin.governance");
    const tCommon = useTranslations("admin.common");
    const locale = useLocale();

    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [sort, setSort] = useState("name");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const columns = [
        {
            key: "name",
            label: tGov("columns.name"),
            render: (item: any) => (
                <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border-2 border-slate-50">
                        <AvatarImage src={item.avatar} />
                        <AvatarFallback>{item.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900">{item.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{item.role}</span>
                    </div>
                </div>
            )
        },
        { key: "department", label: tGov("columns.department") },
        {
            key: "status",
            label: tGov("columns.status"),
            render: (item: any) => (
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{item.access}</span>
            )
        },
    ];

    const items = [
        { id: 1, name: "Sylvain Lukwebo", role: "Executive Director", avatar: "", organ: "pe", department: "Executive", access: "Full Admin", order: 1 },
        { id: 2, name: "Marie Claire", role: "Program Manager", avatar: "", organ: "dg", department: "Field Operations", access: "Editor", order: 2 },
        { id: 3, name: "Jean Dupont", role: "Board Member", avatar: "", organ: "cd", department: "Board", access: "Viewer", order: 3 },
    ];

    const filteredItems = useMemo(() => {
        let result = items.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.role.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesFilter = filter === "all" || item.organ === filter;

            return matchesSearch && matchesFilter;
        });

        result.sort((a, b) => {
            if (sort === "order") return a.order - b.order;
            if (sort === "name") return a.name.localeCompare(b.name);
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
            {["all", "ag", "cd", "pe", "dg"].map((f) => (
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
                    {tGov(`filters.${f}`)}
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
            {["order", "name"].map((s) => (
                <DropdownMenuItem
                    key={s}
                    onClick={() => setSort(s)}
                    className={cn(
                        "rounded-xl px-3 py-2.5 cursor-pointer font-bold text-sm transition-colors",
                        sort === s ? "bg-primary/5 text-primary" : "text-slate-600 hover:bg-slate-50"
                    )}
                >
                    {tGov(`sort.${s}`)}
                </DropdownMenuItem>
            ))}
        </>
    );

    return (
        <AdminLayout>
            <AdminEntityList
                title={tSidebar("governance")}
                description={tGov("description")}
                items={paginatedItems}
                columns={columns}
                onAdd={() => console.log("Add Member")}
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
