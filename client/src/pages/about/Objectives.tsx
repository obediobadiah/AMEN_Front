"use client";

import { Layout } from "@/components/Layout";
import { images } from "@/lib/images";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Utensils, Briefcase, Leaf, Scale, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/PageHero";

export default function Objectives() {
    const t = useTranslations();

    const objectives = [
        { id: "1", icon: Utensils, color: "text-orange-600 bg-orange-100/50" },
        { id: "2", icon: Briefcase, color: "text-blue-600 bg-blue-100/50" },
        { id: "3", icon: Leaf, color: "text-green-600 bg-green-100/50" },
        { id: "4", icon: Scale, color: "text-purple-600 bg-purple-100/50" },
    ];

    return (
        <Layout>
            <PageHero
                title={t('aboutPage.objectives.title')}
                subtitle={t('aboutPage.objectives.subtitle')}
                image={images.heroObjectives}
            />

            <section className="py-24 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm uppercase tracking-wider">
                            <CheckCircle2 size={16} /> {t('aboutPage.objectives.commitmentsLabel')}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 leading-tight">{t('aboutPage.objectives.subtitle')}</h2>
                        <p className="text-muted-foreground text-xl leading-relaxed font-light">{t('aboutPage.objectives.intro')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                        {objectives.map((obj, i) => (
                            <motion.div
                                key={obj.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.6 }}
                                className="group relative overflow-hidden bg-card rounded-3xl border border-border/50 hover:border-primary/30 shadow-lg hover:shadow-2xl transition-all duration-500"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-muted/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="p-10 flex flex-col md:flex-row gap-8 items-start relative z-10">
                                    <div className={`w-20 h-20 rounded-2xl ${obj.color} flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                                        <obj.icon size={36} className="stroke-[1.5]" />
                                    </div>

                                    <div className="space-y-3">
                                        <span className="text-sm font-bold text-muted-foreground/60 uppercase tracking-widest">{t('aboutPage.objectives.goalLabel')} {obj.id}</span>
                                        <h3 className="text-2xl font-heading font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                                            {t(`aboutPage.objectives.list.${obj.id}.title`)}
                                        </h3>
                                        <p className="text-muted-foreground text-lg leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                                            {t(`aboutPage.objectives.list.${obj.id}.desc`)}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Impact Stats Strip - Mockup */}
            <section className="py-20 bg-primary text-white">
                <div className="container mx-auto px-4 text-center">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                        {[
                            { val: "50k+", label: t('aboutPage.objectives.stats.beneficiaries') },
                            { val: "12", label: t('aboutPage.objectives.stats.years') },
                            { val: "25+", label: t('aboutPage.objectives.stats.projects') },
                            { val: "100%", label: t('aboutPage.objectives.stats.commitment') }
                        ].map((stat, i) => (
                            <div key={i} className="space-y-2">
                                <div className="text-4xl md:text-6xl font-heading font-bold">{stat.val}</div>
                                <div className="text-white/70 uppercase tracking-wider text-sm font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </Layout>
    );
}
