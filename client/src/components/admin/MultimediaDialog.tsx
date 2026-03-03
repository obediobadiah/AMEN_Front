"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
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
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useLocale, useTranslations } from "next-intl";
import { Multimedia, useMultimedia } from "@/hooks/use-multimedia";
import { useAlbums } from "@/hooks/use-albums";
import { Loader2, Upload, ImageIcon, X } from "lucide-react";
import { getImageUrl } from "@/lib/api-config";
import { toast } from "sonner";

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    media_url: z.union([z.string(), z.array(z.string())]).refine(val => val.length > 0, "Media URL is required"),
    thumbnail_url: z.string().optional(),
    type: z.enum(["photo", "video"]),
    category: z.string().min(1, "Category is required"),
    album_id: z.number().optional().nullable(),
    source_lang: z.string(),
});

interface MultimediaDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any) => Promise<void>;
    media: Multimedia | null;
    isSubmitting: boolean;
}

export function MultimediaDialog({
    open,
    onOpenChange,
    onSubmit,
    media,
    isSubmitting,
}: MultimediaDialogProps) {
    const t = useTranslations("admin.multimedia.dialog");
    const tMedia = useTranslations("admin.multimedia");
    const [uploading, setUploading] = useState(false);
    const { uploadFile } = useMultimedia();
    const { albums } = useAlbums();
    const locale = useLocale();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            media_url: "",
            thumbnail_url: "",
            type: "photo",
            category: "",
            album_id: null,
            source_lang: locale,
        },
    });

    useEffect(() => {
        if (media) {
            form.reset({
                title: (media.title as any)[locale] || media.title.fr || media.title.en || "",
                media_url: media.media_url,
                thumbnail_url: media.thumbnail_url || "",
                type: (media.type as any) || "photo",
                category: media.category ? ((media.category as any)[locale] || media.category.fr || media.category.en || "") : "",
                album_id: media.album_id || null,
                source_lang: locale,
            });
        } else {
            form.reset({
                title: "",
                media_url: [],
                thumbnail_url: "",
                type: "photo",
                category: "",
                album_id: null,
                source_lang: locale,
            });
        }
    }, [media, form, locale, open]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "media_url" | "thumbnail_url") => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        try {
            setUploading(true);
            const isVideo = form.getValues("type") === "video";

            if (field === "media_url" && !media) {
                const uploadedUrls: string[] = [];
                for (const file of files) {
                    if (isVideo && file.size > 50 * 1024 * 1024) {
                        toast.error(`File ${file.name} exceeds 50MB limit`);
                        continue;
                    }
                    const { url } = await uploadFile(file);
                    uploadedUrls.push(url);
                }
                if (uploadedUrls.length > 0) {
                    const current = form.getValues("media_url");
                    const currentArray = Array.isArray(current) ? current : (current ? [current] : []);
                    form.setValue("media_url", [...currentArray, ...uploadedUrls] as any);
                }
            } else {
                const file = files[0];
                if (field === "media_url" && isVideo && file.size > 50 * 1024 * 1024) {
                    toast.error(`File ${file.name} exceeds 50MB limit`);
                    return;
                }
                const { url } = await uploadFile(file);
                form.setValue(field, url);
            }
        } catch (error) {
            console.error("Upload failed:", error);
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
        await onSubmit(values);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto rounded-3xl sm:rounded-[2.5rem] border-none shadow-2xl p-0 selection:bg-primary selection:text-white">
                <div className="bg-slate-50/80 backdrop-blur-md p-6 sm:p-10 border-b border-slate-100 sticky top-0 z-10">
                    <DialogHeader>
                        <DialogTitle className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                            {media ? tMedia("dialog.editTitle") : tMedia("dialog.createTitle")}
                        </DialogTitle>
                        <DialogDescription className="text-sm sm:text-lg text-slate-500 font-medium mt-1 sm:mt-3 max-w-xl">
                            {media ? tMedia("dialog.editDesc") : tMedia("dialog.createDesc")}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-5 sm:p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 sm:space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 text-slate-900">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem className="col-span-1 md:col-span-2 space-y-2 sm:space-y-4">
                                            <FormLabel className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{tMedia("dialog.titleLabel")}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder={tMedia("dialog.titlePlaceholder")}
                                                    className="h-12 sm:h-16 rounded-xl sm:rounded-2xl bg-white border-slate-100 shadow-sm font-bold px-4 sm:px-8 text-base sm:text-lg focus-visible:ring-primary/20 focus-visible:border-primary transition-all placeholder:text-slate-300 placeholder:font-medium"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs font-bold text-rose-500 pl-1" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2 sm:space-y-4">
                                            <FormLabel className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{tMedia("filters.all")}</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-white border-slate-100 shadow-sm font-bold text-slate-700 focus:ring-primary/20 transition-all text-sm sm:text-base">
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-2xl border-slate-100 p-2 shadow-2xl">
                                                    <SelectItem value="photo" className="rounded-xl font-bold py-3">{tMedia("filters.photo")}</SelectItem>
                                                    <SelectItem value="video" className="rounded-xl font-bold py-3">{tMedia("filters.video")}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-xs font-bold text-rose-500 pl-1" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2 sm:space-y-4">
                                            <FormLabel className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{tMedia("dialog.categoryLabel") || "Category"}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="E.g. Nature, Community..."
                                                    className="h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-white border-slate-100 shadow-sm font-bold px-4 focus-visible:ring-primary/20 focus-visible:border-primary transition-all placeholder:text-slate-300 text-sm sm:text-base"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs font-bold text-rose-500 pl-1" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="album_id"
                                    render={({ field }) => (
                                        <FormItem className="col-span-1 md:col-span-2 space-y-2 sm:space-y-4">
                                            <FormLabel className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{tMedia("dialog.albumLabel")}</FormLabel>
                                            <Select
                                                onValueChange={(val) => field.onChange(val === "none" ? null : parseInt(val))}
                                                value={field.value?.toString() || "none"}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-white border-slate-100 shadow-sm font-bold text-slate-700 focus:ring-primary/20 transition-all text-sm sm:text-base">
                                                        <SelectValue placeholder={tMedia("dialog.albumPlaceholder")} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-2xl border-slate-100 p-2 shadow-2xl">
                                                    <SelectItem value="none" className="rounded-xl font-bold py-3 text-slate-400">None (General Library)</SelectItem>
                                                    {albums.map((album) => (
                                                        <SelectItem key={album.id} value={album.id.toString()} className="rounded-xl font-bold py-3">
                                                            {(album.name as any)[locale] || album.name.fr || album.name.en}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-xs font-bold text-rose-500 pl-1" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="media_url"
                                    render={({ field }) => {
                                        const urls = Array.isArray(field.value) ? field.value : (field.value ? [field.value] : []);
                                        const isMultipleMode = !media;
                                        const isVideo = form.watch("type") === "video";
                                        const accept = isVideo ? "video/*" : "image/*";

                                        return (
                                            <FormItem className="col-span-1 md:col-span-2 space-y-2 sm:space-y-4">
                                                <FormLabel className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">
                                                    {isVideo ? "Video Asset(s) or URL" : "Photo Asset(s)"}
                                                </FormLabel>

                                                {isVideo && (
                                                    <Input
                                                        value={!Array.isArray(field.value) ? field.value as string : ""}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                        placeholder="Or paste an external URL (e.g. https://youtube.com/...)"
                                                        className="h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-white border-slate-100 shadow-sm font-bold px-4 sm:px-6 text-xs sm:text-sm focus-visible:ring-primary/20 focus-visible:border-primary transition-all placeholder:text-slate-300"
                                                    />
                                                )}

                                                <div className="space-y-0">
                                                    {urls.length > 0 ? (
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            {urls.map((url: string, idx: number) => (
                                                                <div key={idx} className="relative aspect-[21/9] rounded-2xl sm:rounded-[2.5rem] overflow-hidden border-none shadow-xl group bg-slate-100">
                                                                    {!isVideo || getImageUrl(url).match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                                                                        <img src={getImageUrl(url)} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                                    ) : (
                                                                        <video src={getImageUrl(url)} className="w-full h-full object-cover" controls />
                                                                    )}
                                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px] pointer-events-none">
                                                                    </div>
                                                                    <Button
                                                                        type="button"
                                                                        variant="destructive"
                                                                        size="icon"
                                                                        className="absolute top-2 sm:top-4 right-2 sm:right-4 rounded-full w-8 h-8 sm:w-10 sm:h-10 shadow-2xl opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 bg-rose-500 text-white hover:bg-rose-600 scale-90 group-hover:scale-100 z-10"
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            const newUrls = urls.filter((_, i) => i !== idx);
                                                                            field.onChange(newUrls.length > 0 ? (isMultipleMode ? newUrls : newUrls[0]) : (isMultipleMode ? [] : ""));
                                                                        }}
                                                                    >
                                                                        <X size={16} />
                                                                    </Button>
                                                                </div>
                                                            ))}
                                                            {isMultipleMode && (
                                                                <div className="relative aspect-[21/9] rounded-2xl sm:rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-white hover:border-primary/50 transition-all duration-500 flex flex-col items-center justify-center gap-2 group cursor-pointer">
                                                                    <Upload className="text-primary w-6 h-6 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform duration-500" />
                                                                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-400 group-hover:text-primary transition-colors">Add More</span>
                                                                    <Input
                                                                        type="file"
                                                                        accept={accept}
                                                                        multiple={true}
                                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                                        onChange={(e) => handleFileUpload(e, "media_url")}
                                                                        disabled={uploading}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="relative h-40 sm:h-48 rounded-2xl sm:rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-white hover:border-primary/50 transition-all duration-500 flex flex-col items-center justify-center gap-4 group mt-4">
                                                            <div className="p-4 sm:p-6 bg-white rounded-xl sm:rounded-[2rem] shadow-xl shadow-slate-200/50 transition-transform duration-500 group-hover:scale-110">
                                                                <Upload className="text-primary w-6 h-6 sm:w-8 sm:h-8" />
                                                            </div>
                                                            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-primary transition-colors italic text-center px-4">
                                                                Drop your {isVideo ? "video(s)" : "photo(s)"} here
                                                            </span>
                                                            {isVideo && (
                                                                <span className="text-[8px] sm:text-[10px] text-slate-400 font-medium mt-1">Max size 50MB per video</span>
                                                            )}
                                                            <Input
                                                                type="file"
                                                                accept={accept}
                                                                multiple={isMultipleMode}
                                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                                onChange={(e) => handleFileUpload(e, "media_url")}
                                                                disabled={uploading}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <FormMessage className="text-xs font-bold text-rose-500 pl-1" />
                                            </FormItem>
                                        );
                                    }}
                                />

                                {form.watch("type") === "video" && (
                                    <FormField
                                        control={form.control}
                                        name="thumbnail_url"
                                        render={({ field }) => (
                                            <FormItem className="col-span-1 md:col-span-2 space-y-2 sm:space-y-4">
                                                <FormLabel className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">Video Thumbnail</FormLabel>
                                                <div className="space-y-0 text-slate-900 leading-none">
                                                    {field.value && getImageUrl(field.value) ? (
                                                        <div className="relative aspect-[21/9] rounded-2xl sm:rounded-[2.5rem] overflow-hidden border-none shadow-xl group">
                                                            <img src={getImageUrl(field.value)} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                                                <div className="bg-white/90 backdrop-blur-md p-3 sm:p-4 rounded-full shadow-2xl transform scale-75 group-hover:scale-100 transition-all duration-500 text-slate-900 leading-none">
                                                                    <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                                                </div>
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="destructive"
                                                                size="icon"
                                                                className="absolute top-2 sm:top-6 right-2 sm:right-6 rounded-full w-8 h-8 sm:w-10 sm:h-10 shadow-2xl opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 bg-rose-500 text-white hover:bg-rose-600 scale-90 group-hover:scale-100"
                                                                onClick={() => field.onChange("")}
                                                            >
                                                                <X size={16} />
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div className="relative h-40 sm:h-48 rounded-2xl sm:rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-white hover:border-primary/50 transition-all duration-500 flex flex-col items-center justify-center gap-4 group">
                                                            <div className="p-4 sm:p-6 bg-white rounded-xl sm:rounded-[2rem] shadow-xl shadow-slate-200/50 transition-transform duration-500 group-hover:scale-110">
                                                                <ImageIcon className="text-primary w-6 h-6 sm:w-8 sm:h-8" size={32} />
                                                            </div>
                                                            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-primary transition-colors italic text-center px-4 sm:px-10">Upload Video Thumbnail</span>
                                                            <Input
                                                                type="file"
                                                                accept="image/*"
                                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                                onChange={(e) => handleFileUpload(e, "thumbnail_url")}
                                                                disabled={uploading}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <FormMessage className="text-xs font-bold text-rose-500 pl-1" />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>

                            <DialogFooter className="pt-6 sm:pt-10 border-t border-slate-50 mt-6 sm:mt-10 flex flex-col sm:flex-row gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => onOpenChange(false)}
                                    className="h-12 sm:h-16 px-6 sm:px-10 rounded-xl sm:rounded-2xl text-slate-500 font-bold hover:bg-slate-100 transition-all text-sm sm:text-base w-full sm:w-auto order-2 sm:order-1"
                                >
                                    {t("cancel")}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || uploading}
                                    className="h-12 sm:h-16 px-8 sm:px-14 rounded-xl sm:rounded-2xl bg-primary shadow-2xl shadow-primary/30 hover:shadow-primary/50 font-black text-base sm:text-lg transition-all w-full sm:w-auto min-w-0 sm:min-w-[200px] order-1 sm:order-2"
                                >
                                    {(isSubmitting || uploading) ? (
                                        <div className="flex items-center gap-3">
                                            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                            <span className="animate-pulse italic text-sm sm:text-base">Synchronizing...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            {media ? t("update") : t("save")}
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
