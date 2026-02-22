"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { AdminEntityList } from "@/components/AdminEntityList";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function ContactsManagement() {
    const tSidebar = useTranslations("admin.sidebar");
    const tCont = useTranslations("admin.contacts");
    const tCommon = useTranslations("admin.common");

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
        { id: "MSG-001", name: "Alice Thompson", email: "alice@outlook.com", subject: "Partnership Inquiry - Green Africa", date: "2m ago", status: "Unread" },
        { id: "MSG-002", name: "Bob Wilson", email: "bob@wilson.com", subject: "Question about latest annual report", date: "4h ago", status: "Read" },
    ];

    return (
        <AdminLayout>
            <AdminEntityList
                title={tSidebar("contacts")}
                description={tCont("description")}
                items={items}
                columns={columns}
                onAdd={() => console.log("New Message")}
            />
        </AdminLayout>
    );
}
