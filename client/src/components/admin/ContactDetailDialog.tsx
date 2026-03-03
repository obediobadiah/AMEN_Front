"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Inquiry } from "@/hooks/use-inquiries";
import { useTranslations } from "next-intl";
import { Loader2, Mail, User, Tag, Clock, MessageSquare, Trash2, CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    inquiry: Inquiry | null;
    onUpdateStatus: (id: number, status: string) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
    isUpdating: boolean;
    isDeleting: boolean;
}

export function ContactDetailDialog({
    open,
    onOpenChange,
    inquiry,
    onUpdateStatus,
    onDelete,
    isUpdating,
    isDeleting
}: ContactDetailDialogProps) {
    const t = useTranslations("admin.contacts.dialog");
    const tCont = useTranslations("admin.contacts");
    const tCommon = useTranslations("admin.common");

    if (!inquiry) return null;

    const handleUpdateStatus = async (status: string) => {
        await onUpdateStatus(inquiry.id, status);
    };

    const handleDelete = async () => {
        if (confirm(tCommon("deleteConfirm", { type: "message" }))) {
            await onDelete(inquiry.id);
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] max-h-[85vh] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden flex flex-col">
                <div className="bg-slate-50/80 backdrop-blur-md p-8 border-b border-slate-100 flex-shrink-0">
                    <DialogHeader>
                        <div className="flex items-center justify-between mb-2">
                            <span className={cn(
                                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                                inquiry.status === "Unread" ? "bg-rose-100 text-rose-600" : "bg-slate-200 text-slate-600"
                            )}>
                                {tCont(`statusLabels.${inquiry.status}`)}
                            </span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {tCont(`filters.${inquiry.type}`)}
                            </span>
                        </div>
                        <DialogTitle className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                            {inquiry.subject || "No Subject"}
                        </DialogTitle>
                    </DialogHeader>
                </div>

                <div className="p-8 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                <User size={12} /> {tCont("columns.sender")}
                            </span>
                            <p className="text-xl font-black text-slate-900">{inquiry.name}</p>
                            <p className="text-sm font-bold text-primary flex items-center gap-2">
                                <Mail size={14} /> {inquiry.email}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                <Clock size={12} /> {tCont("columns.received")}
                            </span>
                            <p className="text-xl font-bold text-slate-900">
                                {new Date(inquiry.created_at).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                            <MessageSquare size={12} /> {tCont("columns.message")}
                        </span>
                        <div className="bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100">
                            <p className="text-slate-700 text-base leading-relaxed font-medium whitespace-pre-wrap">
                                {inquiry.message}
                            </p>
                        </div>
                    </div>

                    {inquiry.data && Object.keys(inquiry.data).length > 0 && (
                        <div className="space-y-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                <Tag size={12} /> {t("additionalInfo")}
                            </span>
                            <div className="grid grid-cols-2 gap-4 pb-4">
                                {Object.entries(inquiry.data).map(([key, value]) => (
                                    <div key={key} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                                        <span className="text-[9px] font-black uppercase text-slate-400 block mb-1">{key.replace(/_/g, ' ')}</span>
                                        <span className="text-sm font-bold text-slate-900">{String(value)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="bg-slate-50 p-6 border-t border-slate-100 flex items-center justify-between sm:justify-between gap-4 flex-shrink-0">
                    <Button
                        variant="ghost"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="h-12 px-6 rounded-2xl text-rose-500 font-bold hover:bg-rose-50 hover:text-rose-600"
                    >
                        {isDeleting ? <Loader2 className="animate-spin" /> : <Trash2 size={20} />}
                        <span className="ml-2 font-black uppercase tracking-widest text-[10px]">{t("delete")}</span>
                    </Button>

                    <div className="flex gap-4">
                        {inquiry.status === "Unread" ? (
                            <Button
                                onClick={() => handleUpdateStatus("Read")}
                                disabled={isUpdating}
                                className="h-12 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-xl shadow-emerald-500/20 transition-all"
                            >
                                {isUpdating ? <Loader2 className="animate-spin" /> : <CheckCircle size={20} />}
                                <span className="ml-2 font-black uppercase tracking-widest text-[10px]">{t("markAsRead")}</span>
                            </Button>
                        ) : (
                            <Button
                                onClick={() => handleUpdateStatus("Unread")}
                                disabled={isUpdating}
                                className="h-12 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-xl shadow-slate-900/20 transition-all"
                            >
                                {isUpdating ? <Loader2 className="animate-spin" /> : <Circle size={20} />}
                                <span className="ml-2 font-black uppercase tracking-widest text-[10px]">{t("markAsUnread")}</span>
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
