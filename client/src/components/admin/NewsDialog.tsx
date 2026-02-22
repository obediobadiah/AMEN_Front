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
import { NewsArticle, NewsCreate, useNews } from "@/hooks/use-news";
import { useEffect, useState, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ImageIcon, Upload, X, Loader2 } from "lucide-react";
import { getImageUrl } from "@/lib/api-config";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const newsSchema = zod.object({
    title: zod.string().min(5, "Title must be at least 5 characters"),
    content: zod.string().min(20, "Content must be at least 20 characters"),
    excerpt: zod.string().optional(),
    author: zod.string().min(2, "Author is required"),
    category: zod.string().min(2, "Category is required"),
    status: zod.enum(["Draft", "Published", "Archived"]),
    reading_time: zod.number().min(1, "Reading time must be at least 1 minute"),
    thumbnail_url: zod.string().optional().or(zod.literal("")),
    source_lang: zod.enum(["fr", "en"]),
});

interface NewsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any) => Promise<void>;
    article?: NewsArticle | null;
    isSubmitting: boolean;
}

export function NewsDialog({ open, onOpenChange, onSubmit, article, isSubmitting }: NewsDialogProps) {
    const t = useTranslations("admin.news.dialog");
    const commonT = useTranslations("admin.common");
    const locale = useLocale();
    const { uploadFile, isUploading } = useNews();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    const form = useForm({
        resolver: zodResolver(newsSchema),
        defaultValues: {
            title: "",
            content: "",
            excerpt: "",
            author: "Admin",
            category: "impact",
            status: "Draft",
            reading_time: 5,
            thumbnail_url: "",
            source_lang: locale === "fr" ? "fr" : "en",
        },
    });

    useEffect(() => {
        if (article) {
            form.reset({
                title: (article.title as any)[locale] || article.title.fr || article.title.en || "",
                content: (article.content as any)[locale] || article.content.fr || article.content.en || "",
                excerpt: (article.excerpt as any)?.[locale] || article.excerpt?.fr || article.excerpt?.en || "",
                author: article.author || "Admin",
                category: article.category || "impact",
                status: (article.status as any) || "Draft",
                reading_time: article.reading_time || 5,
                thumbnail_url: article.thumbnail_url || "",
                source_lang: (article.title as any)[locale] ? locale : (article.title.fr ? "fr" : "en"),
            });
            setPreviewUrl(getImageUrl(article.thumbnail_url) || "");
        } else {
            form.reset({
                title: "",
                content: "",
                excerpt: "",
                author: "Admin",
                category: "impact",
                status: "Draft",
                reading_time: 5,
                thumbnail_url: "",
                source_lang: locale === "fr" ? "fr" : "en",
            });
            setPreviewUrl("");
        }
    }, [article, form]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const result = await uploadFile(file);

            form.setValue("thumbnail_url", result.url);
            setPreviewUrl(getImageUrl(result.url));
            toast.success("Image téléchargée avec succès");
        } catch (error) {
            toast.error("Échec du téléchargement de l'image");
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
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto rounded-[2.5rem] border-none shadow-2xl p-0 selection:bg-primary selection:text-white">
                <div className="bg-slate-50/80 backdrop-blur-md p-10 border-b border-slate-100 sticky top-0 z-10">
                    <DialogHeader>
                        <DialogTitle className="text-4xl font-black text-slate-900 tracking-tight">
                            {article ? t("editTitle") : t("createTitle")}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium text-lg mt-3 max-w-xl">
                            {article ? t("editDesc") : t("createDesc")}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormField
                                    control={form.control}
                                    name="source_lang"
                                    render={({ field }) => (
                                        <FormItem className="space-y-4">
                                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("inputLang")}</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-14 rounded-2xl bg-white border-slate-100 shadow-sm font-bold text-slate-700">
                                                        <SelectValue placeholder="Langue" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-2xl border-slate-100 p-2 shadow-2xl">
                                                    <SelectItem value="fr" className="rounded-xl font-bold py-3">{t("fr")}</SelectItem>
                                                    <SelectItem value="en" className="rounded-xl font-bold py-3">{t("en")}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem className="space-y-4">
                                                <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("category")}</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-14 rounded-2xl bg-white border-slate-100 shadow-sm font-bold text-slate-700">
                                                            <SelectValue placeholder="Catégorie" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="rounded-2xl border-slate-100 p-2 shadow-2xl">
                                                        <SelectItem value="impact" className="rounded-xl font-bold py-3">{t("impact")}</SelectItem>
                                                        <SelectItem value="field" className="rounded-xl font-bold py-3">{t("field")}</SelectItem>
                                                        <SelectItem value="press" className="rounded-xl font-bold py-3">{t("press")}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem className="space-y-4">
                                                <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("status")}</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-14 rounded-2xl bg-white border-slate-100 shadow-sm font-bold text-slate-700">
                                                            <SelectValue placeholder="Statut" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="rounded-2xl border-slate-100 p-2 shadow-2xl">
                                                        <SelectItem value="Draft" className="rounded-xl font-bold py-3">{t("draft")}</SelectItem>
                                                        <SelectItem value="Published" className="rounded-xl font-bold py-3 text-emerald-600">{t("published")}</SelectItem>
                                                        <SelectItem value="Archived" className="rounded-xl font-bold py-3 text-slate-400">{t("archived")}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem className="space-y-4">
                                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("titleLabel")}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t("titlePlaceholder")} className="h-16 rounded-2xl bg-white border-slate-100 shadow-sm font-bold px-8 text-lg" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="excerpt"
                                render={({ field }) => (
                                    <FormItem className="space-y-4">
                                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("excerptLabel")}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={t("excerptPlaceholder")}
                                                className="min-h-[120px] rounded-3xl bg-white border-slate-100 shadow-sm font-medium p-8 resize-none text-slate-600 leading-relaxed"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem className="space-y-4">
                                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("contentLabel")}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={t("contentPlaceholder")}
                                                className="min-h-[400px] rounded-[2.5rem] bg-white border-slate-100 shadow-sm font-medium p-10 resize-none text-slate-600 leading-relaxed"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormField
                                    control={form.control}
                                    name="author"
                                    render={({ field }) => (
                                        <FormItem className="space-y-4">
                                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("authorLabel")}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={t("authorPlaceholder")} className="h-16 rounded-2xl bg-white border-slate-100 shadow-sm font-bold px-8" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="reading_time"
                                    render={({ field }) => (
                                        <FormItem className="space-y-4">
                                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("readTimeLabel")}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    className="h-16 rounded-2xl bg-white border-slate-100 shadow-sm font-bold px-8"
                                                    {...field}
                                                    onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="thumbnail_url"
                                render={({ field }) => (
                                    <FormItem className="space-y-4">
                                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("uploadLabel")}</FormLabel>
                                        <FormControl>
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className={cn(
                                                    "relative aspect-[21/9] rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-white hover:border-primary/50 group overflow-hidden",
                                                    (previewUrl || field.value) && "border-none"
                                                )}
                                            >
                                                {isUploading ? (
                                                    <div className="flex flex-col items-center gap-4">
                                                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                                        <span className="text-xs font-black uppercase tracking-widest text-primary animate-pulse italic">Téléchargement...</span>
                                                    </div>
                                                ) : (previewUrl || field.value) ? (
                                                    <>
                                                        <img src={previewUrl || getImageUrl(field.value)} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                                            <div className="bg-white/90 backdrop-blur-md p-4 rounded-full shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-500">
                                                                <Upload className="w-6 h-6 text-primary" />
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setPreviewUrl("");
                                                                field.onChange("");
                                                            }}
                                                            className="absolute top-6 right-6 p-2.5 bg-rose-500 text-white rounded-full shadow-xl hover:bg-rose-600 transition-colors z-20"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-4 text-slate-400 group-hover:text-primary transition-colors">
                                                        <div className="p-6 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 transition-transform duration-500 group-hover:scale-110">
                                                            <ImageIcon size={32} />
                                                        </div>
                                                        <span className="text-xs font-black uppercase tracking-widest leading-relaxed text-center px-10">{t("uploadPlaceholder")}</span>
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
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
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-3">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            {t("saving")}
                                        </div>
                                    ) : (article ? t("update") : t("save"))}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
