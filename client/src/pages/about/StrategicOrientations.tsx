"use client";

import { Layout } from "@/components/Layout";
import { images } from "@/lib/images";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Leaf, TrendingUp, ShieldCheck, Sprout, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";

export default function StrategicOrientations() {
    const t = useTranslations();

    const pillars = [
        { key: "agriculture", icon: Sprout, color: "text-green-500 bg-green-500/10 border-green-500/20" },
        { key: "environment", icon: Leaf, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
        { key: "economy", icon: TrendingUp, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
        { key: "governance", icon: ShieldCheck, color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
    ];

    return (
        <Layout>
            <PageHero
                title={t('aboutPage.strategic.title')}
                subtitle={t('aboutPage.strategic.subtitle')}
                image={images.heroStrategy}
            />

            <section className="py-24 bg-background">
                <div className="container mx-auto px-4 space-y-24">
                    <div className="text-center max-w-4xl mx-auto space-y-6">
                        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 leading-tight">{t('aboutPage.strategic.intro')}</h2>
                        <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
                            {t('aboutPage.strategic.pillarIntro')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12">
                        {pillars.map((pillar, i) => (
                            <motion.div
                                key={pillar.key}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.6 }}
                                className="group relative overflow-hidden rounded-[2.5rem] bg-card border border-border/50 hover:border-primary/20 shadow-lg hover:shadow-2xl transition-all duration-500"
                            >
                                <div className="p-10 lg:p-12 relative z-10 h-full flex flex-col items-start gap-6">
                                    <div className={`w-16 h-16 rounded-2xl ${pillar.color} flex items-center justify-center border shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                                        <pillar.icon size={32} />
                                    </div>

                                    <div className="space-y-4 flex-1">
                                        <h3 className="text-3xl font-heading font-bold group-hover:text-primary transition-colors duration-300">
                                            {t(`aboutPage.strategic.pillars.${pillar.key}`)}
                                        </h3>
                                        <p className="text-muted-foreground text-lg leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                                            {t('aboutPage.strategic.pillarDesc', { pillar: t(`aboutPage.strategic.pillars.${pillar.key}`).toLowerCase() })}
                                        </p>
                                    </div>

                                    <div className="pt-6 w-full flex items-center justify-between border-t border-border/50 group-hover:border-primary/20 transition-colors duration-300">
                                        <span className="text-sm font-medium uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">{t('common.learnMore')}</span>
                                        <div className="w-10 h-10 rounded-full bg-muted group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all duration-300 transform group-hover:translate-x-2">
                                            <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </Layout>
    );
}
