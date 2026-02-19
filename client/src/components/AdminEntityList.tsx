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
    ChevronRight
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

interface EntityItem {
    id: string | number;
    title?: string;
    status?: string;
    date?: string;
    [key: string]: any;
}

interface AdminEntityListProps {
    title: string;
    description: string;
    items: EntityItem[];
    columns: { key: string; label: string; render?: (item: any) => React.ReactNode }[];
    onAdd?: () => void;
    onEdit?: (item: EntityItem) => void;
    onDelete?: (item: EntityItem) => void;
    onView?: (item: EntityItem) => void;
    searchPlaceholder?: string;
}

export function AdminEntityList({
    title,
    description,
    items,
    columns,
    onAdd,
    onEdit,
    onDelete,
    onView,
    searchPlaceholder
}: AdminEntityListProps) {
    const t = useTranslations("admin.common");

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
                    <p className="text-slate-500 mt-1 font-medium">{description}</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-xl border-slate-200 bg-white shadow-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                        <Download size={18} className="mr-2 text-slate-400" /> Export
                    </Button>
                    <Button onClick={onAdd} className="h-12 px-6 rounded-xl bg-primary shadow-lg shadow-primary/20 hover:shadow-primary/30 font-bold transition-all">
                        <Plus size={18} className="mr-2" /> Create New
                    </Button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full md:max-w-md group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder={searchPlaceholder || t("search")}
                        className="h-14 pl-12 bg-white border-slate-100 rounded-2xl shadow-sm focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all font-medium"
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button variant="outline" className="flex-1 md:flex-none h-14 px-6 rounded-2xl border-slate-100 bg-white text-slate-600 font-bold gap-3">
                        <Filter size={18} className="text-slate-400" /> Filters
                    </Button>
                    <Button variant="outline" className="flex-1 md:flex-none h-14 px-6 rounded-2xl border-slate-100 bg-white text-slate-600 font-bold gap-3">
                        <ArrowUpDown size={18} className="text-slate-400" /> Sort
                    </Button>
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden overflow-x-auto custom-scrollbar">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-slate-100">
                            {columns.map((col) => (
                                <TableHead key={col.key} className="h-16 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    {col.label}
                                </TableHead>
                            ))}
                            <TableHead className="text-right px-8 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
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
                                                <span className="text-sm font-bold text-slate-700">{item[col.key]}</span>
                                            )}
                                        </TableCell>
                                    ))}
                                    <TableCell className="text-right px-8 py-6">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-white hover:shadow-md transition-all">
                                                    <MoreHorizontal className="h-5 w-5 text-slate-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl border-slate-100 shadow-2xl">
                                                <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                    Manage Entry
                                                </DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => onView?.(item)} className="rounded-xl px-3 py-2.5 gap-3 cursor-pointer font-bold text-sm text-slate-600 focus:bg-primary/5 focus:text-primary transition-colors">
                                                    <Eye size={16} /> View Details
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
                                    </TableCell>
                                </motion.tr>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-3">
                                        <div className="p-4 bg-slate-50 rounded-full text-slate-300">
                                            <Search size={40} />
                                        </div>
                                        <p className="text-slate-400 font-bold">No records found matching your criteria</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                <div className="px-8 py-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                        Showing <span className="text-slate-900">1-10</span> of <span className="text-slate-900">{items.length}</span> entries
                    </p>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="h-10 w-10 p-0 rounded-xl border-slate-200 bg-white shadow-sm text-slate-400 hover:text-primary transition-all disabled:opacity-50">
                            <ChevronLeft size={18} />
                        </Button>
                        <div className="flex items-center gap-1">
                            <Button className="h-10 w-10 rounded-xl bg-primary shadow-lg shadow-primary/20 font-black text-xs">1</Button>
                            <Button variant="ghost" className="h-10 w-10 rounded-xl font-black text-xs text-slate-400 hover:text-primary">2</Button>
                            <Button variant="ghost" className="h-10 w-10 rounded-xl font-black text-xs text-slate-400 hover:text-primary">3</Button>
                        </div>
                        <Button variant="outline" className="h-10 w-10 p-0 rounded-xl border-slate-200 bg-white shadow-sm text-slate-400 hover:text-primary transition-all disabled:opacity-50">
                            <ChevronRight size={18} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
