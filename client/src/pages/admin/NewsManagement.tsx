"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { AdminEntityList } from "@/components/AdminEntityList";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

export default function NewsManagement() {
    const t = useTranslations("admin.sidebar");

    const columns = [
        { key: "id", label: "ID" },
        {
            key: "title",
            label: "Article Title",
            render: (item: any) => (
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">{item.title}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.category}</span>
                </div>
            )
        },
        {
            key: "status",
            label: "Status",
            render: (item: any) => (
                <Badge className={cn(
                    "rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest",
                    item.status === "Published" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                )}>
                    {item.status}
                </Badge>
            )
        },
        { key: "date", label: "Date" },
        { key: "author", label: "Author" },
    ];

    const items = [
        { id: "NW-001", title: "Sustainable Farming in Goma", category: "Agriculture", status: "Published", date: "2024-02-15", author: "Admin" },
        { id: "NW-002", title: "New Water Source in Kasai", category: "Water", status: "Draft", date: "2024-02-14", author: "Sarah M." },
        { id: "NW-003", title: "Women Empowerment Workshop", category: "Community", status: "Published", date: "2024-02-10", author: "Admin" },
    ];

    return (
        <AdminLayout>
            <AdminEntityList
                title={t("news")}
                description="Manage your articles, stories and global press releases."
                items={items}
                columns={columns}
                onAdd={() => console.log("Add New")}
            />
        </AdminLayout>
    );
}

import { cn } from "@/lib/utils";
