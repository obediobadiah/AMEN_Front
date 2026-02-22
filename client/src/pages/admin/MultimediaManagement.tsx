"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { AdminEntityList } from "@/components/AdminEntityList";
import { useTranslations } from "next-intl";
import { PlayCircle, Image as ImageIcon } from "lucide-react";

export default function MultimediaManagement() {
    const tSidebar = useTranslations("admin.sidebar");
    const tMedia = useTranslations("admin.multimedia");
    const tCommon = useTranslations("admin.common");

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
        { id: "MED-01", title: "Field Work Kasai 2024", type: "Photo", thumbnail: "/images/blog-1.jpg", date: "Feb 10" },
        { id: "MED-02", title: "NGO Identity Vision", type: "Video", thumbnail: "/images/blog-2.jpg", date: "Jan 25" },
    ];

    return (
        <AdminLayout>
            <AdminEntityList
                title={tSidebar("multimedia")}
                description={tMedia("description")}
                items={items}
                columns={columns}
                onAdd={() => console.log("Add Media")}
            />
        </AdminLayout>
    );
}
