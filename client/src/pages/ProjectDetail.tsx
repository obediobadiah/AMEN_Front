"use client";

import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { useTranslations } from "next-intl";
import { images } from "@/lib/images";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, ArrowLeft, CheckCircle, Target, Zap, Users, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface ProjectDetailProps {
    id: string;
}

export default function ProjectDetail({ id }: ProjectDetailProps) {
    const t = useTranslations();

    // Basic validation for ID
    const projectId = (parseInt(id) >= 1 && parseInt(id) <= 4) ? id : "1";

    const project = {
        title: t(`projectsPage.items.${projectId}.title`),
        description: t(`projectsPage.items.${projectId}.description`),
        location: t(`projectsPage.items.${projectId}.location`),
        date: t(`projectsPage.items.${projectId}.date`),
        category: t(`projectsPage.items.${projectId}.category`),
        overview: t(`projectsPage.items.${projectId}.details.overview`),
        goals: t.raw(`projectsPage.items.${projectId}.details.goals`),
        achievements: t.raw(`projectsPage.items.${projectId}.details.achievements`),
        impact: t(`projectsPage.items.${projectId}.details.impact`),
        // Mapping images based on ID
        image: projectId === "1" ? images.programNature :
            projectId === "2" ? images.news2 :
                projectId === "3" ? images.programWomen : images.news3,
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
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Location</p>
                                    <p className="font-bold text-foreground">{project.location}</p>
                                </div>
                            </div>
                            <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-xl backdrop-blur-xl flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Duration</p>
                                    <p className="font-bold text-foreground">{project.date}</p>
                                </div>
                            </div>
                            <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-xl backdrop-blur-xl flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Sector</p>
                                    <p className="font-bold text-foreground">{project.category}</p>
                                </div>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-12">
                                <section className="bg-card rounded-[2.5rem] p-8 md:p-12 border border-border/50 shadow-sm">
                                    <h2 className="text-3xl font-heading font-bold mb-6 flex items-center gap-3">
                                        <Target className="text-primary" /> Project Overview
                                    </h2>
                                    <p className="text-muted-foreground text-lg leading-relaxed font-light">
                                        {project.overview}
                                    </p>
                                </section>

                                <section className="bg-card rounded-[2.5rem] p-8 md:p-12 border border-border/50 shadow-sm">
                                    <h2 className="text-3xl font-heading font-bold mb-8 flex items-center gap-3">
                                        <Users className="text-primary" /> Key Goals
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

                                <section className="bg-card rounded-[2.5rem] p-8 md:p-12 border border-border/50 shadow-sm">
                                    <h2 className="text-3xl font-heading font-bold mb-8 flex items-center gap-3">
                                        <BarChart3 className="text-primary" /> Achievements
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
                            </div>

                            {/* Sidebar / Impact */}
                            <div className="space-y-8">
                                <div className="bg-slate-950 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
                                    <h3 className="text-2xl font-heading font-bold mb-6">Social Impact</h3>
                                    <p className="text-slate-400 leading-relaxed mb-8">
                                        {project.impact}
                                    </p>
                                    <Link href="/get-involved">
                                        <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest text-xs">
                                            Join this effort
                                        </Button>
                                    </Link>
                                </div>

                                <div className="bg-card rounded-[2.5rem] p-8 border border-border/50 flex flex-col items-center text-center space-y-6">
                                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                        <ArrowLeft className="text-muted-foreground" />
                                    </div>
                                    <h4 className="font-bold">Explore More Projects</h4>
                                    <Link href="/activities/projects">
                                        <Button variant="outline" className="rounded-full px-8">
                                            View All Projects
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
