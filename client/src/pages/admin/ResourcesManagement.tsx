"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { AdminEntityList } from "@/components/AdminEntityList";
import { useTranslations } from "next-intl";
import { Database } from "lucide-react";

export default function ResourcesManagement() {
    const t = useTranslations("admin.sidebar");

    const columns = [
        { key: "id", label: "ID" },
        {
            key: "title",
            label: "Resource Data",
            render: (item: any) => (
                <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-900">{item.title}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.format} &bull; {item.size}</span>
                </div>
            )
        },
        { key: "category", label: "Specialization" },
        { key: "date", label: "Last Sync" },
    ];

    const items = [
        { id: "RES-01", title: "Soil Analysis Dataset", format: "CSV/Excel", size: "2.4MB", category: "Agriculture", date: "2024-02-12" },
        { id: "RES-02", title: "Reforestation Blueprints", format: "PDF", size: "15MB", category: "Conservation", date: "2024-02-05" },
    ];

    return (
        <AdminLayout>
            <AdminEntityList
                title={t("resources")}
                description="Coordinate technical datasets, digital blueprints and knowledge assets."
                items={items}
                columns={columns}
                onAdd={() => console.log("New Resource")}
            />
        </AdminLayout>
    );
}
