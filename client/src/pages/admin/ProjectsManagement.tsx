"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { AdminEntityList } from "@/components/AdminEntityList";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function ProjectsManagement() {
    const tSidebar = useTranslations("admin.sidebar");
    const tProj = useTranslations("admin.projects");
    const tCommon = useTranslations("admin.common");

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
        { id: "PRJ-001", title: "Congo Basin Reforestation", location: "Orientation Province", progress: 75, category: "Environment", impact: "50k Trees" },
        { id: "PRJ-002", title: "Clean Water Kasai", location: "Kasai District", progress: 40, category: "Health", impact: "12 Wells" },
    ];

    return (
        <AdminLayout>
            <AdminEntityList
                title={tSidebar("projects")}
                description={tProj("description")}
                items={items}
                columns={columns}
                onAdd={() => console.log("Add New")}
            />
        </AdminLayout>
    );
}
