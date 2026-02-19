"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { AdminEntityList } from "@/components/AdminEntityList";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function GovernanceManagement() {
    const t = useTranslations("admin.sidebar");

    const columns = [
        {
            key: "name",
            label: "Member",
            render: (item: any) => (
                <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border-2 border-slate-50">
                        <AvatarImage src={item.avatar} />
                        <AvatarFallback>{item.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900">{item.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{item.role}</span>
                    </div>
                </div>
            )
        },
        { key: "department", label: "Sector" },
        {
            key: "status",
            label: "Access Level",
            render: (item: any) => (
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{item.access}</span>
            )
        },
    ];

    const items = [
        { id: 1, name: "Sylvain Lukwebo", title: "Sylvain Lukwebo", role: "Executive Director", avatar: "", department: "Executive", access: "Full Admin", date: "2024-01-01" },
        { id: 2, name: "Marie Claire", title: "Marie Claire", role: "Program Manager", avatar: "", department: "Field Operations", access: "Editor", date: "2024-01-01" },
    ];

    return (
        <AdminLayout>
            <AdminEntityList
                title={t("governance")}
                description="Manage the leadership board, executive team and system access permissions."
                items={items}
                columns={columns}
                onAdd={() => console.log("Add Member")}
            />
        </AdminLayout>
    );
}
