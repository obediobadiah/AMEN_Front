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
    FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Album, useAlbums } from "@/hooks/use-albums";
import { useEffect, useState, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Loader2, ImageIcon, Upload, X } from "lucide-react";
import { getImageUrl } from "@/lib/api-config";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const albumSchema = zod.object({
    name: zod.string().min(3, "Name must be at least 3 characters"),
    description: zod.string().optional(),
    is_public: zod.boolean().default(false),
    thumbnail_url: zod.string().optional(),
    source_lang: zod.string(),
});

interface AlbumDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any) => Promise<void>;
    album?: Album | null;
    isSubmitting: boolean;
}

export function AlbumDialog({ open, onOpenChange, onSubmit, album, isSubmitting }: AlbumDialogProps) {
    const t = useTranslations("admin.albums.dialog");
    const commonT = useTranslations("admin.common");
    const locale = useLocale();

    const { uploadFile } = useAlbums();
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    const form = useForm({
        resolver: zodResolver(albumSchema),
        defaultValues: {
            name: "",
            description: "",
            is_public: false,
            thumbnail_url: "",
            source_lang: locale,
        },
    });

    useEffect(() => {
        if (album) {
            form.reset({
                name: (album.name as any)[locale] || album.name.fr || album.name.en || "",
                description: album.description ? ((album.description as any)[locale] || album.description.fr || album.description.en || "") : "",
                is_public: album.is_public,
                thumbnail_url: album.thumbnail_url || "",
                source_lang: locale,
            });
            setPreviewUrl(getImageUrl(album.thumbnail_url) || "");
        } else {
            form.reset({
                name: "",
                description: "",
                is_public: false,
                thumbnail_url: "",
                source_lang: locale,
            });
            setPreviewUrl("");
        }
    }, [album, form, locale, open]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const result = await uploadFile(file);
            form.setValue("thumbnail_url", result.url);
            setPreviewUrl(getImageUrl(result.url));
            toast.success("Cover image uploaded");
        } catch (error) {
            toast.error("Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-[2.5rem] border-none shadow-2xl p-0 selection:bg-primary selection:text-white">
                <div className="bg-slate-50/80 backdrop-blur-md p-10 border-b border-slate-100 sticky top-0 z-10">
                    <DialogHeader>
                        <DialogTitle className="text-4xl font-black text-slate-900 tracking-tight">
                            {album ? t("editTitle") : t("createTitle")}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium text-lg mt-3 max-w-xl">
                            {album ? t("editDesc") : t("createDesc")}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="space-y-4">
                                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("nameLabel")}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t("namePlaceholder")} className="h-16 rounded-2xl bg-white border-slate-100 shadow-sm font-bold px-8 text-lg focus-visible:ring-primary/20 focus-visible:border-primary transition-all placeholder:text-slate-300" {...field} />
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
                                name="is_public"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-[2rem] border-2 border-slate-50 p-6 bg-slate-50/30 transition-all hover:bg-white hover:border-slate-100">
                                        <div className="space-y-1">
                                            <FormLabel className="text-sm font-black text-slate-900 tracking-tight">{t("visibilityLabel")}</FormLabel>
                                            <FormDescription className="text-xs font-medium text-slate-400 max-w-[400px]">
                                                {t("visibilityDesc")}
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="scale-110 data-[state=checked]:bg-primary"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

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
                                                    "relative aspect-[16/6] rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-white hover:border-primary/50 group overflow-hidden shadow-sm hover:shadow-xl",
                                                    (previewUrl || field.value) && "border-none shadow-2xl"
                                                )}
                                            >
                                                {isUploading ? (
                                                    <div className="flex flex-col items-center gap-4">
                                                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                                        <span className="text-xs font-black uppercase tracking-widest text-primary animate-pulse italic">Processing...</span>
                                                    </div>
                                                ) : (previewUrl || field.value) ? (
                                                    <>
                                                        <img src={previewUrl || getImageUrl(field.value)} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                                            <div className="bg-white/90 backdrop-blur-md p-4 rounded-full shadow-2xl transform scale-75 group-hover:scale-100 transition-all duration-500">
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
                                                            className="absolute top-6 right-6 p-2.5 bg-rose-500 text-white rounded-full shadow-2xl hover:bg-rose-600 transition-all z-20 scale-90 group-hover:scale-100"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-4 text-slate-400 group-hover:text-primary transition-all duration-500">
                                                        <div className="p-6 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 transition-transform duration-500 group-hover:scale-110">
                                                            <ImageIcon size={32} className="text-primary" />
                                                        </div>
                                                        <span className="text-xs font-black uppercase tracking-[0.2em] leading-relaxed italic">Select album cover art</span>
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
                                            {album ? t("update") : t("save")}
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
