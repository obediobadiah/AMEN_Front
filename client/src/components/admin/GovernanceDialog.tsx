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
import { GovernanceMember, GovernanceCreate, useGovernance } from "@/hooks/use-governance";
import { useEffect, useState, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Loader2, ImageIcon, Upload, X, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getImageUrl } from "@/lib/api-config";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const govSchema = zod.object({
    name: zod.string().min(2, "Name is required"),
    role: zod.string().min(2, "Role is required"),
    bio: zod.string().optional(),
    photo_url: zod.string().optional().or(zod.literal("")),
    organ_id: zod.string().optional(),
    order: zod.number().default(0),
    source_lang: zod.string().default("fr"),
});

interface GovernanceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any) => Promise<void>;
    member?: GovernanceMember | null;
    isSubmitting: boolean;
}

export function GovernanceDialog({ open, onOpenChange, onSubmit, member, isSubmitting }: GovernanceDialogProps) {
    const t = useTranslations("admin.governance.dialog");
    const tGov = useTranslations("admin.governance");
    const commonT = useTranslations("admin.common");
    const locale = useLocale();

    const { uploadFile, isUploading } = useGovernance();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    const form = useForm({
        resolver: zodResolver(govSchema),
        defaultValues: {
            name: "",
            role: "",
            bio: "",
            photo_url: "",
            organ_id: "pe",
            order: 0,
            source_lang: "fr",
        },
    });

    useEffect(() => {
        if (member) {
            form.reset({
                name: member.name || "",
                role: (member.role as any)[locale] || member.role.fr || member.role.en || "",
                bio: member.bio ? ((member.bio as any)[locale] || member.bio.fr || member.bio.en || "") : "",
                photo_url: member.photo_url || "",
                organ_id: member.organ_id || "pe",
                order: member.order || 0,
                source_lang: "fr",
            });
            setPreviewUrl(getImageUrl(member.photo_url) || "");
        } else {
            form.reset({
                name: "",
                role: "",
                bio: "",
                photo_url: "",
                organ_id: "pe",
                order: 0,
                source_lang: "fr",
            });
            setPreviewUrl("");
        }
    }, [member, form, locale, open]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const result = await uploadFile(file);
            form.setValue("photo_url", result.url);
            setPreviewUrl(getImageUrl(result.url));
            toast.success("Photo téléchargée avec succès");
        } catch (error) {
            toast.error("Échec du téléchargement de la photo");
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
            <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto rounded-[2.5rem] border-none shadow-2xl p-0 selection:bg-primary selection:text-white">
                <div className="bg-slate-50/80 backdrop-blur-md p-10 border-b border-slate-100 sticky top-0 z-10">
                    <DialogHeader>
                        <DialogTitle className="text-4xl font-black text-slate-900 tracking-tight">
                            {member ? t("editTitle") : t("createTitle")}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium text-lg mt-3 max-w-xl">
                            {member ? t("editDesc") : t("createDesc")}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
                            <div className="flex flex-col md:flex-row gap-10 items-start">
                                {/* Photo Upload Section */}
                                <div className="w-full md:w-1/3 space-y-4">
                                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("uploadLabel")}</FormLabel>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className={cn(
                                            "relative aspect-[3/4] rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-white hover:border-primary/50 group overflow-hidden shadow-sm hover:shadow-xl",
                                            (previewUrl || form.watch("photo_url")) && "border-none shadow-2xl"
                                        )}
                                    >
                                        {isUploading ? (
                                            <div className="flex flex-col items-center gap-4">
                                                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-primary animate-pulse">Processing...</span>
                                            </div>
                                        ) : (previewUrl || form.watch("photo_url")) ? (
                                            <>
                                                <img src={previewUrl || getImageUrl(form.watch("photo_url"))} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                                    <div className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-2xl transform scale-75 group-hover:scale-100 transition-all duration-500">
                                                        <Upload className="w-5 h-5 text-primary" />
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setPreviewUrl("");
                                                        form.setValue("photo_url", "");
                                                    }}
                                                    className="absolute top-4 right-4 p-2 bg-rose-500 text-white rounded-full shadow-2xl hover:bg-rose-600 transition-all z-20"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center gap-4 text-slate-400 group-hover:text-primary transition-all duration-500">
                                                <div className="p-5 bg-white rounded-2xl shadow-lg border border-slate-100 transition-transform group-hover:scale-110">
                                                    <User size={32} strokeWidth={1.5} />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] italic text-center px-4">Upload Professional Shot</span>
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
                                </div>

                                {/* Form Fields Section */}
                                <div className="flex-1 space-y-8 w-full">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className="space-y-4">
                                                <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("nameLabel")}</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={t("namePlaceholder")} className="h-16 rounded-2xl bg-white border-slate-100 shadow-sm font-bold px-8 text-lg focus-visible:ring-primary/20 transition-all placeholder:text-slate-300" {...field} />
                                                </FormControl>
                                                <FormMessage className="text-xs font-bold text-rose-500" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem className="space-y-4">
                                                <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("roleLabel")}</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={t("rolePlaceholder")} className="h-16 rounded-2xl bg-white border-slate-100 shadow-sm font-bold px-8 focus-visible:ring-primary/20 transition-all placeholder:text-slate-300" {...field} />
                                                </FormControl>
                                                <FormMessage className="text-xs font-bold text-rose-500" />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        <FormField
                                            control={form.control}
                                            name="organ_id"
                                            render={({ field }) => (
                                                <FormItem className="space-y-4">
                                                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("organLabel")}</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="h-14 rounded-2xl bg-white border-slate-100 font-bold focus:ring-primary/20 transition-all">
                                                                <SelectValue placeholder="Organ" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="rounded-2xl border-slate-100 p-2 shadow-2xl">
                                                            <SelectItem value="ag" className="rounded-xl font-bold py-3">{tGov("filters.ag")}</SelectItem>
                                                            <SelectItem value="cd" className="rounded-xl font-bold py-3">{tGov("filters.cd")}</SelectItem>
                                                            <SelectItem value="pe" className="rounded-xl font-bold py-3">{tGov("filters.pe")}</SelectItem>
                                                            <SelectItem value="dg" className="rounded-xl font-bold py-3">{tGov("filters.dg")}</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="order"
                                            render={({ field }) => (
                                                <FormItem className="space-y-4">
                                                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("orderLabel")}</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" className="h-14 rounded-2xl bg-white border-slate-100 font-bold px-6 focus-visible:ring-primary/20 transition-all" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem className="space-y-4">
                                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("bioLabel")}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={t("bioPlaceholder")}
                                                className="min-h-[140px] rounded-[2rem] bg-white border-slate-100 shadow-sm font-medium p-8 resize-none text-slate-600 leading-relaxed focus-visible:ring-primary/20 transition-all placeholder:text-slate-300"
                                                {...field}
                                            />
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
                                    className="h-16 px-10 rounded-2xl text-slate-400 font-bold hover:bg-slate-50 hover:text-slate-600 transition-all"
                                >
                                    {commonT("cancel")}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || isUploading}
                                    className="h-16 px-14 rounded-2xl bg-primary shadow-2xl shadow-primary/30 hover:shadow-primary/50 font-black text-lg transition-all min-w-[220px]"
                                >
                                    {isSubmitting || isUploading ? (
                                        <div className="flex items-center gap-3">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span className="animate-pulse italic">Synchronizing...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            {member ? t("update") : t("save")}
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
