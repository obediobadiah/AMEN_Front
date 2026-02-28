"use client";

import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { useTranslations, useLocale } from "next-intl";
import { images } from "@/lib/images";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, ArrowLeft, CheckCircle, Target, Zap, Users, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useProjects } from "@/hooks/use-projects";
import { getImageUrl } from "@/lib/api-config";
import { formatImpact } from "@/lib/utils";

interface ProjectDetailProps {
    id: string;
}

export default function ProjectDetail({ id }: ProjectDetailProps) {
    const t = useTranslations();
    const locale = useLocale() as "en" | "fr";
    const { projects, isLoading } = useProjects();

    const projectData = projects.find(p => p.id.toString() === id);

    if (isLoading) {
        return (
            <Layout>
                <div className="py-24 flex justify-center items-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </Layout>
        );
    }

    if (!projectData) {
        return (
            <Layout>
                <div className="py-24 text-center">
                    <h2 className="text-2xl font-bold">{t('projectsPage.notFound')}</h2>
                    <Link href="/activities/projects">
                        <Button className="mt-4">{t('projectsPage.backToProjects')}</Button>
                    </Link>
                </div>
            </Layout>
        );
    }

    const project = {
        title: projectData.title[locale] || projectData.title.fr || projectData.title.en,
        description: projectData.description ? (projectData.description[locale] || projectData.description.fr || projectData.description.en) : "",
        location: projectData.location ? (projectData.location[locale] || projectData.location.fr || projectData.location.en) : "",
        date: projectData.start_date ? new Date(projectData.start_date).getFullYear().toString() : "",
        category: projectData.category ? ((projectData.category as any)[locale] || (projectData.category as any).fr || (projectData.category as any).en) : "General",
        overview: projectData.overview ? (projectData.overview[locale] || projectData.overview.fr || projectData.overview.en) : "",
        goals: projectData.goals ? (projectData.goals[locale] || projectData.goals.fr || projectData.goals.en || []) : [],
        achievements: projectData.achievements ? (projectData.achievements[locale] || projectData.achievements.fr || projectData.achievements.en || []) : [],
        impact: formatImpact(projectData.impact_stats ? (projectData.impact_stats[locale] || projectData.impact_stats.fr || projectData.impact_stats.en) : ""),
        image: projectData.image_url ? getImageUrl(projectData.image_url) : images.news3,
    };

    return (
        <Layout>
            <article className="pb-24">
                <PageHero
                    title={project.title}
                    subtitle={project.description}
                    image={project.image}
                    className="min-h-[50vh]"
                />

                <div className="container mx-auto px-6 -mt-16 relative z-20">
                    <div className="max-w-5xl mx-auto">
                        {/* Quick Stats Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
                        >
                            <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-xl backdrop-blur-xl flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-50">{t('projectsPage.detail.location')}</p>
                                    <p className="font-bold text-foreground">{project.location}</p>
                                </div>
                            </div>
                            <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-xl backdrop-blur-xl flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-50">{t('projectsPage.detail.duration')}</p>
                                    <p className="font-bold text-foreground">{project.date}</p>
                                </div>
                            </div>
                            <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-xl backdrop-blur-xl flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-50">{t('projectsPage.detail.sector')}</p>
                                    <p className="font-bold text-foreground">{project.category}</p>
                                </div>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-12">
                                <section className="bg-card rounded-[2.5rem] p-8 md:p-12 border border-border/50 shadow-sm">
                                    <h2 className="text-3xl font-heading font-bold mb-6 flex items-center gap-3">
                                        <Target className="text-primary" /> {t('projectsPage.detail.overview')}
                                    </h2>
                                    <p className="text-muted-foreground text-lg leading-relaxed font-light">
                                        {project.overview}
                                    </p>
                                </section>

                                {project.goals && project.goals.length > 0 && (
                                    <section className="bg-card rounded-[2.5rem] p-8 md:p-12 border border-border/50 shadow-sm">
                                        <h2 className="text-3xl font-heading font-bold mb-8 flex items-center gap-3">
                                            <Users className="text-primary" /> {t('projectsPage.detail.goals')}
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {project.goals.map((goal: string, idx: number) => (
                                                <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-muted/50 border border-border/30">
                                                    <CheckCircle className="text-primary shrink-0 mt-1" size={20} />
                                                    <span className="font-medium text-foreground/90">{goal}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {project.achievements && project.achievements.length > 0 && (
                                    <section className="bg-card rounded-[2.5rem] p-8 md:p-12 border border-border/50 shadow-sm">
                                        <h2 className="text-3xl font-heading font-bold mb-8 flex items-center gap-3">
                                            <BarChart3 className="text-primary" /> {t('projectsPage.detail.achievements')}
                                        </h2>
                                        <ul className="space-y-6">
                                            {project.achievements.map((achievement: string, idx: number) => (
                                                <li key={idx} className="flex items-start gap-4 group">
                                                    <div className="w-2 h-2 rounded-full bg-primary mt-3 group-hover:scale-150 transition-transform shadow-lg shadow-primary/50" />
                                                    <p className="text-muted-foreground text-lg group-hover:text-foreground transition-colors">{achievement}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </section>
                                )}
                            </div>

                            {/* Sidebar / Impact */}
                            <div className="space-y-8">
                                <div className="bg-slate-950 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
                                    <h3 className="text-2xl font-heading font-bold mb-6">{t('projectsPage.detail.socialImpact')}</h3>
                                    <p className="text-slate-400 leading-relaxed mb-8">
                                        {project.impact}
                                    </p>
                                    <Link href="/get-involved">
                                        <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest text-xs">
                                            {t('projectsPage.detail.cta')}
                                        </Button>
                                    </Link>
                                </div>

                                <div className="bg-card rounded-[2.5rem] p-8 border border-border/50 flex flex-col items-center text-center space-y-6">
                                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                        <ArrowLeft className="text-muted-foreground" />
                                    </div>
                                    <h4 className="font-bold">{t('projectsPage.detail.exploreTitle')}</h4>
                                    <Link href="/activities/projects">
                                        <Button variant="outline" className="rounded-full px-8">
                                            {t('projectsPage.detail.viewAll')}
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </Layout>
    );
}
