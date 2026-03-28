"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { GovernanceMember } from "@/hooks/use-governance";
import { getImageUrl } from "@/lib/api-config";
import { useLocale, useTranslations } from "next-intl";
import {
    User, Shield, Briefcase, Settings, Landmark, Award,
    Gavel, Building2, Crown, Wrench, Heart, Users2, X,
    MapPin, Mail, Calendar, Quote, ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface MemberDetailDialogProps {
    member: GovernanceMember | null;
    isOpen: boolean;
    onClose: () => void;
}

const ORGAN_ICONS: Record<string, any> = {
    ag: Landmark,
    cd: Shield,
    pe: Briefcase,
    dg: Settings,
    dirigeante: Crown,
    technique: Wrench,
    volontaires: Heart,
};

const ORGAN_COLORS: Record<string, string> = {
    ag: "text-blue-600 bg-blue-50",
    cd: "text-indigo-600 bg-indigo-50",
    pe: "text-amber-600 bg-amber-50",
    dg: "text-emerald-600 bg-emerald-50",
    dirigeante: "text-amber-600 bg-amber-50",
    technique: "text-blue-600 bg-blue-50",
    volontaires: "text-emerald-600 bg-emerald-50",
};

export function MemberDetailDialog({ member, isOpen, onClose }: MemberDetailDialogProps) {
    const locale = useLocale();
    const t = useTranslations("aboutPage.governance");
    const tHR = useTranslations("aboutPage.humanResources.team");
    const tDetail = useTranslations("about.memberDetail");

    if (!member) return null;

    const role = (member.role as any)?.[locale] || member.role?.fr || member.role?.en || "";
    const bio = member.bio ? ((member.bio as any)?.[locale] || member.bio.fr || member.bio.en || "") : "";
    const organId = member.organ_id || "";
    const Icon = ORGAN_ICONS[organId] || User;
    const colorClass = ORGAN_COLORS[organId] || "text-slate-600 bg-slate-50";

    const isHR = member.group_type === "hr";
    const organLabel = isHR
        ? tHR(`categories.${organId}`)
        : t(`organs.${organId}.title`);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[1200px] p-0 overflow-hidden border-none bg-white rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] select-none">
                <div className="relative flex flex-col lg:flex-row h-[90vh] lg:h-[750px] overflow-hidden">
                    {/* Mobile Close */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 z-50 p-4 bg-black/30 backdrop-blur-2xl rounded-full text-white hover:bg-white hover:text-primary transition-all duration-500 lg:hidden shadow-2xl"
                    >
                        <X size={24} />
                    </button>

                    {/* Left Portfolio Section */}
                    <div className="w-full lg:w-[42%] relative overflow-hidden bg-slate-950 group h-[400px] lg:h-full shrink-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, scale: 1.15 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                className="absolute inset-0"
                            >
                                {member.photo_url ? (
                                    <img
                                        src={getImageUrl(member.photo_url)}
                                        alt={member.name}
                                        className="w-full h-full object-cover transition-all duration-[3000ms] group-hover:scale-110 filter brightness-90 group-hover:brightness-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                                        <User size={200} className="text-white/5 animate-pulse" />
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* High-End Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10" />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-transparent to-transparent z-10" />
                        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 z-20" />

                        {/* Identity Signature */}
                        <div className="absolute bottom-10 left-10 right-10 z-30">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                className="space-y-6"
                            >
                                <div className={cn(
                                    "inline-flex items-center gap-3 px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl backdrop-blur-xl border border-white/10",
                                    "bg-white/95 text-slate-950"
                                )}>
                                    <Icon size={14} className="text-primary animate-pulse" />
                                    {organLabel}
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-5xl font-black text-white leading-tight tracking-tighter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                                        {member.name}
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        <div className="h-[2px] w-24 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                                        <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Vertical Accent */}
                        <div className="absolute top-10 left-10 z-20 hidden lg:block">
                            <span className="text-white/20 font-black text-[80px] leading-none select-none pointer-events-none uppercase tracking-tighter italic origin-top-left -rotate-90 translate-y-full opacity-10">
                                AMEN
                            </span>
                        </div>
                    </div>

                    {/* Right Biography Section */}
                    <div className="w-full lg:w-[58%] bg-white relative flex flex-col h-full overflow-hidden">
                        {/* Header Actions - Fixed at top of right section */}
                        <div className="flex items-center justify-between p-8 lg:px-16 lg:py-10 pb-0 shrink-0 z-30 bg-white/80 backdrop-blur-md">
                            <button
                                onClick={onClose}
                                className="flex items-center gap-4 text-slate-400 font-extrabold text-[11px] uppercase tracking-[0.4em] hover:text-primary transition-all duration-500 group"
                            >
                                <div className="w-10 h-10 rounded-2xl border border-slate-100 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 group-hover:rotate-[-5deg] transition-all duration-500 shadow-sm">
                                    <ChevronLeft size={18} />
                                </div>
                                <span className="group-hover:translate-x-1 transition-transform">{tDetail("backToTeam")}</span>
                            </button>
                            <button
                                onClick={onClose}
                                className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-950 hover:text-white transition-all duration-500 hidden lg:flex shadow-sm hover:shadow-2xl hover:-translate-y-1"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* Content Scrollable Area */}
                        <div className="flex-1 overflow-y-auto px-8 lg:px-16 py-12 custom-scrollbar">
                            <div className="max-w-3xl space-y-16 pb-12">
                                {/* Role Spotlight */}
                                <motion.section
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="relative"
                                >
                                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/20 to-transparent rounded-full opacity-50" />
                                    <div className="pl-6 space-y-4">
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60 block">
                                            {tDetail("roleLabel")}
                                        </span>
                                        <h3 className="text-4xl lg:text-5xl font-black text-slate-900 leading-[1.1] tracking-tighter">
                                            {role}
                                        </h3>
                                    </div>
                                </motion.section>

                                {/* Detailed Biography - Editorial Style */}
                                {bio && (
                                    <motion.section
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="space-y-10"
                                    >
                                        <div className="flex items-center gap-6">
                                            <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-300">
                                                {tDetail("biography")}
                                            </h4>
                                            <div className="h-[1px] flex-1 bg-slate-100" />
                                        </div>

                                        <div className="relative group p-10 rounded-[3rem] bg-slate-50/50 border border-slate-100/50 hover:bg-white hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] transition-all duration-700">
                                            <div className="relative z-10">
                                                <p className="font-small">
                                                    {bio}
                                                </p>
                                            </div>

                                            <div className="absolute -bottom-6 -right-4 text-slate-100 opacity-50 transform rotate-180">
                                                <Quote size={60} fill="currentColor" stroke="none" />
                                            </div>
                                        </div>
                                    </motion.section>
                                )}

                                {/* Key Information Grid */}
                                <motion.section
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8"
                                >
                                    <div className="group relative">
                                        <div className="absolute inset-0 bg-primary/5 rounded-[2.5rem] scale-95 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                                        <div className="relative p-10 rounded-[2.5rem] bg-white border border-slate-100 flex flex-col gap-6 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-700">
                                            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-700 group-hover:rotate-[15deg] group-hover:scale-110 shadow-lg", colorClass)}>
                                                <Icon size={30} />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block mb-2">{tDetail("organLabel")}</span>
                                                <span className="text-xl font-black text-slate-900 tracking-tight">{organLabel}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="group relative">
                                        <div className="absolute inset-0 bg-primary/5 rounded-[2.5rem] scale-95 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                                        <div className="relative p-10 rounded-[2.5rem] bg-white border border-slate-100 flex flex-col gap-6 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-700">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-950 flex items-center justify-center text-white shadow-xl transition-all duration-700 group-hover:rotate-[-10deg] group-hover:scale-110">
                                                <Calendar size={30} />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block mb-2">{tDetail("sinceLabel")}</span>
                                                <span className="text-xl font-black text-slate-900 tracking-tight">
                                                    {member.created_at ? new Date(member.created_at).getFullYear() : tDetail("activeStatus")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.section>

                                {/* Footer Contact CTA - Optional Placeholder */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.9 }}
                                    className="pt-10 flex flex-col items-center gap-10"
                                >
                                    <div className="w-24 h-[1px] bg-slate-100" />
                                    <button
                                        onClick={onClose}
                                        className="w-full lg:w-auto px-20 py-7 bg-slate-950 text-white rounded-[2.5rem] font-black uppercase tracking-[0.5em] text-[11px] shadow-2xl hover:bg-primary hover:-translate-y-2 transition-all duration-500 active:scale-95"
                                    >
                                        {tDetail("closeButton")}
                                    </button>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
