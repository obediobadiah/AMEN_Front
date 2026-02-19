"use client";

import { Layout } from "@/components/Layout";
import { images } from "@/lib/images";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Calendar, Flag, Award, TrendingUp } from "lucide-react";
import { PageHero } from "@/components/PageHero";

export default function History() {
    const t = useTranslations();

    const milestones = [
        { year: "1996", title: t('aboutPage.history.milestones.1996'), icon: Flag },
        { year: "1998", title: t('aboutPage.history.milestones.1998'), icon: TrendingUp },
        { year: "2012", title: t('aboutPage.history.milestones.2012'), icon: Calendar },
        { year: "2024", title: t('aboutPage.history.milestones.2024'), icon: Award },
    ];

    return (
        <Layout>
            <PageHero
                title={t('aboutPage.history.title')}
                subtitle={t('aboutPage.history.subtitle')}
                image={images.heroHistory}
            />

            {/* Main Content */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8"
                        >
                            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground leading-tight">
                                {t('aboutPage.history.title')}
                            </h2>
                            <div className="w-20 h-1.5 bg-primary rounded-full" />
                            <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
                                {t('aboutPage.history.intro')}
                            </p>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                {t('aboutPage.history.journey')}
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative group"
                        >
                            <div className="absolute inset-0 bg-primary/20 rounded-3xl transform rotate-3 scale-105 group-hover:rotate-6 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-secondary/20 rounded-3xl transform -rotate-2 scale-105 group-hover:-rotate-4 transition-transform duration-500 delay-100" />
                            <img
                                src={images.programWomen}
                                className="rounded-3xl shadow-2xl relative z-10 w-full h-[500px] object-cover filter brightness-105 contrast-105"
                                alt={t('aboutPage.history.title')}
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-24 bg-muted/30 relative overflow-hidden">
                {/* Background blobs */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{t('aboutPage.history.milestonesTitle')}</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">{t('aboutPage.history.milestonesDesc')}</p>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        <div className="space-y-16 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/20 before:via-primary before:to-primary/20">
                            {milestones.map((milestone, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15, duration: 0.6 }}
                                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                                >
                                    <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-background bg-primary text-white shadow-xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:scale-110 transition-transform duration-300">
                                        <milestone.icon className="w-6 h-6" />
                                    </div>
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-8 bg-background rounded-2xl shadow-lg border border-border/50 hover:shadow-xl hover:border-primary/30 transition-all duration-300 group-hover:-translate-y-1">
                                        <div className="flex items-center justify-between space-x-2 mb-2">
                                            <div className="font-bold text-2xl text-primary font-heading">{milestone.year}</div>
                                        </div>
                                        <div className="text-muted-foreground text-lg">{milestone.title}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
