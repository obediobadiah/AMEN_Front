"use client";

import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { useTranslations } from 'next-intl';
import { images } from "@/lib/images";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users,
    Briefcase,
    Handshake,
    Megaphone,
    Heart,
    Target,
    ShieldCheck,
    Globe,
    ArrowRight,
    CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function GetInvolved() {
    const t = useTranslations();

    return (
        <Layout>
            <PageHero
                title={t('getInvolvedPage.title')}
                subtitle={t('getInvolvedPage.subtitle')}
                image={images.heroGetInvolved}
            />

            {/* Intro Section */}
            <section className="py-20 md:py-32 bg-background relative overflow-hidden">
                <div className="absolute -top-12 -left-12 md:-top-24 md:-left-24 w-64 h-64 md:w-96 md:h-96 bg-primary/10 rounded-full blur-[80px] md:blur-[120px] -z-10" />
                <div className="absolute top-1/2 right-0 w-1/2 md:w-1/3 h-1/2 bg-secondary/5 -skew-x-12 translate-x-1/2 blur-3xl -z-10" />

                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center space-y-8 md:space-y-10">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-3 px-5 py-1.5 md:px-6 md:py-2 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-bold tracking-widest uppercase border border-primary/20 backdrop-blur-sm"
                        >
                            <Heart size={16} className="md:w-[18px] md:h-[18px] animate-pulse" />
                            <span>{t('nav.getInvolved')}</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-4xl sm:text-5xl md:text-7xl font-heading font-black text-foreground leading-[1.1] tracking-tight"
                        >
                            {t('getInvolvedPage.subtitle')}
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-lg md:text-2xl leading-relaxed text-muted-foreground font-light"
                        >
                            {t('getInvolvedPage.intro')}
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Bento Grid - Ways to Help */}
            <section className="pb-20 md:pb-32 bg-background">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:auto-rows-[350px]">
                        {/* Volunteer - Main Featured Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="md:col-span-8 md:row-span-2 group relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem] bg-slate-950 border border-white/10 shadow-2xl min-h-[450px] md:min-h-0"
                        >
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={images.news1}
                                    className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-1000"
                                    alt=""
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 md:via-slate-950/40 to-transparent" />
                            </div>
                            <div className="relative z-10 p-8 md:p-16 h-full flex flex-col justify-end space-y-6">
                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                    <Users size={28} className="md:w-8 md:h-8" />
                                </div>
                                <div className="space-y-4 max-w-2xl">
                                    <h3 className="text-3xl md:text-5xl font-heading font-bold text-white tracking-tight">
                                        {t('getInvolvedPage.volunteer.title')}
                                    </h3>
                                    <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
                                        {t('getInvolvedPage.volunteer.description')}
                                    </p>
                                </div>
                                <div className="pt-2 md:pt-4">
                                    <Button className="w-full sm:w-auto h-12 md:h-14 px-8 md:px-10 rounded-xl md:rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-base md:text-lg shadow-xl shadow-primary/20 group/btn transition-all hover:-translate-y-1">
                                        {t('getInvolvedPage.volunteer.cta')} <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover/btn:translate-x-2" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Careers */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="md:col-span-4 group relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem] bg-emerald-500/5 border border-emerald-500/20 p-8 md:p-10 flex flex-col justify-between hover:bg-emerald-500/10 transition-colors min-h-[300px] md:min-h-0"
                        >
                            <div className="absolute -top-12 -right-12 text-emerald-500/5 rotate-12 scale-150 transform">
                                <Briefcase size={200} />
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <Briefcase size={24} />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold font-heading text-foreground">
                                    {t('getInvolvedPage.careers.title')}
                                </h3>
                                <p className="text-muted-foreground line-clamp-3 md:line-clamp-none lg:line-clamp-4">
                                    {t('getInvolvedPage.careers.description')}
                                </p>
                                <Button variant="link" className="p-0 h-auto text-emerald-600 font-bold group/btn text-base">
                                    {t('getInvolvedPage.careers.cta')} <ArrowRight size={18} className="ml-2 transition-transform group-hover/btn:translate-x-1" />
                                </Button>
                            </div>
                        </motion.div>

                        {/* Partnerships */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="md:col-span-4 group relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem] bg-amber-500/5 border border-amber-500/20 p-8 md:p-10 flex flex-col justify-between hover:bg-amber-500/10 transition-colors min-h-[300px] md:min-h-0"
                        >
                            <div className="absolute -bottom-12 -right-12 text-amber-500/5 -rotate-12 scale-150 transform">
                                <Handshake size={200} />
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
                                <Handshake size={24} />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold font-heading text-foreground">
                                    {t('getInvolvedPage.partnerships.title')}
                                </h3>
                                <p className="text-muted-foreground line-clamp-3 md:line-clamp-none lg:line-clamp-4">
                                    {t('getInvolvedPage.partnerships.description')}
                                </p>
                                <Button variant="link" className="p-0 h-auto text-amber-600 font-bold group/btn text-base">
                                    {t('getInvolvedPage.partnerships.cta')} <ArrowRight size={18} className="ml-2 transition-transform group-hover/btn:translate-x-1" />
                                </Button>
                            </div>
                        </motion.div>

                        {/* Advocacy - Bottom Wide Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="md:col-span-12 group relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem] bg-rose-500/5 border border-rose-500/20 p-8 md:px-16 md:py-12 flex flex-col lg:flex-row items-center lg:justify-between gap-8 hover:bg-rose-500/10 transition-colors"
                        >
                            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-left">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-2xl shadow-rose-500/30 flex-shrink-0 animate-bounce-slow">
                                    <Megaphone size={28} className="md:w-8 md:h-8" />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-2xl md:text-3xl font-bold font-heading text-foreground">
                                        {t('getInvolvedPage.advocacy.title')}
                                    </h3>
                                    <p className="text-muted-foreground text-base md:text-lg max-w-xl">
                                        {t('getInvolvedPage.advocacy.description')}
                                    </p>
                                </div>
                            </div>
                            <Button className="w-full lg:w-auto h-12 md:h-14 px-8 md:px-10 rounded-xl md:rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-base md:text-lg shadow-xl shadow-rose-500/20 shrink-0 transform hover:rotate-2 transition-all">
                                {t('getInvolvedPage.advocacy.cta')}
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* How to Start - Process Section */}
            <section className="py-20 md:py-32 bg-slate-950 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center space-y-4 md:space-y-6 mb-16 md:mb-24">
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-heading font-bold text-white uppercase tracking-tighter">
                            {t.rich('getInvolvedPage.process.title', {
                                emphasis: (chunks) => <span className="text-primary">{chunks}</span>
                            })}
                        </h2>
                        <div className="w-16 md:w-24 h-1 bg-primary mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[60px] md:left-[10%] md:right-[10%] lg:left-[15%] lg:right-[15%] h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />

                        {[
                            { step: "01", key: "step1", icon: Megaphone },
                            { step: "02", key: "step2", icon: Target },
                            { step: "03", key: "step3", icon: Heart }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="relative z-10 text-center space-y-6 md:space-y-8 group"
                            >
                                <div className="relative mx-auto w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-white/5 rounded-[2rem] md:rounded-[2.5rem] rotate-12 group-hover:rotate-45 group-hover:bg-primary transition-all duration-700" />
                                    <div className="absolute inset-0 bg-white/5 rounded-[2rem] md:rounded-[2.5rem] -rotate-12 group-hover:rotate-90 transition-all duration-700 delay-100" />
                                    <div className="relative text-white font-heading font-black text-3xl md:text-4xl">
                                        {item.step}
                                    </div>
                                </div>
                                <div className="space-y-3 md:space-y-4 px-4 md:px-0">
                                    <h4 className="text-xl md:text-2xl font-bold text-white group-hover:text-primary transition-colors">
                                        {t(`getInvolvedPage.process.${item.key}.title`)}
                                    </h4>
                                    <p className="text-sm md:text-base text-slate-400 px-2 lg:px-6">
                                        {t(`getInvolvedPage.process.${item.key}.desc`)}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Join Section - Unique Stats Look */}
            <section className="py-20 md:py-32 bg-background relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16 md:gap-20">
                        <div className="w-full lg:w-1/2 space-y-10">
                            <div className="space-y-6 text-center lg:text-left">
                                <h2 className="text-4xl sm:text-5xl md:text-7xl font-heading font-black text-foreground leading-none">
                                    {t('getInvolvedPage.impactTitle')}
                                </h2>
                                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
                                    {t('getInvolvedPage.impactDesc')}
                                </p>
                            </div>

                            <div className="space-y-4 md:space-y-6">
                                {[
                                    { title: "Local Solutions", desc: "We prioritize community-led initiatives that ensure long-term sustainability." },
                                    { title: "Transparency", desc: "Clear reporting and accountability in everything we do." }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex flex-col sm:flex-row gap-4 sm:gap-6 group p-6 md:p-8 rounded-[2rem] hover:bg-muted/50 transition-all border border-transparent hover:border-border text-center sm:text-left items-center sm:items-start">
                                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                                            <CheckCircle2 size={24} className="md:w-7 md:h-7" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg md:text-xl font-bold text-foreground mb-1 md:mb-2">{item.title}</h4>
                                            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
                            {/* Decorative Backdrop */}
                            <div className="absolute inset-0 bg-primary/20 blur-[100px] -z-10 rounded-full scale-125" />

                            {[
                                { label: t('getInvolvedPage.stats.volunteers'), value: "1,200+", icon: Users, color: "bg-blue-500" },
                                { label: t('getInvolvedPage.stats.partners'), value: "45+", icon: Globe, color: "bg-emerald-500" },
                                { label: t('getInvolvedPage.stats.communities'), value: "85+", icon: Target, color: "bg-amber-500" },
                                { label: "Success Rate", value: "98%", icon: ShieldCheck, color: "bg-primary" }
                            ].map((stat, idx) => (
                                <Card
                                    key={idx}
                                    className={cn(
                                        "relative h-56 md:h-64 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 flex flex-col justify-end border-none shadow-2xl overflow-hidden group bg-card",
                                        (idx === 1 || idx === 3) ? "sm:mt-8 md:mt-12" : ""
                                    )}
                                >
                                    <div className={cn("absolute top-0 right-0 w-32 h-32 m-[-20px] rounded-full blur-2xl opacity-20", stat.color)} />
                                    <div className="relative z-10 space-y-4 text-center sm:text-left">
                                        <div className={cn("w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-black/10 group-hover:scale-110 transition-transform mx-auto sm:mx-0", stat.color)}>
                                            <stat.icon size={24} className="md:w-7 md:h-7" />
                                        </div>
                                        <div>
                                            <div className="text-3xl md:text-4xl font-black text-foreground group-hover:text-primary transition-colors">{stat.value}</div>
                                            <div className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section - High Impact */}
            <section className="py-16 md:py-24 bg-background">
                <div className="container mx-auto px-6">
                    <div className="bg-primary rounded-[3rem] md:rounded-[4rem] px-8 py-16 md:px-10 md:py-32 text-center text-white relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(var(--primary),0.3)]">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.2),transparent)]" />
                        <div className="relative z-10 max-w-4xl mx-auto space-y-8 md:space-y-12">
                            <h2 className="text-3xl sm:text-4xl md:text-7xl font-heading font-black leading-tight px-4 md:px-0">
                                {t('home.cta.title')} <span className="text-slate-900">{t('home.cta.titleHighlight')}</span>
                            </h2>
                            <p className="text-lg md:text-2xl text-white/80 font-light max-w-3xl mx-auto italic px-4 md:px-0">
                                "{t('home.cta.description')}"
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6 px-6">
                                <Button className="w-full sm:w-auto h-16 md:h-20 px-10 md:px-16 rounded-2xl md:rounded-[2rem] bg-white hover:bg-slate-100 text-primary font-black text-lg md:text-xl shadow-2xl transition-all hover:-translate-y-2">
                                    {t('home.cta.joinNow')}
                                </Button>
                                <Button variant="outline" className="w-full sm:w-auto h-16 md:h-20 px-10 md:px-16 rounded-2xl md:rounded-[2rem] border-2 border-white/30 hover:border-white text-white font-black text-lg md:text-xl hover:bg-white/10 transition-all">
                                    {t('home.cta.contactUs')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
