"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { AdminEntityList } from "@/components/AdminEntityList";
import { useTranslations, useLocale } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useGovernance, GovernanceMember, GovernanceCreate } from "@/hooks/use-governance";
import { GovernanceDialog } from "@/components/admin/GovernanceDialog";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/api-config";
import {
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

export default function GovernanceManagement() {
    const tSidebar = useTranslations("admin.sidebar");
    const tGov = useTranslations("admin.governance");
    const tCommon = useTranslations("admin.common");
    const locale = useLocale();

    const { members, isLoading, createMember, updateMember, deleteMember, isCreating } = useGovernance();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<GovernanceMember | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [sort, setSort] = useState("name");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const columns = [
        {
            key: "name",
            label: tGov("columns.name"),
            render: (item: GovernanceMember) => (
                <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-slate-100 shadow-sm transition-transform group-hover:scale-105">
                        <AvatarImage src={getImageUrl(item.photo_url)} />
                        <AvatarFallback className="bg-primary/5 text-primary font-black uppercase text-xs">
                            {item.name.substring(0, 2)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">{item.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] leading-none italic">
                            {(item.role as any)[locale] || item.role.fr || item.role.en || "-"}
                        </span>
                    </div>
                </div>
            )
        },
        {
            key: "organ_id",
            label: "Organ",
            render: (item: GovernanceMember) => (
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">
                    {item.organ_id || "-"}
                </span>
            )
        },
        {
            key: "order",
            label: "Order",
            render: (item: GovernanceMember) => (
                <span className="text-sm font-bold text-slate-400">#{item.order || 0}</span>
            )
        },
    ];

    const filteredItems = useMemo(() => {
        let result = members.filter(item => {
            const name = item.name.toLowerCase();
            const roleFr = item.role?.fr?.toLowerCase() || "";
            const roleEn = item.role?.en?.toLowerCase() || "";
            const search = searchQuery.toLowerCase();
            const matchesSearch = name.includes(search) || roleFr.includes(search) || roleEn.includes(search);

            const matchesFilter = filter === "all" || item.organ_id === filter;

            return matchesSearch && matchesFilter;
        });

        result.sort((a, b) => {
            if (sort === "order") return (a.order || 0) - (b.order || 0);
            if (sort === "name") return a.name.localeCompare(b.name);
            return 0;
        });

        return result;
    }, [members, searchQuery, filter, sort, locale]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredItems.slice(start, start + itemsPerPage);
    }, [filteredItems, currentPage]);

    const handleAdd = () => {
        setSelectedMember(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (item: GovernanceMember) => {
        setSelectedMember(item);
        setIsDialogOpen(true);
    };

    const handleDelete = async (item: GovernanceMember) => {
        if (confirm(tGov("messages.deleteConfirm"))) {
            try {
                await deleteMember(item.id);
                toast.success(tGov("messages.deleteSuccess"));
            } catch (err) {
                toast.error(tGov("messages.error"));
            }
        }
    };

    const onSubmit = async (data: any) => {
        try {
            if (selectedMember) {
                await updateMember({ id: selectedMember.id, data });
                toast.success(tGov("messages.updateSuccess"));
            } else {
                await createMember(data as GovernanceCreate);
                toast.success(tGov("messages.saveSuccess"));
            }
            setIsDialogOpen(false);
        } catch (err) {
            toast.error(tGov("messages.error"));
            console.error(err);
        }
    };

    const filterContent = (
        <>
            <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                {tCommon("filters")}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="mx-2 bg-slate-100" />
            {["all", "ag", "cd", "pe", "dg"].map((f) => (
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
                    {tGov(`filters.${f}`)}
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
            {["order", "name"].map((s) => (
                <DropdownMenuItem
                    key={s}
                    onClick={() => setSort(s)}
                    className={cn(
                        "rounded-xl px-3 py-2.5 cursor-pointer font-bold text-sm transition-colors",
                        sort === s ? "bg-primary/5 text-primary" : "text-slate-600 hover:bg-slate-50"
                    )}
                >
                    {tGov(`sort.${s}`)}
                </DropdownMenuItem>
            ))}
        </>
    );

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                        <p className="font-bold text-slate-400 animate-pulse tracking-widest uppercase text-xs">{tGov("loading") || "Synchronizing Human Resources..."}</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <AdminEntityList
                    title={tSidebar("governance")}
                    description={tGov("description")}
                    items={paginatedItems}
                    columns={columns}
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
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    searchPlaceholder="Search by name or role..."
                />
            </div>
            <GovernanceDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSubmit={onSubmit}
                member={selectedMember}
                isSubmitting={isCreating}
            />
        </AdminLayout>
    );
}
