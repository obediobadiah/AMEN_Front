"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { AdminEntityList } from "@/components/AdminEntityList";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DollarSign } from "lucide-react";

export default function DonationsManagement() {
    const tSidebar = useTranslations("admin.sidebar");
    const tDon = useTranslations("admin.donations");
    const tCommon = useTranslations("admin.common");

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
        { id: "DON-8821", donor: "John Doe", email: "john@example.com", amount: "500.00", date: "2024-02-18", method: "Credit Card" },
        { id: "DON-8820", donor: "Sarah Smith", email: "sarah@gmail.com", amount: "1,200.00", date: "2024-02-17", method: "PayPal" },
        { id: "DON-8819", donor: "Anonymous", email: "N/A", amount: "50.00", date: "2024-02-17", method: "M-Pesa" },
    ];

    return (
        <AdminLayout>
            <AdminEntityList
                title={tSidebar("donations")}
                description={tDon("description")}
                items={items}
                columns={columns}
                onAdd={() => console.log("Manual Entry")}
            />
        </AdminLayout>
    );
}
