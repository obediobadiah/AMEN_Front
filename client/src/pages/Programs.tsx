"use client";

import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { useTranslations } from 'next-intl';
import { programs } from "@/lib/mockData";
import { images } from "@/lib/images";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function Programs() {
  const t = useTranslations();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <Layout>
      <PageHero
        title={t('programsPage.title')}
        subtitle={t('programsPage.subtitle')}
        image={images.programNature}
      />

      {/* Intro Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              {t('programsPage.subtitle')}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {t('programsPage.intro')}
            </p>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-20 bg-background/50">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {programs.map((program) => (
                <motion.div key={program.id} variants={itemVariants}>
                  <Card className="h-full border border-border/50 overflow-hidden group hover:shadow-xl transition-all duration-500 bg-card hover:border-primary/30">
                    <div className="relative h-72 overflow-hidden">
                      <div className="absolute top-4 left-4 bg-primary text-primary-foreground border-none px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider z-10 shadow-lg hover:bg-primary/90 transition-colors">
                        {t(`programsPage.programs.${program.id}.category`)}
                      </div>
                      <img
                        src={program.image}
                        alt={t(`programsPage.programs.${program.id}.title`)}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <CardContent className="p-8 space-y-6">
                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold font-heading text-foreground group-hover:text-primary transition-colors duration-300">
                          {t(`programsPage.programs.${program.id}.title`)}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed line-clamp-3">
                          {t(`programsPage.programs.${program.id}.description`)}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm font-bold">
                          <span className="text-primary">{t('programsPage.raised')}</span>
                          <span className="text-muted-foreground">{t('programsPage.goal')}</span>
                        </div>
                        <div className="relative h-2.5 w-full bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${(program.raised / program.goal) * 100}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="absolute top-0 left-0 h-full bg-primary rounded-full"
                          />
                        </div>
                        <div className="flex justify-between text-sm">
                          {/* <span className="font-bold">${program.raised.toLocaleString()}</span>
                          <span className="text-muted-foreground">${program.goal.toLocaleString()}</span> */}
                        </div>
                      </div>

                      <div className="pt-2">
                        <Button className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 hover:shadow-primary/30">
                          <a href="/donate" className="flex items-center gap-2">{t('programsPage.donateNow')} <Heart className="ml-2 h-4 w-4 fill-current" /></a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </motion.div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <span className="inline-block px-4 py-1 bg-primary/20 rounded-full text-primary font-bold text-sm tracking-widest uppercase">
                {t('programsPage.impact')}
              </span>
              <h2 className="text-4xl md:text-5xl font-heading font-bold leading-tight">
                {t('programsPage.impactSection.title', {
                  emphasis: t('programsPage.impactSection.emphasis')
                }).replace('{emphasis}', 
                  `<span class="text-primary italic">${t('programsPage.impactSection.emphasis')}</span>`
                )}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="shrink-0 w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="text-primary h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">
                        {t('programsPage.impactSection.focusTitle', { number: i })}
                      </h4>
                      <p className="text-white/60 text-sm">
                        {t('programsPage.impactSection.focusDescription')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src={images.news1}
                alt="Impact"
                className="rounded-2xl shadow-2xl relative z-10 border-4 border-white/5"
              />
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary to-primary/90 rounded-[2rem] p-12 text-center text-primary-foreground space-y-8 shadow-2xl shadow-primary/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

            <h2 className="text-3xl md:text-5xl font-heading font-bold relative z-10">
              {t('programsPage.cta.title')}
            </h2>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto relative z-10">
              {t('programsPage.cta.description')}
            </p>
            <div className="flex flex-wrap justify-center gap-4 relative z-10">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-10 h-14 text-lg font-bold shadow-xl">
                <a href="/get-involved" className="flex items-center gap-2">{t('programsPage.cta.joinNow')}</a>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-10 h-14 text-lg font-bold">
                <a href="/contact" className="flex items-center gap-2">{t('programsPage.cta.contactUs')} <ArrowRight className="ml-2 h-5 w-5" /></a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
