"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { AdminEntityList } from "@/components/AdminEntityList";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function EventsManagement() {
    const tSidebar = useTranslations("admin.sidebar");
    const tEv = useTranslations("admin.events");
    const tCommon = useTranslations("admin.common");

    const columns = [
        { key: "id", label: "ID" },
        {
            key: "title",
            label: tEv("columns.name"),
            render: (item: any) => (
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">{item.title}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.location}</span>
                </div>
            )
        },
        {
            key: "status",
            label: tEv("columns.status"),
            render: (item: any) => (
                <Badge className={cn(
                    "rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest",
                    item.status === "Upcoming" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-slate-100 text-slate-500 border-slate-200"
                )}>
                    {item.status === "Upcoming" ? tEv("upcoming") : tEv("past")}
                </Badge>
            )
        },
        { key: "date", label: tEv("columns.date") },
        { key: "attendees", label: tEv("columns.attendees") },
    ];

    const items = [
        { id: "EV-001", title: "Congo Basin Climate Summit", location: "Kinshasa", status: "Upcoming", date: "2024-05-20", attendees: "125" },
        { id: "EV-002", title: "Sustainable Ag Workshop", location: "Goma", status: "Past", date: "2024-01-15", attendees: "45" },
    ];

    return (
        <AdminLayout>
            <AdminEntityList
                title={tSidebar("events")}
                description={tEv("description")}
                items={items}
                columns={columns}
                onAdd={() => console.log("Add New")}
            />
        </AdminLayout>
    );
}
