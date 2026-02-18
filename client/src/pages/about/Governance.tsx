"use client";

import { Layout } from "@/components/Layout";
import { images } from "@/lib/images";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { User, ShieldCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHero } from "@/components/PageHero";

export default function Governance() {
    const t = useTranslations();

    const board = [
        { name: "Dr. Ahmed", role: t('aboutPage.governance.roles.chair'), bio: t('aboutPage.governance.members.ahmed.bio') },
        { name: "Sarah Johnson", role: t('aboutPage.governance.roles.member'), bio: t('aboutPage.governance.members.sarah.bio') },
        { name: "Prof. Mbella", role: t('aboutPage.governance.roles.member'), bio: t('aboutPage.governance.members.mbella.bio') },
    ];

    const executive = [
        { name: "Jean Kabuya", role: t('aboutPage.governance.roles.director'), bio: t('aboutPage.governance.members.jean.bio') },
        { name: "Marie Claire", role: t('aboutPage.governance.roles.program'), bio: t('aboutPage.governance.members.marie.bio') },
        { name: "Paul Mukendi", role: t('aboutPage.governance.roles.finance'), bio: t('aboutPage.governance.members.paul.bio') },
    ];

    return (
        <Layout>
            <PageHero
                title={t('aboutPage.governance.title')}
                subtitle={t('aboutPage.governance.subtitle')}
                image={images.heroGovernance}
            />

            <section className="py-24 bg-background">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-16 space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm uppercase tracking-wider">
                            <ShieldCheck size={16} /> {t('aboutPage.governance.transparentLeadership')}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 leading-tight">{t('aboutPage.governance.structureTitle')}</h2>
                        <p className="text-muted-foreground text-xl leading-relaxed font-light max-w-3xl mx-auto">
                            {t('aboutPage.governance.intro')}
                        </p>
                    </div>

                    <Tabs defaultValue="board" className="w-full">
                        <div className="flex justify-center mb-16">
                            <TabsList className="bg-muted p-1.5 rounded-full inline-flex">
                                <TabsTrigger value="board" className="rounded-full px-8 py-3 text-lg font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">
                                    {t('aboutPage.governance.board')}
                                </TabsTrigger>
                                <TabsTrigger value="executive" className="rounded-full px-8 py-3 text-lg font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">
                                    {t('aboutPage.governance.executive')}
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="board" className="mt-0">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {board.map((member, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-card rounded-3xl p-8 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
                                    >
                                        <div className="w-24 h-24 mx-auto bg-primary/5 rounded-full flex items-center justify-center text-primary mb-6 ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all duration-300">
                                            <User size={40} />
                                        </div>
                                        <h3 className="text-xl font-heading font-bold mb-1">{member.name}</h3>
                                        <p className="text-primary font-medium uppercase tracking-wide text-xs mb-4">{member.role}</p>
                                        <p className="text-muted-foreground text-sm font-light italic">" {member.bio} "</p>
                                    </motion.div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="executive" className="mt-0">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {executive.map((member, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-card rounded-3xl p-8 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
                                    >
                                        <div className="w-24 h-24 mx-auto bg-secondary/10 rounded-full flex items-center justify-center text-secondary-foreground mb-6 ring-4 ring-secondary/20 group-hover:ring-secondary/40 transition-all duration-300">
                                            <User size={40} />
                                        </div>
                                        <h3 className="text-xl font-heading font-bold mb-1">{member.name}</h3>
                                        <p className="text-secondary-foreground font-medium uppercase tracking-wide text-xs mb-4">{member.role}</p>
                                        <p className="text-muted-foreground text-sm font-light italic">" {member.bio} "</p>
                                    </motion.div>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </section>
        </Layout>
    );
}
