"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { AdminEntityList } from "@/components/AdminEntityList";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { FileDown } from "lucide-react";

export default function PublicationsManagement() {
    const t = useTranslations("admin.sidebar");

    const columns = [
        { key: "id", label: "Ref" },
        {
            key: "title",
            label: "Publication Title",
            render: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                        <FileDown size={18} />
                    </div>
                    <span className="text-sm font-black text-slate-900">{item.title}</span>
                </div>
            )
        },
        { key: "type", label: "Category" },
        { key: "date", label: "Release Date" },
        { key: "downloads", label: "Downloads" },
    ];

    const items = [
        { id: "PUB-24", title: "Annual Impact Report 2023", type: "Report", date: "Jan 2024", downloads: "1.2k" },
        { id: "PUB-23", title: "Congo Basin Biodiversity Guide", type: "Technical", date: "Dec 2023", downloads: "850" },
    ];

    return (
        <AdminLayout>
            <AdminEntityList
                title={t("publications")}
                description="Upload and archive official documents, reports and research papers."
                items={items}
                columns={columns}
                onAdd={() => console.log("Upload")}
            />
        </AdminLayout>
    );
}
