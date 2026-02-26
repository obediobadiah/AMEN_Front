"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { AdminEntityList } from "@/components/AdminEntityList";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DollarSign } from "lucide-react";
import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

export default function DonationsManagement() {
    const tSidebar = useTranslations("admin.sidebar");
    const tDon = useTranslations("admin.donations");
    const tCommon = useTranslations("admin.common");
    const locale = useLocale();

    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [sort, setSort] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const columns = [
        { key: "id", label: "Reference" },
        {
            key: "donor",
            label: tDon("columns.donor"),
            render: (item: any) => (
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-black text-slate-900">{item.donor}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.email}</span>
                </div>
            )
        },
        {
            key: "amount",
            label: tDon("columns.amount"),
            render: (item: any) => (
                <div className="flex items-center gap-1.5 font-black text-emerald-600">
                    <DollarSign size={14} strokeWidth={3} />
                    <span>{item.amount}</span>
                </div>
            )
        },
        { key: "date", label: tDon("columns.date") },
        {
            key: "method",
            label: tDon("columns.method"),
            render: (item: any) => (
                <Badge variant="outline" className="rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-500">
                    {item.method}
                </Badge>
            )
        },
    ];

    const items = [
        { id: "DON-8821", donor: "John Doe", email: "john@example.com", amount: 500.00, date: "2024-02-18", method: "Credit Card", type: "one-time" },
        { id: "DON-8820", donor: "Sarah Smith", email: "sarah@gmail.com", amount: 1200.00, date: "2024-02-17", method: "PayPal", type: "monthly" },
        { id: "DON-8819", donor: "Anonymous", email: "N/A", amount: 50.00, date: "2024-02-17", method: "M-Pesa", type: "one-time" },
    ];

    const filteredItems = useMemo(() => {
        let result = items.filter(item => {
            const matchesSearch = item.donor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.email.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesFilter = filter === "all" || item.type === filter;

            return matchesSearch && matchesFilter;
        });

        result.sort((a, b) => {
            if (sort === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
            if (sort === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
            if (sort === "amount") return b.amount - a.amount;
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
            {["all", "one-time", "monthly"].map((f) => (
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
                    {tDon(`filters.${f}`)}
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
            {["newest", "oldest", "amount"].map((s) => (
                <DropdownMenuItem
                    key={s}
                    onClick={() => setSort(s)}
                    className={cn(
                        "rounded-xl px-3 py-2.5 cursor-pointer font-bold text-sm transition-colors",
                        sort === s ? "bg-primary/5 text-primary" : "text-slate-600 hover:bg-slate-50"
                    )}
                >
                    {tDon(`sort.${s}`)}
                </DropdownMenuItem>
            ))}
        </>
    );

    return (
        <AdminLayout>
            <AdminEntityList
                title={tSidebar("donations")}
                description={tDon("description")}
                items={paginatedItems}
                columns={columns}
                onAdd={() => console.log("Manual Entry")}
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
