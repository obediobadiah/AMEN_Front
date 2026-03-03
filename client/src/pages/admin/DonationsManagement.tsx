"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { AdminEntityList } from "@/components/AdminEntityList";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DollarSign, Loader2, Calendar, CreditCard, User, Mail, Tag, Plus, Pencil } from "lucide-react";
import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useDonations, Donation } from "@/hooks/use-donations";
import {
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { DonationDialog } from "@/components/admin/DonationDialog";
import { format } from "date-fns";

export default function DonationsManagement() {
    const tSidebar = useTranslations("admin.sidebar");
    const tDon = useTranslations("admin.donations");
    const tCommon = useTranslations("admin.common");
    const locale = useLocale();

    const {
        donations,
        isLoading,
        deleteDonation,
        createDonation,
        updateDonation,
        isCreating,
        isUpdating
    } = useDonations();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

    const handleAdd = () => {
        setSelectedDonation(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (item: Donation) => {
        setSelectedDonation(item);
        setIsDialogOpen(true);
    };

    const handleFormSubmit = async (data: any) => {
        try {
            if (selectedDonation) {
                await updateDonation({ id: selectedDonation.id, data });
                toast.success(tDon("messages.saveSuccess") || tCommon("saveSuccess", { type: "Donation" }));
            } else {
                await createDonation(data);
                toast.success(tDon("messages.saveSuccess") || tCommon("saveSuccess", { type: "Donation" }));
            }
            setIsDialogOpen(false);
        } catch (err) {
            toast.error(tDon("messages.error") || tCommon("error"));
            console.error(err);
        }
    };

    const handleDelete = async (item: Donation) => {
        if (confirm(tDon("messages.deleteConfirm"))) {
            try {
                await deleteDonation(item.id);
                toast.success(tDon("messages.deleteSuccess"));
            } catch (err) {
                toast.error(tDon("messages.error"));
                console.error(err);
            }
        }
    };

    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [sort, setSort] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const columns = [
        {
            key: "id",
            label: "Ref #",
            render: (item: any) => (
                <span className="text-xs font-mono font-bold text-slate-400">#DON-{item.id}</span>
            )
        },
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
                    <span>{item.amount.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US')}</span>
                    <span className="text-[10px] uppercase opacity-60 ml-1">{item.currency}</span>
                </div>
            )
        },
        {
            key: "frequency",
            label: tDon("columns.type"),
            render: (item: any) => (
                <Badge variant="outline" className={cn(
                    "rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest border-slate-200",
                    item.frequency === 'monthly' ? "text-primary border-primary/20 bg-primary/5" : "text-slate-500"
                )}>
                    {tDon(`filters.${item.frequency === 'oneTime' ? 'one-time' : item.frequency}`)}
                </Badge>
            )
        },
        {
            key: "method",
            label: tDon("columns.method"),
            render: (item: any) => (
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 capitalize">
                    <CreditCard size={14} className="text-slate-300" />
                    {item.method || "card"}
                </div>
            )
        },
        {
            key: "status",
            label: tDon("columns.status"),
            render: (item: any) => (
                <Badge className={cn(
                    "rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest border-none shadow-sm",
                    item.status === 'completed' ? "bg-emerald-500/10 text-emerald-600" :
                        item.status === 'pending' ? "bg-amber-500/10 text-amber-600" :
                            "bg-rose-500/10 text-rose-600"
                )}>
                    {item.status || "completed"}
                </Badge>
            )
        },
        {
            key: "created_at",
            label: tDon("columns.date"),
            render: (item: any) => (
                <span className="text-xs font-medium text-slate-500">
                    {new Date(item.created_at).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
                </span>
            )
        }
    ];

    const filteredItems = useMemo(() => {
        let result = (donations || []).filter(item => {
            const matchesSearch =
                item.donor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.email.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesFilter = filter === "all" || item.frequency === filter;

            return matchesSearch && matchesFilter;
        });

        result.sort((a, b) => {
            if (sort === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            if (sort === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            if (sort === "amount") return b.amount - a.amount;
            return 0;
        });

        return result;
    }, [donations, searchQuery, filter, sort]);

    const stats = useMemo(() => {
        const total = filteredItems.reduce((acc, curr) => acc + curr.amount, 0);
        const donors = new Set(filteredItems.map(i => i.email)).size;
        const monthlyDonors = new Set(filteredItems.filter(i => i.frequency === 'monthly').map(i => i.email)).size;
        const avg = filteredItems.length > 0 ? total / filteredItems.length : 0;

        return [
            { label: tDon("stats.totalRaised"), value: `$${total.toLocaleString()}`, color: "emerald" },
            { label: tDon("stats.totalDonors"), value: donors.toString(), color: "primary" },
            { label: tDon("stats.monthlyDonors"), value: monthlyDonors.toString(), color: "primary" },
            { label: tDon("stats.avgDonation"), value: `$${avg.toFixed(2)}`, color: "amber" }
        ];
    }, [filteredItems, tDon]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredItems.slice(start, start + itemsPerPage);
    }, [filteredItems, currentPage]);

    const filterContent = (
        <>
            <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                {tCommon("filters")}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="mx-2 bg-slate-100" />
            {["all", "oneTime", "monthly"].map((f) => (
                <DropdownMenuItem
                    key={f}
                    onClick={() => {
                        setFilter(f);
                        setCurrentPage(1);
                    }}
                    className={cn(
                        "rounded-xl px-3 py-2.5 cursor-pointer font-bold text-sm transition-colors",
                        filter === f ? "bg-primary/5 text-primary" : "text-slate-600 hover:bg-slate-50"
                    )}
                >
                    {tDon(`filters.${f === 'oneTime' ? 'one-time' : f}`)}
                </DropdownMenuItem>
            ))}
        </>
    );

    const sortContent = (
        <>
            <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                {tCommon("sort")}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="mx-2 bg-slate-100" />
            {["newest", "oldest", "amount"].map((s) => (
                <DropdownMenuItem
                    key={s}
                    onClick={() => setSort(s)}
                    className={cn(
                        "rounded-xl px-3 py-2.5 cursor-pointer font-bold text-sm transition-colors",
                        sort === s ? "bg-primary/5 text-primary" : "text-slate-600 hover:bg-slate-50"
                    )}
                >
                    {tDon(`sort.${s}`)}
                </DropdownMenuItem>
            ))}
        </>
    );

    const renderCard = (item: any) => (
        <div className="flex flex-col h-full bg-white group-hover:bg-slate-50/50 transition-colors">
            {/* Top Section: Amount & Status */}
            <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 transition-transform group-hover:scale-110 duration-500">
                    <DollarSign size={24} strokeWidth={3} />
                </div>
                <Badge variant="outline" className={cn(
                    "rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border-slate-100 bg-white shadow-sm",
                    item.frequency === 'monthly' ? "text-primary border-primary/20" : "text-slate-500"
                )}>
                    {tDon(`filters.${item.frequency === 'oneTime' ? 'one-time' : item.frequency}`)}
                </Badge>
            </div>

            {/* Donor Info */}
            <div className="space-y-1 mb-6">
                <h3 className="font-heading font-black text-xl text-slate-900 line-clamp-1 group-hover:text-primary transition-colors flex items-center gap-2">
                    <User size={16} className="text-slate-400" />
                    {item.donor}
                </h3>
                <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
                    <Mail size={14} className="text-slate-300" />
                    {item.email}
                </p>
            </div>

            {/* Amount Prominent */}
            <div className="mb-6 pb-6 border-b border-slate-50">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{tDon("columns.amount")}</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900">{item.amount.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US')}</span>
                    <span className="text-sm font-black text-emerald-600 uppercase">{item.currency}</span>
                </div>
            </div>

            {/* Bottom Meta */}
            <div className="grid grid-cols-2 gap-4 mt-auto">
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 flex items-center gap-1">
                        <Calendar size={10} /> {tDon("columns.date")}
                    </p>
                    <p className="text-xs font-bold text-slate-600">
                        {new Date(item.created_at).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </p>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 flex items-center gap-1">
                        <CreditCard size={10} /> {item.method ? tDon("columns.method") : "Method"}
                    </p>
                    <p className="text-xs font-bold text-slate-600 capitalize">
                        {item.method || "card"}
                    </p>
                </div>
            </div>

            {/* Reference */}
            <div className="mt-6 pt-4 border-t border-slate-50/50">
                <span className="text-[9px] font-mono font-bold text-slate-300 uppercase tracking-tighter">REF: #DON-{item.id}</span>
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="h-full flex items-center justify-center p-20">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[1.5rem] border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{stat.label}</p>
                        <p className={cn("text-3xl font-black font-heading", `text-${stat.color}-600`)}>{stat.value}</p>
                    </div>
                ))}
            </div>

            <AdminEntityList
                title={tSidebar("donations")}
                description={tDon("description")}
                items={paginatedItems}
                columns={columns}
                renderCard={renderCard}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                filterContent={filterContent}
                sortContent={sortContent}
                searchValue={searchQuery}
                onSearchChange={(val) => {
                    setSearchQuery(val);
                    setCurrentPage(1);
                }}
                currentPage={currentPage}
                totalCount={filteredItems.length}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            <DonationDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSubmit={handleFormSubmit}
                donation={selectedDonation}
                isSubmitting={isCreating || isUpdating}
            />
        </AdminLayout>
    );
}
