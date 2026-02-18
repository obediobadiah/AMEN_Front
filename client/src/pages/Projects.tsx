"use client";

import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { useTranslations } from 'next-intl';
import { images } from "@/lib/images";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, ArrowRight, Activity, CheckCircle, Clock, Lightbulb } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { Key } from "react";

const projects = [
    {
        id: 1,
        title: "Congo Basin Reforestation",
        description: "Restoring 5,000 hectares of degraded forest land through community-led agroforestry and native tree planting.",
        location: "Equateur Province",
        date: "2023 - Present",
        status: "active",
        image: images.programNature,
        category: "Environment"
    },
    {
        id: 2,
        title: "Solar Power for Rural Clinics",
        description: "Installing off-grid solar energy systems in 10 remote health centers to ensure 24/7 access to medical services.",
        location: "Kasaï Region",
        date: "2024 - 2025",
        status: "active",
        image: images.news2,
        category: "Infrastructure"
    },
    {
        id: 3,
        title: "Sustainable Fisheries Initiative",
        description: "Empowering 500 local fishers with modern equipment and sustainable management practices to protect aquatic biodiversity.",
        location: "Lake Tanganyika",
        date: "2022 - 2024",
        status: "completed",
        image: images.programWomen,
        category: "Economy"
    },
    {
        id: 4,
        title: "Urban Waste Management",
        description: "Developing community-based recycling systems in Kinshasa to reduce plastic pollution and create green jobs.",
        location: "Kinshasa",
        date: "2025 - Upcoming",
        status: "upcoming",
        image: images.news3,
        category: "Urban Development"
    }
];

export default function Projects() {
    const t = useTranslations();

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <Layout>
            <PageHero
                title={t('projectsPage.title')}
                subtitle={t('projectsPage.subtitle')}
                image={images.news2}
            />

            {/* Intro & Stats Section */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <span className="text-primary font-bold uppercase tracking-widest text-sm">{t('projectsPage.subtitle')}</span>
                                <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground leading-tight">
                                    Driving Change Through <br />
                                    <span className="text-primary">Innovative Initiatives</span>
                                </h2>
                            </div>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                {t('projectsPage.intro')}
                            </p>
                            <div className="grid grid-cols-2 gap-8 pt-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 text-primary">
                                        <Activity className="h-6 w-6" />
                                        <span className="text-3xl font-bold font-heading">15+</span>
                                    </div>
                                    <p className="text-muted-foreground font-medium">
                                        {t('projectsPage.stats.activeProjects', { count: 15 })}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 text-primary">
                                        <CheckCircle className="h-6 w-6" />
                                        <span className="text-3xl font-bold font-heading">42+</span>
                                    </div>
                                    <p className="text-muted-foreground font-medium">
                                        {t('projectsPage.stats.completedInitiatives', { count: 42 })}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <img src={images.news1} className="rounded-2xl shadow-xl aspect-square object-cover" alt="Project 1" />
                                    <img src={images.programWomen} className="rounded-2xl shadow-xl aspect-[3/4] object-cover" alt="Project 2" />
                                </div>
                                <div className="space-y-4 pt-8">
                                    <img src={images.programNature} className="rounded-2xl shadow-xl aspect-[3/4] object-cover" alt="Project 3" />
                                    <img src={images.news2} className="rounded-2xl shadow-xl aspect-square object-cover" alt="Project 4" />
                                </div>
                            </div>
                            <div className="absolute -z-10 -bottom-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                            <div className="absolute -z-10 -top-10 -left-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Projects Grid */}
            <section className="py-24 bg-background/50">
                <div className="container mx-auto px-4">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-10"
                    >
                        {projects.map((project) => (
                            <motion.div key={project.id} variants={itemVariants}>
                                <Card className="group overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500 bg-card hover:shadow-xl rounded-3xl h-full flex flex-col">
                                    <div className="relative h-80 overflow-hidden shrink-0">
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
                                        <div className="absolute top-6 left-6 flex gap-3">
                                            <span className="bg-primary/90 backdrop-blur-md text-primary-foreground border border-primary/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-primary transition-colors">
                                                {project.category}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-6 left-6 right-6">
                                            <h3 className="text-2xl md:text-3xl font-bold text-white font-heading underline decoration-primary/50 decoration-4 underline-offset-8">
                                                {project.title}
                                            </h3>
                                        </div>
                                    </div>
                                    <CardContent className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                                        <div className="space-y-6">
                                            <p className="text-muted-foreground leading-relaxed text-lg">
                                                {project.description}
                                            </p>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="flex items-center gap-3 text-sm text-foreground font-medium">
                                                    <div className="w-10 h-10 bg-accent/50 rounded-full flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                                                        <MapPin size={18} />
                                                    </div>
                                                    <span>{project.location}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-foreground font-medium">
                                                    <div className="w-10 h-10 bg-accent/50 rounded-full flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                                                        <Calendar size={18} />
                                                    </div>
                                                    <span>{project.date}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-6 flex items-center justify-between border-t border-border/50">
                                            <div className="flex items-center gap-2">
                                                <div className={cn(
                                                    "w-3 h-3 rounded-full animate-pulse",
                                                    project.status === 'active' ? "bg-green-500" :
                                                        project.status === 'completed' ? "bg-primary" : "bg-orange-400"
                                                )} />
                                                <span className="text-sm font-bold uppercase tracking-wider">
                                                    {t(`projectsPage.status.${project.status}`)}
                                                </span>
                                            </div>
                                            <Button variant="ghost" className="group/btn text-primary font-bold gap-2 p-0 hover:bg-transparent hover:text-primary/80 transition-colors">
                                                {t('projectsPage.projectDetails')}
                                                <ArrowRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Innovation Section */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-4">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-12 text-white overflow-hidden relative shadow-2xl">
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]" />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                            <div className="space-y-8">
                                <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 hover:bg-white/10 transition-colors">
                                    <Lightbulb className="text-primary h-5 w-5" />
                                    <span className="text-sm font-bold uppercase tracking-wider">{t('projectsPage.innovation.ourApproach')}</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-heading font-bold leading-tight">
                                    {t('projectsPage.innovation.title')}
                                </h2>
                                <p className="text-lg text-muted-foreground/90 leading-relaxed">
                                    {t('projectsPage.innovation.subtitle')}
                                </p>
                                <ul className="space-y-4">
                                    {t.raw('projectsPage.innovation.items').map((item: any, idx: Key | null | undefined) => (
                                        <li key={idx} className="flex items-center gap-4">
                                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/30 transition-colors">
                                                <CheckCircle size={14} />
                                            </div>
                                            <span className="font-medium text-white/90" dangerouslySetInnerHTML={{ __html: item }} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 text-center space-y-4 hover:bg-white/10 transition-colors">
                                    <div className="text-4xl font-bold font-heading text-primary">85%</div>
                                    <p className="text-white/60 text-sm font-medium uppercase tracking-widest">
                                        {t('projectsPage.innovation.stats.sustainability')}
                                    </p>
                                </div>
                                <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 text-center space-y-4 translate-y-8 hover:bg-white/10 transition-colors">
                                    <div className="text-4xl font-bold font-heading text-primary">50+</div>
                                    <p className="text-white/60 text-sm font-medium uppercase tracking-widest">
                                        {t('projectsPage.innovation.stats.partnerships')}
                                    </p>
                                </div>
                                <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 text-center space-y-4 hover:bg-white/10 transition-colors text-primary">
                                    <Activity className="mx-auto h-10 w-10 mb-2" />
                                    <p className="text-white/60 text-sm font-medium uppercase tracking-widest">
                                        {t('projectsPage.innovation.stats.evolution')}
                                    </p>
                                </div>
                                <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 text-center space-y-4 translate-y-8 hover:bg-white/10 transition-colors text-primary">
                                    <Clock className="mx-auto h-10 w-10 mb-2" />
                                    <p className="text-white/60 text-sm font-medium uppercase tracking-widest">
                                        {t('projectsPage.innovation.stats.delivery')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map/Global Reach CTA */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-4 text-center space-y-12">
                    <div className="max-w-2xl mx-auto space-y-6">
                        <h2 className="text-4xl font-heading font-bold">{t('projectsPage.globalFootprint.title')}</h2>
                        <p className="text-muted-foreground text-lg">
                            {t('projectsPage.globalFootprint.description')}
                        </p>
                    </div>
                    <div className="relative rounded-[3rem] overflow-hidden shadow-2xl h-[500px] group">
                        <img
                            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop"
                            className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-75 transition-all duration-1000"
                            alt="Impact Map"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-white px-10 h-16 text-lg font-bold shadow-2xl">
                                <MapPin className="mr-2 h-6 w-6" /> {t('projectsPage.globalFootprint.cta')}
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}

