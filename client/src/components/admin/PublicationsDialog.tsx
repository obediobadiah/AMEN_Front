"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Publication, PublicationCreate, usePublications } from "@/hooks/use-publications";
import { useEffect, useState, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Loader2, FileDown, Upload, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getImageUrl } from "@/lib/api-config";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const publicationSchema = zod.object({
    title: zod.string().min(3, "Title must be at least 3 characters"),
    description: zod.string().optional(),
    category: zod.enum(["annual", "technical", "research"]),
    date: zod.string().optional(),
    file_url: zod.string().min(1, "File is required"),
    thumbnail_url: zod.string().optional().or(zod.literal("")),
    file_size: zod.string().optional(),
    file_type: zod.string().optional(),
    source_lang: zod.string(),
});

interface PublicationsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any) => Promise<void>;
    publication?: Publication | null;
    isSubmitting: boolean;
}

export function PublicationsDialog({ open, onOpenChange, onSubmit, publication, isSubmitting }: PublicationsDialogProps) {
    const t = useTranslations("admin.publications");
    const commonT = useTranslations("admin.common");
    const locale = useLocale();

    const { uploadFile, isUploading } = usePublications();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    const form = useForm({
        resolver: zodResolver(publicationSchema),
        defaultValues: {
            title: "",
            description: "",
            category: "annual" as const,
            date: "",
            file_url: "",
            thumbnail_url: "",
            file_size: "",
            file_type: "",
            source_lang: locale,
        },
    });



    useEffect(() => {
        if (publication) {
            form.reset({
                title: (publication.title as any)[locale] || publication.title.fr || publication.title.en || "",
                description: publication.description ? ((publication.description as any)[locale] || publication.description.fr || publication.description.en || "") : "",
                category: (publication.category as any) || "annual",
                date: publication.date ? new Date(publication.date).toISOString().slice(0, 16) : "",
                file_url: publication.file_url || "",
                thumbnail_url: publication.thumbnail_url || "",
                file_size: publication.file_size || "",
                file_type: publication.file_type || "",
                source_lang: locale,
            });
            setPreviewUrl(getImageUrl(publication.thumbnail_url) || "");
        } else {
            form.reset({
                title: "",
                description: "",
                category: "annual",
                date: "",
                file_url: "",
                thumbnail_url: "",
                file_size: "",
                file_type: "",
                source_lang: locale,
            });
            setPreviewUrl("");
        }
    }, [publication, form, locale, open]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const result = await uploadFile(file);

            form.setValue("file_url", result.file_url);
            if (result.thumbnail_url) {
                form.setValue("thumbnail_url", result.thumbnail_url);
                setPreviewUrl(getImageUrl(result.thumbnail_url));
            }
            if (result.file_size) form.setValue("file_size", result.file_size);
            if (result.file_type) form.setValue("file_type", result.file_type);

            toast.success("Fichier téléchargé avec succès");
        } catch (error) {
            toast.error("Échec du téléchargement du fichier");
            console.error(error);
        }
    };

    const handleFormSubmit = async (data: any) => {
        const payload = { ...data };
        if (payload.date) payload.date = new Date(payload.date).toISOString();
        else payload.date = null;

        await onSubmit(payload);
        form.reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto rounded-[2.5rem] border-none shadow-2xl p-0 selection:bg-primary selection:text-white">
                <div className="bg-slate-50/80 backdrop-blur-md p-10 border-b border-slate-100 sticky top-0 z-10">
                    <DialogHeader>
                        <DialogTitle className="text-4xl font-black text-slate-900 tracking-tight">
                            {publication ? t("dialog.editTitle") : t("dialog.createTitle")}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium text-lg mt-3 max-w-xl">
                            {publication ? t("dialog.editDesc") : t("dialog.createDesc")}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem className="space-y-4">
                                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("dialog.categoryLabel")}</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-16 rounded-2xl bg-white border-slate-100 shadow-sm font-bold text-slate-700 px-6 focus:ring-primary/20 transition-all">
                                                        <SelectValue placeholder={t("dialog.categoryLabel")} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-2xl border-slate-100 p-2 shadow-2xl">
                                                    <SelectItem value="annual" className="rounded-xl font-bold py-3 text-emerald-600">{t("dialog.annual")}</SelectItem>
                                                    <SelectItem value="technical" className="rounded-xl font-bold py-3 text-blue-600">{t("dialog.technical")}</SelectItem>
                                                    <SelectItem value="research" className="rounded-xl font-bold py-3 text-purple-600">{t("dialog.research")}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-xs font-bold text-rose-500 pl-1" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem className="space-y-4">
                                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("dialog.dateLabel")}</FormLabel>
                                            <FormControl>
                                                <Input type="datetime-local" className="h-16 rounded-2xl bg-white border-slate-100 shadow-sm font-bold px-6 focus-visible:ring-primary/20 transition-all" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-xs font-bold text-rose-500 pl-1" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem className="space-y-4">
                                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("dialog.titleLabel")}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t("dialog.titlePlaceholder")} className="h-16 rounded-2xl bg-white border-slate-100 shadow-sm font-bold px-8 text-lg focus-visible:ring-primary/20 transition-all placeholder:text-slate-300 placeholder:font-medium" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-xs font-bold text-rose-500 pl-1" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="space-y-4">
                                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("dialog.descLabel")}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={t("dialog.descPlaceholder")}
                                                className="min-h-[120px] rounded-[2rem] bg-white border-slate-100 shadow-sm font-medium p-8 resize-none text-slate-600 leading-relaxed focus-visible:ring-primary/20 transition-all placeholder:text-slate-300"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs font-bold text-rose-500 pl-1" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="file_url"
                                render={({ field }) => (
                                    <FormItem className="space-y-4">
                                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("dialog.fileLabel")}</FormLabel>
                                        <FormControl>
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className={cn(
                                                    "relative aspect-[21/9] rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-white hover:border-primary/50 group overflow-hidden shadow-sm hover:shadow-xl",
                                                    (previewUrl || field.value) && "border-none shadow-2xl"
                                                )}
                                            >
                                                {isUploading ? (
                                                    <div className="flex flex-col items-center gap-4">
                                                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                                        <span className="text-xs font-black uppercase tracking-widest text-primary animate-pulse italic">{t("dialog.uploading")}</span>
                                                    </div>
                                                ) : previewUrl ? (
                                                    <>
                                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                                            <div className="bg-white/90 backdrop-blur-md p-4 rounded-full shadow-2xl transform scale-75 group-hover:scale-100 transition-all duration-500">
                                                                <Upload className="w-6 h-6 text-primary" />
                                                            </div>
                                                        </div>
                                                        <div className="absolute top-6 left-6 px-6 py-3 bg-slate-900/90 text-white rounded-2xl shadow-2xl backdrop-blur-md z-20 flex gap-3 text-[10px] font-black uppercase tracking-[0.2em]">
                                                            <span className="text-primary">{form.watch("file_type")}</span>
                                                            <span className="opacity-30">•</span>
                                                            <span>{form.watch("file_size")}</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setPreviewUrl("");
                                                                field.onChange("");
                                                                form.setValue("thumbnail_url", "");
                                                            }}
                                                            className="absolute top-6 right-6 p-2.5 bg-rose-500 text-white rounded-full shadow-2xl hover:bg-rose-600 transition-all z-20 scale-90 group-hover:scale-100"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </>
                                                ) : field.value ? (
                                                    <div className="flex flex-col items-center gap-6 text-emerald-600 group-hover:scale-105 transition-all duration-500">
                                                        <div className="p-8 bg-emerald-50 rounded-[2.5rem] shadow-xl shadow-emerald-100/50 transition-all duration-500 group-hover:bg-emerald-100 group-hover:shadow-2xl border border-emerald-100">
                                                            <FileDown size={40} className="text-emerald-600" />
                                                        </div>
                                                        <div className="flex flex-col items-center gap-2">
                                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">{t("dialog.fileAttached")}</span>
                                                            <span className="text-xs font-bold text-emerald-600/60 ">{form.watch("file_size")} • {form.watch("file_type")}</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                field.onChange("");
                                                            }}
                                                            className="absolute top-6 right-6 p-2.5 bg-emerald-500 text-white rounded-full shadow-2xl hover:bg-emerald-600 transition-all z-20 scale-90 group-hover:scale-100"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-6 text-slate-400 group-hover:text-primary transition-all duration-500">
                                                        <div className="p-8 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl">
                                                            <FileDown size={40} className="text-primary" />
                                                        </div>
                                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">{t("dialog.selectFile")}</span>
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    className="hidden"
                                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                                                    onChange={handleFileChange}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs font-bold text-rose-500 pl-1" />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter className="pt-10 border-t border-slate-50 mt-10">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => onOpenChange(false)}
                                    className="h-16 px-10 rounded-2xl text-slate-500 font-bold hover:bg-slate-100 transition-all"
                                >
                                    {commonT("cancel")}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || isUploading}
                                    className="h-16 px-14 rounded-2xl bg-primary shadow-2xl shadow-primary/30 hover:shadow-primary/50 font-black text-lg transition-all min-w-[200px]"
                                >
                                    {isSubmitting || isUploading ? (
                                        <div className="flex items-center gap-3">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span className="animate-pulse italic">Synchronizing...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            {publication ? t("dialog.update") : t("dialog.save")}
                                        </div>
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
