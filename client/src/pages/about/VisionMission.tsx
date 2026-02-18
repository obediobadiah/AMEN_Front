"use client";

import { Layout } from "@/components/Layout";
import { images } from "@/lib/images";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Target, Eye, Star, Heart, Shield } from "lucide-react";
import { PageHero } from "@/components/PageHero";

export default function VisionMission() {
    const t = useTranslations();

    return (
        <Layout>
            <PageHero
                title={t('aboutPage.visionMission.title')}
                subtitle={t('aboutPage.visionMission.subtitle')}
                image={images.heroMission}
            />

            {/* Intro Quote */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <span className="text-9xl text-primary/10 font-serif absolute -top-12 -left-12">"</span>
                        <h2 className="text-3xl md:text-5xl font-heading font-medium leading-tight text-foreground/90 italic">
                            "{t('aboutPage.visionMission.visionText')}"
                        </h2>
                        <span className="text-9xl text-primary/10 font-serif absolute -bottom-24 -right-12 rotate-180">"</span>
                    </motion.div>
                </div>
            </section>

            {/* Main Cards */}
            <section className="py-24 bg-muted/20 relative overflow-hidden">
                {/* Background blobs */}
                <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-stretch">
                        {/* Vision Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="bg-white rounded-[2rem] p-10 lg:p-16 shadow-2xl border border-border/50 relative group hover:border-primary/30 transition-all duration-500 flex flex-col justify-between overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 scale-150 transform translate-x-1/4 -translate-y-1/4">
                                <Eye size={400} className="text-foreground" />
                            </div>

                            <div>
                                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-10 group-hover:bg-primary group-hover:text-white transition-colors duration-500 shadow-lg shadow-primary/20">
                                    <Eye size={40} />
                                </div>
                                <h2 className="text-4xl font-heading font-bold mb-8 text-foreground tracking-tight">{t('aboutPage.visionMission.visionTitle')}</h2>
                                <p className="text-xl text-muted-foreground leading-relaxed font-light">
                                    {t('aboutPage.visionMission.visionText')}
                                </p>
                            </div>

                            <div className="mt-12 pt-8 border-t border-border/50">
                                <div className="flex items-center gap-4 text-sm font-medium text-primary uppercase tracking-widest">
                                    <Star size={16} /> {t('aboutPage.visionMission.futureLabel')}
                                </div>
                            </div>
                        </motion.div>

                        {/* Mission Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="bg-secondary rounded-[2rem] p-10 lg:p-16 shadow-2xl border border-white/10 relative group hover:border-white/20 transition-all duration-500 flex flex-col justify-between overflow-hidden text-secondary-foreground"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-500 scale-150 transform translate-x-1/4 -translate-y-1/4">
                                <Target size={400} className="text-white" />
                            </div>

                            <div>
                                <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-10 group-hover:bg-white/20 transition-colors duration-500 backdrop-blur-sm shadow-lg shadow-black/10">
                                    <Target size={40} />
                                </div>
                                <h2 className="text-4xl font-heading font-bold mb-8 text-white tracking-tight">{t('aboutPage.visionMission.missionTitle')}</h2>
                                <p className="text-xl text-white/80 leading-relaxed font-light">
                                    {t('aboutPage.visionMission.missionText')}
                                </p>
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/10">
                                <div className="flex items-center gap-4 text-sm font-medium text-white/90 uppercase tracking-widest">
                                    <Heart size={16} /> {t('aboutPage.visionMission.empowermentLabel')}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Image Split */}
            <section className="h-[60vh] relative group overflow-hidden">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-700 z-10" />
                <img
                    src={images.programNature}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[2s] ease-out"
                    alt={t('aboutPage.visionMission.natureLabel')}
                />
                <div className="absolute bottom-0 left-0 w-full p-12 z-20 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="container mx-auto">
                        <h3 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">{t('aboutPage.visionMission.natureLabel')}</h3>
                        <p className="text-white/80 text-xl max-w-2xl">{t('aboutPage.visionMission.natureDesc')}</p>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
