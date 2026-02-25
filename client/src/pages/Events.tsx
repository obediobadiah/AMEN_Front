"use client";

import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { useTranslations, useLocale } from 'next-intl';
import { images } from "@/lib/images";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, MapPin, Clock, ArrowRight, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useEvents } from "@/hooks/use-events";
import { format } from "date-fns";
import { getImageUrl } from "@/lib/api-config";

export default function Events() {
    const t = useTranslations();
    const locale = useLocale();
    const [view, setView] = useState("upcoming");
    const { events, isLoading } = useEvents();

    const upcomingEvents = events.filter((e) => e.status === "Upcoming" || e.status === "À venir");
    // Sort them by soonest to latest
    upcomingEvents.sort((a, b) => {
        if (!a.start_date) return 1;
        if (!b.start_date) return -1;
        return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
    });

    return (
        <Layout>
            <PageHero
                title={t('eventsPage.title')}
                subtitle={t('eventsPage.subtitle')}
                image={images.news1}
            />

            <section className="py-24 bg-background relative overflow-hidden">
                {/* Background accents */}
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 -skew-x-12 translate-x-1/2 -z-10 blur-3xl" />

                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-20">
                        {/* Sidebar/Info */}
                        <div className="lg:w-1/3 space-y-12">
                            <div className="space-y-8">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    className="w-20 h-2 bg-primary rounded-full"
                                />
                                <h2 className="text-5xl md:text-6xl font-heading font-black text-foreground leading-[0.9] tracking-tight">
                                    {t('eventsPage.upcoming')}
                                </h2>
                                <p className="text-xl text-muted-foreground font-light leading-relaxed max-w-sm">
                                    {t('eventsPage.intro')}
                                </p>
                            </div>

                            <div className="p-10 bg-slate-950 rounded-[3rem] border border-white/10 space-y-8 relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[60px] -z-0" />
                                <div className="relative z-10 space-y-6">
                                    <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/30">
                                        <Bell size={32} />
                                    </div>
                                    <h4 className="text-2xl font-black font-heading text-white">{t('footer.newsletter')}</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed font-light">
                                        {t('footer.newsletterDescription')}
                                    </p>
                                    <form className="space-y-4">
                                        <input
                                            type="email"
                                            placeholder={t('footer.emailPlaceholder')}
                                            className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 px-6 text-sm text-white focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                                        />
                                        <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
                                            {t('footer.subscribe')}
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Events List */}
                        <div className="lg:w-2/3 space-y-8">
                            {isLoading ? (
                                <div className="py-20 flex justify-center">
                                    <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                                </div>
                            ) : upcomingEvents.length === 0 ? (
                                <div className="py-20 flex justify-center text-slate-500 font-medium">
                                    No upcoming events found.
                                </div>
                            ) : upcomingEvents.map((event, idx) => {
                                const startDate = event.start_date ? new Date(event.start_date) : null;
                                const endDate = event.end_date ? new Date(event.end_date) : null;

                                const titleStr = (event.title as any)?.[locale] || event.title?.fr || event.title?.en || "";
                                const descStr = event.description ? ((event.description as any)?.[locale] || event.description?.fr || event.description?.en || "") : "";
                                const locStr = event.location ? ((event.location as any)?.[locale] || event.location?.fr || event.location?.en || "") : "";

                                return (
                                    <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="group relative bg-card rounded-[3rem] border-4 border-border/40 p-8 md:p-12 hover:border-primary/40 hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] transition-all duration-700 overflow-hidden"
                                    >
                                        {/* Date Column (Left on desktop) */}
                                        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
                                            {/* Date Badge */}
                                            <div className="relative shrink-0">
                                                <div className="w-24 h-24 md:w-28 md:h-28 rounded-[2rem] bg-muted group-hover:bg-primary transition-all duration-700 flex flex-col items-center justify-center border border-border/50 group-hover:border-primary group-hover:shadow-2xl group-hover:shadow-primary/30">
                                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-white/70 transition-colors">
                                                        {startDate ? format(startDate, "MMM") : "-"}
                                                    </span>
                                                    <span className="text-4xl md:text-5xl font-black font-heading text-foreground group-hover:text-white transition-colors">
                                                        {startDate ? format(startDate, "dd") : "-"}
                                                    </span>
                                                </div>
                                                {/* Status Dot */}
                                                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-4 border-card group-hover:scale-125 transition-transform" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-grow space-y-6 w-full">
                                                {event.thumbnail_url && (
                                                    <div className="w-full h-48 md:h-64 rounded-3xl overflow-hidden mb-6 relative shadow-lg">
                                                        <img
                                                            src={getImageUrl(event.thumbnail_url)}
                                                            alt={titleStr}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                                                    </div>
                                                )}
                                                <div className="flex flex-wrap items-center gap-4">
                                                    <span className="px-5 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20">
                                                        {event.category || "Event"}
                                                    </span>
                                                </div>

                                                <h3 className="text-3xl md:text-4xl font-heading font-black text-foreground group-hover:text-primary transition-colors leading-tight">
                                                    {titleStr}
                                                </h3>

                                                <p className="text-xl text-muted-foreground leading-relaxed font-light line-clamp-2">
                                                    {descStr}
                                                </p>

                                                <div className="flex flex-wrap gap-8 pt-6 border-t border-border/30">
                                                    <div className="flex items-center gap-4 text-sm font-bold text-foreground/70">
                                                        <div className="w-12 h-12 rounded-2xl bg-muted group-hover:bg-primary/10 flex items-center justify-center text-primary transition-all">
                                                            <MapPin size={20} />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('eventsPage.location')}</span>
                                                            <span className="text-base">{locStr || "-"}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm font-bold text-foreground/70">
                                                        <div className="w-12 h-12 rounded-2xl bg-muted group-hover:bg-primary/10 flex items-center justify-center text-primary transition-all">
                                                            <Clock size={20} />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('eventsPage.date')}</span>
                                                            <span className="text-base">{startDate ? format(startDate, "hh:mm a") : "-"} {endDate ? `- ${format(endDate, "hh:mm a")}` : ""}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="pt-4">
                                                    {event.registration_link ? (
                                                        <a href={event.registration_link} target="_blank" rel="noopener noreferrer">
                                                            <Button className="h-14 px-10 rounded-2xl bg-foreground hover:bg-primary text-background font-black uppercase tracking-widest text-xs transition-all flex items-center gap-4 group/btn shadow-xl shadow-black/10 hover:-translate-y-1">
                                                                {t('eventsPage.register')}
                                                                <ArrowRight size={20} className="transition-transform group-hover/btn:translate-x-2" />
                                                            </Button>
                                                        </a>
                                                    ) : (
                                                        <Button disabled className="h-14 px-10 rounded-2xl bg-muted text-muted-foreground font-black uppercase tracking-widest text-xs transition-all flex items-center gap-4 group/btn shadow-xl shadow-black/10">
                                                            No Registration Link
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
