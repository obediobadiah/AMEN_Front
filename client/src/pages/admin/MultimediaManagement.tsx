"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { AdminEntityList } from "@/components/AdminEntityList";
import { useTranslations } from "next-intl";
import { PlayCircle, Image as ImageIcon } from "lucide-react";

export default function MultimediaManagement() {
    const t = useTranslations("admin.sidebar");

    const columns = [
        { key: "id", label: "Media ID" },
        {
            key: "title",
            label: "Media Content",
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
        { key: "type", label: "Media Type" },
        { key: "date", label: "Added On" },
    ];

    const items = [
        { id: "MED-01", title: "Field Work Kasai 2024", type: "Photo", thumbnail: "/images/blog-1.jpg", date: "Feb 10" },
        { id: "MED-02", title: "NGO Identity Vision", type: "Video", thumbnail: "/images/blog-2.jpg", date: "Jan 25" },
    ];

    return (
        <AdminLayout>
            <AdminEntityList
                title={t("multimedia")}
                description="Manage gallery assets, project videos and visual content library."
                items={items}
                columns={columns}
                onAdd={() => console.log("Add Media")}
            />
        </AdminLayout>
    );
}
