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
import { Event, EventCreate, useEvents } from "@/hooks/use-events";
import { useEffect, useState, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Loader2, ImageIcon, Upload, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getImageUrl } from "@/lib/api-config";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const eventSchema = zod.object({
    title: zod.string().min(3, "Title must be at least 3 characters"),
    description: zod.string().optional(),
    start_date: zod.string().optional(),
    end_date: zod.string().optional(),
    location: zod.string().optional(),
    status: zod.enum(["Upcoming", "Past"]),
    registration_link: zod.string().optional(),
    category: zod.string().optional(),
    thumbnail_url: zod.string().optional().or(zod.literal("")),
    source_lang: zod.enum(["fr", "en"]),
});

interface EventsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any) => Promise<void>;
    event?: Event | null;
    isSubmitting: boolean;
}

export function EventsDialog({ open, onOpenChange, onSubmit, event, isSubmitting }: EventsDialogProps) {
    const t = useTranslations("admin.events.dialog");
    const commonT = useTranslations("admin.common");
    const locale = useLocale();

    const { uploadFile, isUploading } = useEvents();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    const form = useForm({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            title: "",
            description: "",
            start_date: "",
            end_date: "",
            location: "",
            status: "Upcoming",
            registration_link: "",
            category: "Workshop",
            thumbnail_url: "",
            source_lang: locale === "fr" ? "fr" : "en",
        },
    });

    useEffect(() => {
        if (event) {
            form.reset({
                title: (event.title as any)[locale] || event.title.fr || event.title.en || "",
                description: event.description ? ((event.description as any)[locale] || event.description.fr || event.description.en || "") : "",
                start_date: event.start_date ? new Date(event.start_date).toISOString().slice(0, 16) : "",
                end_date: event.end_date ? new Date(event.end_date).toISOString().slice(0, 16) : "",
                location: event.location ? ((event.location as any)[locale] || event.location.fr || event.location.en || "") : "",
                status: event.status || "Upcoming",
                registration_link: event.registration_link || "",
                category: event.category || "Workshop",
                thumbnail_url: event.thumbnail_url || "",
                source_lang: (event.title as any)[locale] ? locale : (event.title.fr ? "fr" : "en"),
            });
            setPreviewUrl(getImageUrl(event.thumbnail_url) || "");
        } else {
            form.reset({
                title: "",
                description: "",
                start_date: "",
                end_date: "",
                location: "",
                status: "Upcoming",
                registration_link: "",
                category: "Workshop",
                thumbnail_url: "",
                source_lang: locale === "fr" ? "fr" : "en",
            });
            setPreviewUrl("");
        }
    }, [event, form, locale]);

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
        // Prepare data dates for ISO format 
        const payload = { ...data };
        if (payload.start_date) payload.start_date = new Date(payload.start_date).toISOString();
        else payload.start_date = null;
        if (payload.end_date) payload.end_date = new Date(payload.end_date).toISOString();
        else payload.end_date = null;

        await onSubmit(payload);
        form.reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-[2.5rem] border-none shadow-2xl p-0 selection:bg-primary selection:text-white">
                <div className="bg-slate-50/80 backdrop-blur-md p-10 border-b border-slate-100 sticky top-0 z-10">
                    <DialogHeader>
                        <DialogTitle className="text-4xl font-black text-slate-900 tracking-tight">
                            {event ? t("editTitle") : t("createTitle")}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium text-lg mt-3 max-w-xl">
                            {event ? t("editDesc") : t("createDesc")}
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
                                                    <SelectItem value="fr" className="rounded-xl font-bold py-3">Français</SelectItem>
                                                    <SelectItem value="en" className="rounded-xl font-bold py-3">English</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem className="space-y-4">
                                                <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("statusLabel")}</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-14 rounded-2xl bg-white border-slate-100 shadow-sm font-bold text-slate-700">
                                                            <SelectValue placeholder="Status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="rounded-2xl border-slate-100 p-2 shadow-2xl">
                                                        <SelectItem value="Upcoming" className="rounded-xl font-bold py-3 text-emerald-600">{t("upcoming") || "Upcoming"}</SelectItem>
                                                        <SelectItem value="Past" className="rounded-xl font-bold py-3 text-slate-400">{t("past") || "Past"}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem className="space-y-4">
                                                <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("categoryLabel")}</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Workshop, Summit..." className="h-14 rounded-2xl bg-white border-slate-100 shadow-sm font-bold px-4" {...field} />
                                                </FormControl>
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
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="space-y-4">
                                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("descLabel")}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={t("descPlaceholder")}
                                                className="min-h-[120px] rounded-3xl bg-white border-slate-100 shadow-sm font-medium p-8 resize-none text-slate-600 leading-relaxed"
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
                                    name="start_date"
                                    render={({ field }) => (
                                        <FormItem className="space-y-4">
                                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("startDateLabel")}</FormLabel>
                                            <FormControl>
                                                <Input type="datetime-local" className="h-16 rounded-2xl bg-white border-slate-100 shadow-sm font-bold px-8" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="end_date"
                                    render={({ field }) => (
                                        <FormItem className="space-y-4">
                                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("endDateLabel")}</FormLabel>
                                            <FormControl>
                                                <Input type="datetime-local" className="h-16 rounded-2xl bg-white border-slate-100 shadow-sm font-bold px-8" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem className="space-y-4">
                                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("locationLabel")}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t("locationPlaceholder")} className="h-16 rounded-2xl bg-white border-slate-100 shadow-sm font-bold px-8" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="registration_link"
                                render={({ field }) => (
                                    <FormItem className="space-y-4">
                                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("linkLabel")}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t("linkPlaceholder")} type="url" className="h-16 rounded-2xl bg-white border-slate-100 shadow-sm font-bold px-8" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="thumbnail_url"
                                render={({ field }) => (
                                    <FormItem className="space-y-4">
                                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">Image / Thumbnail</FormLabel>
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
                                                        <span className="text-xs font-black uppercase tracking-widest leading-relaxed text-center px-10">Select an image</span>
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
                                    {isSubmitting || isUploading ? (
                                        <div className="flex items-center gap-3">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            {t("saving")}
                                        </div>
                                    ) : (event ? t("update") : t("save"))}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
