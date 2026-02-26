"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { AdminEntityList } from "@/components/AdminEntityList";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

export default function ContactsManagement() {
    const tSidebar = useTranslations("admin.sidebar");
    const tCont = useTranslations("admin.contacts");
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
            key: "sender",
            label: tCont("columns.sender"),
            render: (item: any) => (
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-black text-slate-900">{item.name}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.email}</span>
                </div>
            )
        },
        {
            key: "subject",
            label: tCont("columns.subject"),
            render: (item: any) => (
                <span className="text-sm font-medium text-slate-600 truncate max-w-[200px] block">{item.subject}</span>
            )
        },
        { key: "date", label: tCont("columns.received") },
        {
            key: "status",
            label: tCommon("status"),
            render: (item: any) => (
                <Badge className={cn(
                    "rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest",
                    item.status === "Unread" ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-slate-50 text-slate-400 border-slate-100"
                )}>
                    {item.status}
                </Badge>
            )
        },
    ];

    const items = [
        { id: "MSG-001", name: "Alice Thompson", email: "alice@outlook.com", subject: "Partnership Inquiry - Green Africa", date: "2024-02-19T10:00:00Z", status: "Unread", type: "partner" },
        { id: "MSG-002", name: "Bob Wilson", email: "bob@wilson.com", subject: "Question about latest annual report", date: "2024-02-19T06:00:00Z", status: "Read", type: "contact" },
        { id: "MSG-003", name: "Charlie Brown", email: "charlie@gmail.com", subject: "Volunteering opportunity", date: "2024-02-18T12:00:00Z", status: "Read", type: "volunteer" },
    ];

    const filteredItems = useMemo(() => {
        let result = items.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.subject.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesFilter = filter === "all" || item.type === filter;

            return matchesSearch && matchesFilter;
        });

        result.sort((a, b) => {
            if (sort === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
            if (sort === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
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
            {["all", "contact", "volunteer", "partner", "newsletter"].map((f) => (
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
                    {tCont(`filters.${f}`)}
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
                    {tCont(`sort.${s}`)}
                </DropdownMenuItem>
            ))}
        </>
    );

    return (
        <AdminLayout>
            <AdminEntityList
                title={tSidebar("contacts")}
                description={tCont("description")}
                items={paginatedItems}
                columns={columns}
                onAdd={() => console.log("New Message")}
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
