"use client";

import { useTranslations } from "next-intl";
import {
    Plus,
    Search,
    MoreHorizontal,
    Pencil,
    Trash2,
    Eye,
    ArrowUpDown,
    Filter,
    Download,
    ChevronLeft,
    ChevronRight,
    LayoutGrid,
    List
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";
import { useState, useMemo } from "react";

interface EntityItem {
    id: string | number;
    title?: any;
    status?: any;
    date?: any;
    [key: string]: any;
}

interface AdminEntityListProps<T extends EntityItem> {
    title: string;
    description: string;
    items: T[];
    columns: { key: string; label: string; render?: (item: T) => React.ReactNode }[];
    onAdd?: () => void;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    onView?: (item: T) => void;
    onExport?: () => void;
    renderCard?: (item: T) => React.ReactNode;
    defaultView?: "table" | "grid";
    searchPlaceholder?: string;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
}

export function AdminEntityList<T extends EntityItem>({
    title,
    description,
    items,
    columns,
    onAdd,
    onEdit,
    onDelete,
    onView,
    onExport,
    renderCard,
    defaultView = "table",
    searchPlaceholder,
    searchValue,
    onSearchChange,
    currentPage = 1,
    totalPages = 1,
    onPageChange
}: AdminEntityListProps<T>) {
    const t = useTranslations("admin.common");
    const locale = useLocale();
    const [viewMode, setViewMode] = useState<"table" | "grid">(defaultView);

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
                    <p className="text-slate-500 mt-1 font-medium">{description}</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={onExport}
                        className="h-12 px-6 rounded-xl border-slate-200 bg-white shadow-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
                    >
                        <Download size={18} className="mr-2 text-slate-400" /> {t("export")}
                    </Button>
                    <Button onClick={onAdd} className="h-12 px-6 rounded-xl bg-primary shadow-lg shadow-primary/20 hover:shadow-primary/30 font-bold transition-all">
                        <Plus size={18} className="mr-2" /> {t("createNew")}
                    </Button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full md:max-w-md group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder={searchPlaceholder || t("search")}
                        value={searchValue}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        className="h-14 pl-12 bg-white border-slate-100 rounded-2xl shadow-sm focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all font-medium"
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button variant="outline" className="flex-1 md:flex-none h-14 px-6 rounded-2xl border-slate-100 bg-white text-slate-600 font-bold gap-3">
                        <Filter size={18} className="text-slate-400" /> {t("filters")}
                    </Button>
                    <Button variant="outline" className="flex-1 md:flex-none h-14 px-6 rounded-2xl border-slate-100 bg-white text-slate-600 font-bold gap-3">
                        <ArrowUpDown size={18} className="text-slate-400" /> {t("sort")}
                    </Button>
                    <div className="flex items-center bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewMode("table")}
                            className={cn(
                                "h-11 px-4 rounded-xl font-bold transition-all",
                                viewMode === "table" ? "bg-white shadow-sm text-primary" : "text-slate-400"
                            )}
                        >
                            <List size={18} className="mr-2" /> {t("list")}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewMode("grid")}
                            className={cn(
                                "h-11 px-4 rounded-xl font-bold transition-all",
                                viewMode === "grid" ? "bg-white shadow-sm text-primary" : "text-slate-400"
                            )}
                        >
                            <LayoutGrid size={18} className="mr-2" /> {t("grid")}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table Area */}
            {viewMode === "table" ? (
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden overflow-x-auto custom-scrollbar">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent border-slate-100">
                                {columns.map((col) => (
                                    <TableHead key={col.key} className="h-16 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        {col.label}
                                    </TableHead>
                                ))}
                                <TableHead className="text-right px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    {t("actions")}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.length > 0 ? (
                                items.map((item, idx) => (
                                    <motion.tr
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="group hover:bg-slate-50/50 transition-colors border-slate-50"
                                    >
                                        {columns.map((col) => (
                                            <TableCell key={col.key} className="px-8 py-6">
                                                {col.render ? (
                                                    col.render(item)
                                                ) : (
                                                    <span className="text-sm font-bold text-slate-700">
                                                        {typeof item[col.key] === "object" && item[col.key] !== null
                                                            ? (item[col.key][locale] || item[col.key].fr || item[col.key].en || "")
                                                            : item[col.key]}
                                                    </span>
                                                )}
                                            </TableCell>
                                        ))}
                                        <TableCell className="text-right px-8 py-6">
                                            <ActionMenu item={item} onEdit={onEdit} onDelete={onDelete} onView={onView} t={t} />
                                        </TableCell>
                                    </motion.tr>
                                ))
                            ) : (
                                <EmptyState colSpan={columns.length + 1} t={t} />
                            )}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.length > 0 ? (
                        items.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group relative bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-primary/10 transition-all p-6"
                            >
                                <div className="absolute top-6 right-6 z-10">
                                    <ActionMenu item={item} onEdit={onEdit} onDelete={onDelete} onView={onView} t={t} />
                                </div>
                                <div
                                    className="cursor-pointer"
                                    onClick={() => onView?.(item)}
                                >
                                    {renderCard ? renderCard(item) : (
                                        <div className="space-y-4 pt-4">
                                            <h3 className="font-black text-slate-900 text-lg line-clamp-2">
                                                {typeof item.title === "object" && item.title !== null
                                                    ? (item.title[locale] || item.title.fr || item.title.en || "")
                                                    : item.title}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-slate-100 text-slate-500 rounded-lg">{item.status || "Draft"}</Badge>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-20">
                            <EmptyState t={t} />
                        </div>
                    )}
                </div>
            )}
            {/* Pagination */}
            <div className="px-8 py-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                    {t("showing")} <span className="text-slate-900">{items.length > 0 ? (currentPage - 1) * 10 + 1 : 0}-{Math.min(currentPage * 10, items.length)}</span> {t("of")} <span className="text-slate-900">{items.length}</span> {t("entries")}
                </p>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        disabled={currentPage === 1}
                        onClick={() => onPageChange?.(currentPage - 1)}
                        className="h-10 w-10 p-0 rounded-xl border-slate-200 bg-white shadow-sm text-slate-400 hover:text-primary transition-all disabled:opacity-50"
                    >
                        <ChevronLeft size={18} />
                    </Button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                onClick={() => onPageChange?.(page)}
                                variant={currentPage === page ? "default" : "ghost"}
                                className={cn(
                                    "h-10 w-10 rounded-xl font-black text-xs",
                                    currentPage === page ? "bg-primary shadow-lg shadow-primary/20" : "text-slate-400 hover:text-primary"
                                )}
                            >
                                {page}
                            </Button>
                        ))}
                    </div>
                    <Button
                        variant="outline"
                        disabled={currentPage === totalPages}
                        onClick={() => onPageChange?.(currentPage + 1)}
                        className="h-10 w-10 p-0 rounded-xl border-slate-200 bg-white shadow-sm text-slate-400 hover:text-primary transition-all disabled:opacity-50"
                    >
                        <ChevronRight size={18} />
                    </Button>
                </div>
            </div>
        </div>
    );
}

function ActionMenu({ item, onEdit, onDelete, onView, t }: any) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-white hover:shadow-md transition-all">
                    <MoreHorizontal className="h-5 w-5 text-slate-400" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl border-slate-100 shadow-2xl">
                <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {t("manageEntry")}
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onView?.(item)} className="rounded-xl px-3 py-2.5 gap-3 cursor-pointer font-bold text-sm text-slate-600 focus:bg-primary/5 focus:text-primary transition-colors">
                    <Eye size={16} /> {t("viewDetails")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(item)} className="rounded-xl px-3 py-2.5 gap-3 cursor-pointer font-bold text-sm text-slate-600 focus:bg-primary/5 focus:text-primary transition-colors">
                    <Pencil size={16} /> {t("edit")}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-50 my-1" />
                <DropdownMenuItem onClick={() => onDelete?.(item)} className="rounded-xl px-3 py-2.5 gap-3 cursor-pointer font-bold text-sm text-rose-600 focus:bg-rose-50 focus:text-rose-700 transition-colors">
                    <Trash2 size={16} /> {t("delete")}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function EmptyState({ colSpan, t }: { colSpan?: number, t: any }) {
    const content = (
        <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-4 bg-slate-50 rounded-full text-slate-300">
                <Search size={40} />
            </div>
            <p className="text-slate-400 font-bold">{t("noRecords")}</p>
        </div>
    );

    if (colSpan) {
        return (
            <TableRow>
                <TableCell colSpan={colSpan} className="h-64 text-center">
                    {content}
                </TableCell>
            </TableRow>
        );
    }

    return content;
}
