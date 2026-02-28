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
import { ResourceItem, ResourceCreate, useResources } from "@/hooks/use-resources";
import { useEffect, useState, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Loader2, FileText, Upload, X, File } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getImageUrl } from "@/lib/api-config";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const resourceSchema = zod.object({
    title: zod.string().min(3, "Title must be at least 3 characters"),
    description: zod.string().optional(),
    category: zod.string().min(1, "Category is required"),
    file_url: zod.string().min(1, "File URL is required"),
    file_type: zod.string().optional(),
    file_size: zod.string().optional(),
    source_lang: zod.string(),
});

interface ResourcesDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any) => Promise<void>;
    resource?: ResourceItem | null;
    isSubmitting: boolean;
}

export function ResourcesDialog({ open, onOpenChange, onSubmit, resource, isSubmitting }: ResourcesDialogProps) {
    const t = useTranslations("admin.resources.dialog");
    const commonT = useTranslations("admin.common");
    const locale = useLocale();

    const { uploadFile, isUploading } = useResources();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string>("");

    const form = useForm({
        resolver: zodResolver(resourceSchema),
        defaultValues: {
            title: "",
            description: "",
            category: "Report",
            file_url: "",
            file_type: "",
            file_size: "",
            source_lang: locale,
        },
    });

    useEffect(() => {
        if (resource) {
            form.reset({
                title: (resource.title as any)[locale] || resource.title.fr || resource.title.en || "",
                description: resource.description ? ((resource.description as any)[locale] || resource.description.fr || resource.description.en || "") : "",
                category: resource.category || "Report",
                file_url: resource.file_url || "",
                file_type: resource.file_type || "",
                file_size: resource.file_size || "",
                source_lang: locale,
            });
            setFileName(resource.file_url ? resource.file_url.split('/').pop() || "Attached File" : "");
        } else {
            form.reset({
                title: "",
                description: "",
                category: "Report",
                file_url: "",
                file_type: "",
                file_size: "",
                source_lang: locale,
            });
            setFileName("");
        }
    }, [resource, form, locale, open]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const result = await uploadFile(file);
            form.setValue("file_url", result.url);
            form.setValue("file_type", file.type || file.name.split('.').pop() || "");
            form.setValue("file_size", `${(file.size / (1024 * 1024)).toFixed(2)} MB`);
            setFileName(file.name);
            toast.success("Fichier téléchargé avec succès");
        } catch (error) {
            toast.error("Échec du téléchargement du fichier");
            console.error(error);
        }
    };

    const handleFormSubmit = async (data: any) => {
        await onSubmit(data);
        form.reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-[2.5rem] border-none shadow-2xl p-0 selection:bg-primary selection:text-white">
                <div className="bg-slate-50/80 backdrop-blur-md p-10 border-b border-slate-100 sticky top-0 z-10">
                    <DialogHeader>
                        <DialogTitle className="text-4xl font-black text-slate-900 tracking-tight">
                            {resource ? t("editTitle") : t("createTitle")}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium text-lg mt-3 max-w-xl">
                            {resource ? t("editDesc") : t("createDesc")}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem className="space-y-4">
                                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("categoryLabel")}</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-14 rounded-2xl bg-white border-slate-100 shadow-sm font-bold text-slate-700 focus:ring-primary/20 transition-all">
                                                    <SelectValue placeholder="Category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-2xl border-slate-100 p-2 shadow-2xl">
                                                <SelectItem value="Report" className="rounded-xl font-bold py-3 text-slate-900">Report</SelectItem>
                                                <SelectItem value="Guide" className="rounded-xl font-bold py-3 text-slate-900">Guide</SelectItem>
                                                <SelectItem value="Infographic" className="rounded-xl font-bold py-3 text-slate-900">Infographic</SelectItem>
                                                <SelectItem value="Policy" className="rounded-xl font-bold py-3 text-slate-900">Policy</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-xs font-bold text-rose-500 pl-1" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem className="space-y-4">
                                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("titleLabel")}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t("titlePlaceholder")} className="h-16 rounded-2xl bg-white border-slate-100 shadow-sm font-bold px-8 text-lg focus-visible:ring-primary/20 focus-visible:border-primary transition-all placeholder:text-slate-300 placeholder:font-medium" {...field} />
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
                                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("descLabel")}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={t("descPlaceholder")}
                                                className="min-h-[120px] rounded-[2rem] bg-white border-slate-100 shadow-sm font-medium p-8 resize-none text-slate-600 leading-relaxed focus-visible:ring-primary/20 focus-visible:border-primary transition-all placeholder:text-slate-300"
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
                                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("uploadLabel")}</FormLabel>
                                        <FormControl>
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className={cn(
                                                    "relative min-h-[160px] rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-white hover:border-primary/50 group overflow-hidden shadow-sm hover:shadow-xl",
                                                    field.value && "border-none shadow-2xl bg-white"
                                                )}
                                            >
                                                {isUploading ? (
                                                    <div className="flex flex-col items-center gap-4">
                                                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                                        <span className="text-xs font-black uppercase tracking-widest text-primary animate-pulse italic">Uploading Asset...</span>
                                                    </div>
                                                ) : field.value ? (
                                                    <div className="w-full h-full p-8 flex items-center justify-between">
                                                        <div className="flex items-center gap-6">
                                                            <div className="p-5 bg-primary/10 rounded-2xl">
                                                                <FileText className="w-8 h-8 text-primary" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-black text-slate-900 text-lg truncate max-w-[300px]">{fileName}</span>
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{form.getValues("file_type")} &bull; {form.getValues("file_size")}</span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setFileName("");
                                                                field.onChange("");
                                                            }}
                                                            className="p-3 bg-rose-50 text-rose-600 rounded-full hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                                        >
                                                            <X size={20} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-4 text-slate-400 group-hover:text-primary transition-all duration-500">
                                                        <div className="p-6 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 transition-transform duration-500 group-hover:scale-110">
                                                            <Upload size={32} className="text-primary" />
                                                        </div>
                                                        <span className="text-xs font-black uppercase tracking-[0.2em] leading-relaxed italic text-center px-10">Drop file or click to browse</span>
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    className="hidden"
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
                                            {resource ? t("update") : t("save")}
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
