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
import { Project, ProjectCreate, useProjects } from "@/hooks/use-projects";
import { useEffect, useState, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Loader2, ImageIcon, Upload, X, Target } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getImageUrl } from "@/lib/api-config";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const projectSchema = zod.object({
    title: zod.string().min(3, "Title must be at least 3 characters"),
    description: zod.string().optional(),
    status: zod.string().optional(),
    location: zod.string().optional(),
    start_date: zod.string().optional(),
    end_date: zod.string().optional(),
    category: zod.string().optional(),
    impact_stats: zod.string().optional(),
    overview: zod.string().optional(),
    image_url: zod.string().optional().or(zod.literal("")),
    source_lang: zod.string(),
    goals: zod.array(zod.string()).optional().default([]),
    achievements: zod.array(zod.string()).optional().default([]),
});

type ProjectFormValues = zod.infer<typeof projectSchema>;


interface ProjectsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: ProjectFormValues) => Promise<void>;
    project?: Project | null;

    isSubmitting: boolean;
}

export function ProjectsDialog({ open, onOpenChange, onSubmit, project, isSubmitting }: ProjectsDialogProps) {
    const t = useTranslations("admin.projects.dialog");
    const tProj = useTranslations("admin.projects");
    const commonT = useTranslations("admin.common");
    const locale = useLocale();

    const { uploadFile, isUploading } = useProjects();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    // Dynamic lists state
    const [goals, setGoals] = useState<string[]>([]);
    const [achievements, setAchievements] = useState<string[]>([]);

    const form = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),

        defaultValues: {
            title: "",
            description: "",
            status: "Active",
            location: "",
            start_date: "",
            end_date: "",
            category: "Environment",
            impact_stats: "",
            overview: "",
            image_url: "",
            source_lang: locale,
            goals: [],
            achievements: [],
        },
    });

    useEffect(() => {
        if (project) {
            const currentGoals = project.goals ? ((project.goals as any)[locale] || project.goals.fr || project.goals.en || []) : [];
            const currentAchievements = project.achievements ? ((project.achievements as any)[locale] || project.achievements.fr || project.achievements.en || []) : [];

            setGoals(currentGoals);
            setAchievements(currentAchievements);

            form.reset({
                title: (project.title as any)[locale] || project.title.fr || project.title.en || "",
                description: project.description ? ((project.description as any)[locale] || project.description.fr || project.description.en || "") : "",
                status: project.status || "Active",
                location: project.location ? ((project.location as any)[locale] || project.location.fr || project.location.en || "") : "",
                start_date: project.start_date ? new Date(project.start_date).toISOString().slice(0, 10) : "",
                end_date: project.end_date ? new Date(project.end_date).toISOString().slice(0, 10) : "",
                category: project.category ? ((project.category as any)[locale] || (project.category as any).fr || (project.category as any).en || "Environment") : "Environment",
                impact_stats: project.impact_stats ? ((project.impact_stats as any)[locale] || project.impact_stats.fr || project.impact_stats.en || "") : "",
                overview: project.overview ? ((project.overview as any)[locale] || project.overview.fr || project.overview.en || "") : "",
                image_url: project.image_url || "",
                source_lang: locale,
                goals: currentGoals,
                achievements: currentAchievements,
            });
            setPreviewUrl(getImageUrl(project.image_url) || "");
        } else {
            setGoals([]);
            setAchievements([]);
            form.reset({
                title: "",
                description: "",
                status: "Active",
                location: "",
                start_date: "",
                end_date: "",
                category: "Environment",
                impact_stats: "",
                overview: "",
                image_url: "",
                source_lang: locale,
                goals: [],
                achievements: [],
            });
            setPreviewUrl("");
        }
    }, [project, form, locale, open]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const result = await uploadFile(file);
            form.setValue("image_url", result.url);
            setPreviewUrl(getImageUrl(result.url));
            toast.success(t("uploadSuccess"));
        } catch (error) {
            toast.error(t("uploadError"));
            console.error(error);
        }
    };

    const addGoal = () => {
        const newGoals = [...goals, ""];
        setGoals(newGoals);
        form.setValue("goals", newGoals);
    };

    const removeGoal = (index: number) => {
        const newGoals = goals.filter((_, i) => i !== index);
        setGoals(newGoals);
        form.setValue("goals", newGoals);
    };

    const updateGoal = (index: number, value: string) => {
        const newGoals = [...goals];
        newGoals[index] = value;
        setGoals(newGoals);
        form.setValue("goals", newGoals);
    };

    const addAchievement = () => {
        const newAchievements = [...achievements, ""];
        setAchievements(newAchievements);
        form.setValue("achievements", newAchievements);
    };

    const removeAchievement = (index: number) => {
        const newAchievements = achievements.filter((_, i) => i !== index);
        setAchievements(newAchievements);
        form.setValue("achievements", newAchievements);
    };

    const updateAchievement = (index: number, value: string) => {
        const newAchievements = [...achievements];
        newAchievements[index] = value;
        setAchievements(newAchievements);
        form.setValue("achievements", newAchievements);
    };

    const handleFormSubmit = async (data: ProjectFormValues) => {

        // Filter out empty goals/achievements
        const submissionData = {
            ...data,
            source_lang: locale,
            goals: goals.filter(g => g.trim() !== ""),
            achievements: achievements.filter(a => a.trim() !== ""),
        };
        await onSubmit(submissionData);
        form.reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[850px] w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto rounded-3xl sm:rounded-[2.5rem] border-none shadow-2xl p-0 selection:bg-primary selection:text-white">
                <div className="bg-slate-50/80 backdrop-blur-md p-6 sm:p-10 border-b border-slate-100 sticky top-0 z-10">
                    <DialogHeader>
                        <DialogTitle className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                            {project ? t("editTitle") : t("createTitle")}
                        </DialogTitle>
                        <DialogDescription className="text-sm sm:text-lg text-slate-500 font-medium mt-1 sm:mt-3 max-w-xl">
                            {project ? t("editDesc") : t("createDesc")}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-5 sm:p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 sm:space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 text-slate-900">
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2 sm:space-y-4">
                                            <FormLabel className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("statusLabel")}</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-white border-slate-100 shadow-sm font-bold text-slate-700 focus:ring-primary/20 transition-all text-sm sm:text-base">
                                                        <SelectValue placeholder={t("statusLabel")} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-2xl border-slate-100 p-2 shadow-2xl">
                                                    <SelectItem value="Active" className="rounded-xl font-bold py-3 text-emerald-600">{t("active")}</SelectItem>
                                                    <SelectItem value="Completed" className="rounded-xl font-bold py-3 text-blue-600">{t("completed")}</SelectItem>
                                                    <SelectItem value="Upcoming" className="rounded-xl font-bold py-3 text-slate-400">{t("upcoming")}</SelectItem>
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
                                            <FormLabel className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("categoryLabel")}</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-white border-slate-100 shadow-sm font-bold text-slate-700 focus:ring-primary/20 transition-all text-sm sm:text-base">
                                                        <SelectValue placeholder={t("categoryLabel")} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-2xl border-slate-100 p-2 shadow-2xl">
                                                    <SelectItem value="Environment" className="rounded-xl font-bold py-3">{tProj("filters.environment")}</SelectItem>
                                                    <SelectItem value="Health" className="rounded-xl font-bold py-3">{tProj("filters.health")}</SelectItem>
                                                    <SelectItem value="Education" className="rounded-xl font-bold py-3">{tProj("filters.education")}</SelectItem>
                                                    <SelectItem value="Humanitarian" className="rounded-xl font-bold py-3">{tProj("filters.humanitarian")}</SelectItem>
                                                    <SelectItem value="Infrastructure" className="rounded-xl font-bold py-3">{tProj("filters.infrastructure")}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-xs font-bold text-rose-500 pl-1" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem className="space-y-2 sm:space-y-4">
                                        <FormLabel className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("titleLabel")}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t("titlePlaceholder")} className="h-12 sm:h-16 rounded-xl sm:rounded-2xl bg-white border-slate-100 shadow-sm font-bold px-4 sm:px-8 text-base sm:text-lg focus-visible:ring-primary/20 focus-visible:border-primary transition-all placeholder:text-slate-300 placeholder:font-medium" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-xs font-bold text-rose-500 pl-1" />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 text-slate-900">
                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2 sm:space-y-4">
                                            <FormLabel className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("locationLabel")}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={t("locationPlaceholder")} className="h-12 sm:h-16 rounded-xl sm:rounded-2xl bg-white border-slate-100 shadow-sm font-bold px-4 sm:px-8 text-sm sm:text-base focus-visible:ring-primary/20 focus-visible:border-primary transition-all placeholder:text-slate-300" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-xs font-bold text-rose-500 pl-1" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="impact_stats"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2 sm:space-y-4">
                                            <FormLabel className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("impactLabel")}</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Target className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                                                    <Input placeholder="e.g. 50k Trees, 12 Wells" className="h-12 sm:h-16 rounded-xl sm:rounded-2xl bg-white border-slate-100 shadow-sm font-black pl-10 sm:pl-14 pr-4 sm:pr-8 text-sm sm:text-base focus-visible:ring-primary/20 focus-visible:border-primary transition-all placeholder:text-slate-300 placeholder:font-medium" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs font-bold text-rose-500 pl-1" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="space-y-2 sm:space-y-4">
                                        <FormLabel className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("descLabel")}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t("descPlaceholder")} className="h-12 sm:h-16 rounded-xl sm:rounded-2xl bg-white border-slate-100 shadow-sm font-bold px-4 sm:px-8 text-sm sm:text-base focus-visible:ring-primary/20 focus-visible:border-primary transition-all placeholder:text-slate-300" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-xs font-bold text-rose-500 pl-1" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="overview"
                                render={({ field }) => (
                                    <FormItem className="space-y-2 sm:space-y-4">
                                        <FormLabel className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("overviewLabel")}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={t("overviewPlaceholder")}
                                                className="min-h-[120px] sm:min-h-[160px] rounded-xl sm:rounded-[2rem] bg-white border-slate-100 shadow-sm font-medium p-4 sm:p-8 resize-none text-slate-600 leading-relaxed focus-visible:ring-primary/20 focus-visible:border-primary transition-all placeholder:text-slate-300 text-sm sm:text-base"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs font-bold text-rose-500 pl-1" />
                                    </FormItem>
                                )}
                            />

                            {/* Goals Dynamic List */}
                            <FormField
                                control={form.control}
                                name="goals"
                                render={() => (
                                    <FormItem className="space-y-2 sm:space-y-4">
                                        <FormLabel className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("goalsLabel")}</FormLabel>
                                        <div className="space-y-3">
                                            {goals.map((goal, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <Input
                                                        value={goal}
                                                        onChange={(e) => updateGoal(index, e.target.value)}
                                                        placeholder={`${t("goalPlaceholder")} ${index + 1}`}
                                                        className="h-10 sm:h-12 rounded-lg sm:rounded-xl bg-white border-slate-100 shadow-sm font-medium px-4 focus-visible:ring-primary/20 transition-all text-sm"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => removeGoal(index)}
                                                        className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl p-0 border-slate-100 text-rose-500 hover:bg-rose-50"
                                                    >
                                                        <X size={16} className="sm:size-[18px]" />
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={addGoal}
                                                className="w-full h-10 sm:h-12 rounded-lg sm:rounded-xl border-dashed border-2 border-slate-200 text-slate-400 hover:border-primary hover:text-primary transition-all bg-white text-xs sm:text-sm font-bold uppercase tracking-widest"
                                            >
                                                {t("addGoal")}
                                            </Button>
                                        </div>
                                        <FormMessage className="text-xs font-bold text-rose-500 pl-1" />
                                    </FormItem>
                                )}
                            />

                            {/* Achievements Dynamic List */}
                            <FormField
                                control={form.control}
                                name="achievements"
                                render={() => (
                                    <FormItem className="space-y-2 sm:space-y-4">
                                        <FormLabel className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("achievementsLabel")}</FormLabel>
                                        <div className="space-y-3">
                                            {achievements.map((achievement, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <Input
                                                        value={achievement}
                                                        onChange={(e) => updateAchievement(index, e.target.value)}
                                                        placeholder={`${t("achievementPlaceholder")} ${index + 1}`}
                                                        className="h-10 sm:h-12 rounded-lg sm:rounded-xl bg-white border-slate-100 shadow-sm font-medium px-4 focus-visible:ring-primary/20 transition-all text-sm"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => removeAchievement(index)}
                                                        className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl p-0 border-slate-100 text-rose-500 hover:bg-rose-50"
                                                    >
                                                        <X size={16} className="sm:size-[18px]" />
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={addAchievement}
                                                className="w-full h-10 sm:h-12 rounded-lg sm:rounded-xl border-dashed border-2 border-slate-200 text-slate-400 hover:border-primary hover:text-primary transition-all bg-white text-xs sm:text-sm font-bold uppercase tracking-widest"
                                            >
                                                {t("addAchievement")}
                                            </Button>
                                        </div>
                                        <FormMessage className="text-xs font-bold text-rose-500 pl-1" />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 text-slate-900">
                                <FormField
                                    control={form.control}
                                    name="start_date"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2 sm:space-y-4">
                                            <FormLabel className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("startDateLabel")}</FormLabel>
                                            <FormControl>
                                                <Input type="date" className="h-12 sm:h-16 rounded-xl sm:rounded-2xl bg-white border-slate-100 shadow-sm font-bold px-4 sm:px-8 text-sm sm:text-base focus-visible:ring-primary/20 focus-visible:border-primary transition-all" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-xs font-bold text-rose-500 pl-1" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="end_date"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2 sm:space-y-4">
                                            <FormLabel className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("endDateLabel")}</FormLabel>
                                            <FormControl>
                                                <Input type="date" className="h-12 sm:h-16 rounded-xl sm:rounded-2xl bg-white border-slate-100 shadow-sm font-bold px-4 sm:px-8 text-sm sm:text-base focus-visible:ring-primary/20 focus-visible:border-primary transition-all" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-xs font-bold text-rose-500 pl-1" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="image_url"
                                render={({ field }) => (
                                    <FormItem className="space-y-2 sm:space-y-4">
                                        <FormLabel className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">{t("uploadLabel")}</FormLabel>
                                        <FormControl>
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className={cn(
                                                    "relative aspect-[21/9] rounded-2xl sm:rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-white hover:border-primary/50 group overflow-hidden shadow-sm hover:shadow-xl",
                                                    (previewUrl || field.value) && "border-none shadow-2xl"
                                                )}
                                            >
                                                {isUploading ? (
                                                    <div className="flex flex-col items-center gap-2 lg:gap-4">
                                                        <Loader2 className="w-8 h-8 lg:w-10 lg:h-10 text-primary animate-spin" />
                                                        <span className="text-[10px] lg:text-xs font-black uppercase tracking-widest text-primary animate-pulse italic">{t("uploadingBanner")}</span>
                                                    </div>
                                                ) : (previewUrl || field.value) ? (
                                                    <>
                                                        <img src={previewUrl || getImageUrl(field.value)} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                                            <div className="bg-white/90 backdrop-blur-md p-3 lg:p-4 rounded-full shadow-2xl transform scale-75 group-hover:scale-100 transition-all duration-500">
                                                                <Upload className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setPreviewUrl("");
                                                                field.onChange("");
                                                            }}
                                                            className="absolute top-2 lg:top-6 right-2 lg:right-6 p-2 lg:p-2.5 bg-rose-500 text-white rounded-full shadow-2xl hover:bg-rose-600 transition-all z-20 scale-90 lg:scale-100"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-2 lg:gap-4 text-slate-400 group-hover:text-primary transition-all duration-500">
                                                        <div className="p-4 lg:p-6 bg-white rounded-xl lg:rounded-[2rem] shadow-xl shadow-slate-200/50 transition-transform duration-500 group-hover:scale-110">
                                                            <ImageIcon size={24} className="text-primary lg:size-[32px]" />
                                                        </div>
                                                        <span className="text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] leading-relaxed italic text-center px-4 lg:px-10">{t("selectBanner")}</span>
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

                            <DialogFooter className="pt-6 sm:pt-10 border-t border-slate-50 mt-6 sm:mt-10 flex flex-col sm:flex-row gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => onOpenChange(false)}
                                    className="h-12 sm:h-16 px-6 sm:px-10 rounded-xl sm:rounded-2xl text-slate-500 font-bold hover:bg-slate-100 transition-all text-sm sm:text-base w-full sm:w-auto order-2 sm:order-1"
                                >
                                    {commonT("cancel")}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || isUploading}
                                    className="h-12 sm:h-16 px-8 sm:px-14 rounded-xl sm:rounded-2xl bg-primary shadow-2xl shadow-primary/30 hover:shadow-primary/50 font-black text-base sm:text-lg transition-all w-full sm:w-auto min-w-0 sm:min-w-[200px] order-1 sm:order-2"
                                >
                                    {isSubmitting || isUploading ? (
                                        <div className="flex items-center gap-3">
                                            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                            <span className="animate-pulse italic text-sm sm:text-base">{t("synchronizing")}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            {project ? t("update") : t("save")}
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
