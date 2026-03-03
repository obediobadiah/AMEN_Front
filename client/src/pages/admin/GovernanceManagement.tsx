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

    const [groupType, setGroupType] = useState("governance");
    const { members, isLoading, createMember, updateMember, deleteMember, isCreating } = useGovernance(groupType);

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
            label: tGov("columns.organ"),
            render: (item: GovernanceMember) => {
                let display = item.organ_id || "-";
                if (item.group_type === "hr") {
                    if (item.organ_id === "dirigeante") display = tGov(`filters.dirigeante`);
                    else if (item.organ_id === "technique") display = tGov(`filters.technique`);
                    else if (item.organ_id === "volontaires") display = tGov(`filters.volontaires`);
                } else if (item.organ_id && ["ag", "cd", "pe", "dg"].includes(item.organ_id)) {
                    display = tGov(`filters.${item.organ_id}`);
                }

                return (
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">
                        {display}
                    </span>
                );
            }
        },
        {
            key: "order",
            label: tGov("columns.order"),
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
            <DropdownMenuItem
                onClick={() => {
                    setFilter("all");
                    setCurrentPage(1);
                }}
                className={cn(
                    "rounded-xl px-3 py-2.5 cursor-pointer font-bold text-sm transition-colors",
                    filter === "all" ? "bg-primary/5 text-primary" : "text-slate-600 hover:bg-slate-50"
                )}
            >
                {tGov(`filters.all`)}
            </DropdownMenuItem>

            {groupType === "governance" ? (
                ["ag", "cd", "pe", "dg"].map((f) => (
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
                ))
            ) : (
                ["dirigeante", "technique", "volontaires"].map((f) => (
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
                ))
            )}
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

    const renderCard = (item: GovernanceMember) => {
        let displayOrgan = item.organ_id || "-";
        if (item.group_type === "hr") {
            if (item.organ_id === "dirigeante") displayOrgan = tGov(`filters.dirigeante`);
            else if (item.organ_id === "technique") displayOrgan = tGov(`filters.technique`);
            else if (item.organ_id === "volontaires") displayOrgan = tGov(`filters.volontaires`);
        } else if (item.organ_id && ["ag", "cd", "pe", "dg"].includes(item.organ_id)) {
            displayOrgan = tGov(`filters.${item.organ_id}`);
        }

        return (
            <div className="flex flex-col items-center text-center space-y-5 pt-4">
                <div className="relative group/avatar">
                    <Avatar className="h-28 w-28 border-8 border-slate-50 shadow-2xl group-hover:scale-105 transition-transform duration-700">
                        <AvatarImage src={getImageUrl(item.photo_url)} className="object-cover" />
                        <AvatarFallback className="bg-primary/5 text-primary text-3xl font-black uppercase">
                            {item.name.substring(0, 1)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-white shadow-xl rounded-xl px-3 py-1 border border-slate-100 scale-90 group-hover:scale-100 transition-transform duration-500">
                        <span className="text-[10px] font-black text-slate-400">#{item.order || 0}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="font-black text-slate-900 text-xl tracking-tight leading-tight group-hover:text-primary transition-colors decoration-primary/30 decoration-2 underline-offset-4">
                        {item.name}
                    </h3>
                    <div className="flex flex-col items-center gap-1">
                        <p className="text-[11px] font-bold text-primary/70 uppercase tracking-[0.15em] px-2 bg-primary/5 rounded-md py-0.5">
                            {(item.role as any)[locale] || item.role.fr || item.role.en || "-"}
                        </p>
                    </div>
                </div>

                <div className="w-full pt-4 border-t border-slate-50">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        {displayOrgan}
                    </span>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                        <p className="font-bold text-slate-400 animate-pulse tracking-widest uppercase text-xs">{tGov("loading")}</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="flex gap-4 mb-8 bg-slate-100 p-2 rounded-2xl w-full">
                <button
                    onClick={() => { setGroupType("governance"); setFilter("all"); setCurrentPage(1); }}
                    className={cn(
                        "px-6 py-3 rounded-xl font-bold text-sm transition-all w-full",
                        groupType === "governance" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    {tGov("groups.governance")}
                </button>
                <button
                    onClick={() => { setGroupType("hr"); setFilter("all"); setCurrentPage(1); }}
                    className={cn(
                        "px-6 py-3 rounded-xl font-bold text-sm transition-all w-full",
                        groupType === "hr" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    {tGov("groups.hr")}
                </button>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <AdminEntityList
                    title={groupType === "governance" ? tGov("titles.governance") : tGov("titles.hr")}
                    description={groupType === "governance" ? tGov("description") : tGov("hrDesc")}
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
                    searchPlaceholder={tGov("searchPlaceholder")}
                    renderCard={renderCard}
                    defaultView="grid"
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
