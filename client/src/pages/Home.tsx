"use client";

import { Layout } from "@/components/Layout";
import { Hero } from "@/components/Hero";
import { useTranslations } from 'next-intl';
import { programs, news, stats } from "@/lib/mockData";
import { images } from "@/lib/images";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, CheckCircle2, Globe, Heart, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const t = useTranslations();

  return (
    <Layout>
      <Hero />

      {/* About Section Preview */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img src={images.programNature} alt="About AMEN" className="w-full h-auto object-cover" />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-2xl shadow-xl max-w-xs hidden md:block">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <Heart className="fill-current" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{t('home.aboutSection.totalDonation')}</h4>
                    <p className="text-muted-foreground text-sm">{t('home.aboutSection.latestContribution')}</p>
                  </div>
                </div>
                <div className="bg-primary h-2 rounded-full w-full overflow-hidden">
                  <div className="bg-primary h-full w-[80%]" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <span className="text-primary font-medium tracking-wide uppercase text-sm">{t('home.aboutSection.badge')}</span>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
                {t('home.aboutSection.title')} <br />
                <span className="text-primary decoration-primary/30">{t('home.aboutSection.titleHighlight')}</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {t('home.aboutSection.description')}
              </p>

              <ul className="space-y-4 pt-4">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-primary h-6 w-6" />
                  <span className="font-medium">{t('home.aboutSection.feature1')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-primary h-6 w-6" />
                  <span className="font-medium">{t('home.aboutSection.feature2')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-primary h-6 w-6" />
                  <span className="font-medium">{t('home.aboutSection.feature3')}</span>
                </li>
              </ul>

              <div className="pt-6">
                <Button className="rounded-full px-8 py-6 text-base bg-primary text-primary-foreground hover:bg-primary/90">
                  <a href="/about/vision-mission">{t('home.aboutSection.cta')}</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                  <stat.icon size={24} />
                </div>
                <h3 className="text-4xl font-bold font-heading">{stat.value}</h3>
                <p className="text-primary-foreground/80 font-medium">{t(`home.stats.${stat.label}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-24 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-primary font-medium tracking-wide uppercase text-sm">{t('home.programs.badge')}</span>
            <h2 className="text-4xl font-heading font-bold text-foreground">{t('home.programs.title')}</h2>
            <p className="text-muted-foreground">
              {t('home.programs.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {programs.map((program, index) => {
              const programKey = index === 0 ? 'womenEmpowerment' : index === 1 ? 'environmentalProtection' : 'cleanWater';
              return (
                <Card key={program.id} className="border-none shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-primary z-10">
                      {t(`home.programs.${programKey}.category`)}
                    </div>
                    <img
                      src={program.image}
                      alt={t(`home.programs.${programKey}.title`)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  </div>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold font-heading group-hover:text-primary transition-colors">{t(`home.programs.${programKey}.title`)}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">{t(`home.programs.${programKey}.description`)}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-primary">{t('home.programs.raised')}</span>
                        <span className="text-muted-foreground">{t('home.programs.goal')}</span>
                      </div>
                      <Progress value={(program.raised / program.goal) * 100} className="h-2" />
                    </div>

                    <Button variant="outline" className="w-full rounded-full border-primary/20 hover:bg-primary hover:text-white transition-all group-hover:border-primary">
                      <a href="/donate" className="flex items-center justify-center gap-2 w-full">{t('home.programs.donateNow')} <Heart className="ml-2 h-4 w-4" /></a>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div className="max-w-2xl space-y-4">
              <span className="text-primary font-medium tracking-wide uppercase text-sm">{t('home.newsSection.badge')}</span>
              <h2 className="text-4xl font-heading font-bold text-foreground">{t('home.newsSection.title')}</h2>
            </div>
            <Link href="/news/actualites">
              <Button variant="ghost" className="hidden md:flex gap-2">
                {t('home.newsSection.viewAll')} <ArrowRight size={16} />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((id) => (
              <Link href={`/news/actualites/${id}`} key={id} className="group cursor-pointer shadow-lg rounded-[2rem] bg-card border border-border/40 overflow-hidden hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={id === 1 ? images.news1 : id === 2 ? images.news2 : images.news3}
                    alt={t(`actualitesPage.articles.${id}.title`)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-black uppercase tracking-widest text-primary z-10">
                      {t('home.newsSection.news')}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 bg-primary text-white px-6 py-2 rounded-tr-[1.5rem]">
                    <span className="text-xs font-black">{t(`actualitesPage.articles.${id}.date`)}</span>
                  </div>
                </div>
                <div className="space-y-4 p-8">
                  <div className="flex items-center gap-3 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                    <span className="text-primary">{t(`actualitesPage.articles.${id}.author`)}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span>5 min read</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black font-heading leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {t(`actualitesPage.articles.${id}.title`)}
                  </h3>
                  <p className="text-muted-foreground text-sm font-light line-clamp-2 leading-relaxed">
                    {t(`actualitesPage.articles.${id}.excerpt`)}
                  </p>
                  <div className="pt-4 flex items-center justify-between">
                    <span className="inline-flex items-center text-xs font-black uppercase tracking-widest text-foreground underline decoration-primary/30 underline-offset-8 group-hover:decoration-primary group-hover:text-primary transition-all">
                      {t('home.newsSection.readMore')}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all transform group-hover:translate-x-1">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-28 text-primary-foreground overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 w-full h-full">
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: 'url(/images/hero-home.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          ></div>
          <div
            className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60"
            style={{ zIndex: 1 }}
          />
        </div>
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 2 }}>
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10" style={{ zIndex: 3 }}>
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/10">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/80 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              <span className="text-sm font-medium">{t('home.cta.badge')}</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight">
              {t('home.cta.title')} <span className="text-secondary-foreground/90">{t('home.cta.titleHighlight')}</span>
            </h2>

            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
              {t('home.cta.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full px-8 h-14 text-base font-medium transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                <a href="/get-involved">{t('home.cta.joinNow')}</a>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white/30 hover:border-white/50 bg-transparent hover:bg-white/10 text-white rounded-full px-8 h-14 text-base font-medium transition-all duration-300 transform hover:-translate-y-1"
              >
                <a href="/contact">{t('home.cta.contactUs')}</a>
              </Button>
            </div>

            <div className="pt-8 flex items-center justify-center gap-6 text-sm text-primary-foreground/80">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>{t('home.cta.volunteersCount')}</span>
              </div>
              <div className="h-5 w-px bg-white/30"></div>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <span>{t('home.cta.communitiesServed')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
