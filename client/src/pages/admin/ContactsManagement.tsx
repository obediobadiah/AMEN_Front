"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { AdminEntityList } from "@/components/AdminEntityList";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

import { useInquiries, Inquiry } from "@/hooks/use-inquiries";
import { ContactDetailDialog } from "@/components/admin/ContactDetailDialog";
import { useToast } from "@/hooks/use-toast";

export default function ContactsManagement() {
    const tSidebar = useTranslations("admin.sidebar");
    const tCont = useTranslations("admin.contacts");
    const tCommon = useTranslations("admin.common");
    const { toast } = useToast();

    const {
        inquiries,
        isLoading,
        updateInquiry,
        deleteInquiry,
        isUpdating,
        isDeleting
    } = useInquiries();

    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [sort, setSort] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const itemsPerPage = 10;

    const columns = [
        { key: "id", label: tCont("columns.id") },
        {
            key: "sender",
            label: tCont("columns.sender"),
            render: (item: Inquiry) => (
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-black text-slate-900">{item.name}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.email}</span>
                </div>
            )
        },
        {
            key: "subject",
            label: tCont("columns.subject"),
            render: (item: Inquiry) => (
                <span className="text-sm font-medium text-slate-600 truncate max-w-[200px] block">{item.subject}</span>
            )
        },
        {
            key: "date",
            label: tCont("columns.received"),
            render: (item: Inquiry) => (
                <span className="text-sm font-bold text-slate-500">
                    {new Date(item.created_at).toLocaleDateString()}
                </span>
            )
        },
        {
            key: "status",
            label: tCommon("status"),
            render: (item: Inquiry) => (
                <Badge className={cn(
                    "rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest border",
                    item.status === "Unread" ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-slate-50 text-slate-400 border-slate-100"
                )}>
                    {tCont(`statusLabels.${item.status}`)}
                </Badge>
            )
        },
    ];

    const filteredItems = useMemo(() => {
        let result = (inquiries || []).filter(item => {
            const matchesSearch =
                item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.message?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesFilter = filter === "all" || item.type === filter;

            return matchesSearch && matchesFilter;
        });

        result.sort((a, b) => {
            if (sort === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            if (sort === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            if (sort === "name") return (a.name || "").localeCompare(b.name || "");
            return 0;
        });

        return result;
    }, [inquiries, searchQuery, filter, sort]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredItems.slice(start, start + itemsPerPage);
    }, [filteredItems, currentPage]);

    const handleRowClick = (item: Inquiry) => {
        setSelectedInquiry(item);
        setIsDialogOpen(true);
    };

    const handleUpdateStatus = async (id: number, status: string) => {
        try {
            await updateInquiry({ id, data: { status } });
            toast({
                title: tCommon("success"),
                description: tCommon("saveSuccess", { type: tCommon("status") }),
            });
            // Update selected inquiry in place if it's the one open in dialog
            if (selectedInquiry && selectedInquiry.id === id) {
                setSelectedInquiry({ ...selectedInquiry, status });
            }
        } catch (error) {
            toast({
                title: tCommon("error"),
                description: tCommon("saveError", { type: tCommon("status") }),
                variant: "destructive",
            });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteInquiry(id);
            toast({
                title: tCommon("success"),
                description: tCommon("deleteSuccess", { type: "Message" }),
            });
        } catch (error) {
            toast({
                title: tCommon("error"),
                description: tCommon("deleteError", { type: "Message" }),
                variant: "destructive",
            });
        }
    };

    const handleExport = () => {
        const headers = [
            tCont("columns.id"),
            tCont("columns.sender") + " (Name)",
            tCont("columns.sender") + " (Email)",
            tCont("columns.subject"),
            tCont("columns.received"),
            tCommon("status"),
            tCont("columns.type")
        ];

        const rows = filteredItems.map(item => [
            item.id,
            item.name || "",
            item.email,
            item.subject || "",
            new Date(item.created_at).toLocaleDateString(),
            item.status,
            item.type
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `amen_contacts_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
            title: tCommon("success"),
            description: tCommon("exportSuccess"),
        });
    };

    const filterContent = (
        <>
            <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                {tCommon("filters")}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="mx-2 bg-slate-100" />
            {["all", "contact", "volunteer", "partner", "newsletter"].map((f) => (
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
                    {tCont(`filters.${f}`)}
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
            {["newest", "oldest", "name"].map((s) => (
                <DropdownMenuItem
                    key={s}
                    onClick={() => setSort(s)}
                    className={cn(
                        "rounded-xl px-3 py-2.5 cursor-pointer font-bold text-sm transition-colors",
                        sort === s ? "bg-primary/5 text-primary" : "text-slate-600 hover:bg-slate-50"
                    )}
                >
                    {tCont(`sort.${s}`)}
                </DropdownMenuItem>
            ))}
        </>
    );

    const renderCard = (item: Inquiry) => {
        return (
            <div className="flex flex-col gap-4 cursor-pointer" onClick={() => handleRowClick(item)}>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">#{item.id}</span>
                        <h3 className="text-lg font-black text-slate-900 leading-tight">{item.name}</h3>
                        <span className="text-[11px] font-bold text-primary italic opacity-80">{item.email}</span>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <Badge className={cn(
                            "rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border",
                            item.status === "Unread" ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-slate-50 text-slate-400 border-slate-100"
                        )}>
                            {tCont(`statusLabels.${item.status}`)}
                        </Badge>
                        <Badge variant="outline" className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50/50">
                            {tCont(`filters.${item.type}`)}
                        </Badge>
                    </div>
                </div>

                <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">{tCont("columns.subject")}</span>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed truncate">
                        {item.subject}
                    </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{tCont("columns.received")}</span>
                        <span className="text-xs font-bold text-slate-600">{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AdminLayout>
            <AdminEntityList
                title={tSidebar("contacts")}
                description={tCont("description")}
                items={paginatedItems}
                columns={columns}
                renderCard={renderCard}
                hideAdd
                onExport={handleExport}
                isLoading={isLoading}
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
                onRowClick={handleRowClick}
            />

            <ContactDetailDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                inquiry={selectedInquiry}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDelete}
                isUpdating={isUpdating}
                isDeleting={isDeleting}
            />
        </AdminLayout>
    );
}
