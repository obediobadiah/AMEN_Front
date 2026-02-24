"use client";

import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { useTranslations } from 'next-intl';
import { images } from "@/lib/images";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useNews, NewsArticle } from "@/hooks/use-news";
import { useLocale } from "next-intl";
import { getImageUrl } from "@/lib/api-config";
import { format } from "date-fns";

export default function News() {
  const t = useTranslations();
  const locale = useLocale();
  const [filter, setFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(10);
  const { news, isLoading } = useNews();

  const publishedNews = news.filter(article => {
    const statusFr = (article.status as any)?.fr;
    const statusEn = (article.status as any)?.en;
    const statusLocale = (article.status as any)?.[locale];
    return statusLocale === "Published" || statusFr === "Publié" || statusEn === "Published" || (article.status as any) === "Published" || (article.status as any) === "Publié";
  });

  const filteredArticles = filter === "all"
    ? publishedNews
    : publishedNews.filter(article => {
      const catFr = ((article.category as any)?.fr || "").toLowerCase();
      const catEn = ((article.category as any)?.en || "").toLowerCase();
      const catLocale = ((article.category as any)?.[locale] || "").toLowerCase();
      const searchFilter = filter.toLowerCase();

      // Match against translation values
      if (catLocale === searchFilter || catFr === searchFilter || catEn === searchFilter) return true;
      // Match against original keys (impact, field, press)
      if (searchFilter === "impact" && (catEn === "impact" || catFr === "impact")) return true;
      if (searchFilter === "field" && (catEn === "field" || catFr === "terrain")) return true;
      if (searchFilter === "press" && (catEn === "press" || catFr === "presse")) return true;

      return false;
    });

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <p className="font-bold text-muted-foreground animate-pulse tracking-widest uppercase text-xs">
              {t('common.loading')}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHero
        title={t('actualitesPage.title')}
        subtitle={t('actualitesPage.subtitle')}
        image={images.news2}
      />

      {/* Intro & Filters */}
      <section className="py-24 bg-background relative overflow-hidden">
        {/* Background glow elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-1/4 -left-20 w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[100px] -z-10" />

        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20">
            <div className="max-w-2xl space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 text-primary text-xs font-black tracking-[0.2em] uppercase border border-primary/20 backdrop-blur-sm"
              >
                <Tag size={12} className="mb-0.5" />
                <span>{t('nav.news')}</span>
              </motion.div>
              <h2 className="text-5xl md:text-7xl font-heading font-black text-foreground tracking-tight leading-[0.9]">
                {t('actualitesPage.title')}
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-xl">
                {t('actualitesPage.intro')}
              </p>
            </div>

            {/* Filter Tabs - Premium Styled */}
            <div className="flex flex-wrap gap-3 p-2 bg-muted/30 rounded-[2rem] border border-border/50 backdrop-blur-sm h-fit">
              {["all", "press", "field", "impact"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={cn(
                    "px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-500",
                    filter === cat
                      ? "bg-primary text-white shadow-xl shadow-primary/25"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {t(`actualitesPage.categories.${cat}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Article - If filter is 'all' */}
          {filter === "all" && filteredArticles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 md:mb-24 group relative"
            >
              <div className="relative aspect-[16/10] md:aspect-[21/9] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/5 border border-border/50">
                <img
                  src={getImageUrl(filteredArticles[0].thumbnail_url) || images.news2}
                  alt={filteredArticles[0].title[locale] || filteredArticles[0].title.fr}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-16 space-y-4 md:space-y-6">
                  <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/70 text-[10px] md:text-sm font-bold uppercase tracking-widest">
                    <span className="bg-primary px-3 md:px-4 py-1 md:py-1.5 rounded-full text-white text-[9px] md:text-xs font-black">
                      {(filteredArticles[0].category as any)?.[locale] || (filteredArticles[0].category as any)?.fr || (filteredArticles[0].category as any)?.en || 'all'}
                    </span>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-primary" />
                      <span>{format(new Date(filteredArticles[0].published_date), "dd MMM yyyy")}</span>
                    </div>
                  </div>
                  <h3 className="text-3xl md:text-5xl lg:text-6xl font-heading font-black text-white leading-tight max-w-4xl">
                    {filteredArticles[0].title[locale] || filteredArticles[0].title.fr}
                  </h3>
                  <p className="text-white/70 text-lg md:text-xl font-light max-w-2xl line-clamp-2">
                    {filteredArticles[0].excerpt?.[locale] || filteredArticles[0].excerpt?.fr || ""}
                  </p>
                  <div className="pt-2 md:pt-4">
                    <Link href={`/news/actualites/${filteredArticles[0].id}`}>
                      <Button className="h-12 md:h-14 px-8 md:px-10 rounded-xl md:rounded-2xl bg-white text-slate-900 hover:bg-primary hover:text-white font-black text-sm md:text-lg transition-all flex items-center gap-2 md:gap-3">
                        {t('actualitesPage.readMore')}
                        <ArrowRight size={18} />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
            {filteredArticles.slice(filter === "all" ? 1 : 0, visibleCount).map((article, idx) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group flex flex-col bg-card rounded-[2.5rem] border border-border/40 overflow-hidden hover:border-primary/30 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-500"
              >
                {/* Image Container */}
                <div className="relative aspect-[16/11] overflow-hidden">
                  <img
                    src={getImageUrl(article.thumbnail_url) || images.news1}
                    alt={article.title[locale] || article.title.fr}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 px-4 py-1.5 rounded-2xl bg-white/10 backdrop-blur-xl text-white text-[10px] font-black uppercase tracking-[0.2em] border border-white/20">
                    {(article.category as any)?.[locale] || (article.category as any)?.fr || (article.category as any)?.en || 'all'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-10 flex-grow flex flex-col space-y-6">
                  <div className="flex items-center gap-6 text-xs font-black text-muted-foreground uppercase tracking-[0.15em]">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-primary" />
                      <span>{format(new Date(article.published_date), "dd MMM yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-primary" />
                      <span>{article.author}</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-heading font-black text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-2">
                    {article.title[locale] || article.title.fr || article.title.en}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed line-clamp-3 font-light text-lg">
                    {article.excerpt?.[locale] || article.excerpt?.fr || article.excerpt?.en || ""}
                  </p>

                  <div className="pt-6 mt-auto">
                    <Link href={`/news/actualites/${article.id}`}>
                      <Button variant="link" className="p-0 h-auto text-primary font-black uppercase tracking-widest text-xs group/btn flex items-center gap-3 hover:no-underline hover:text-primary/80">
                        {t('actualitesPage.readMore')}
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center transition-all group-hover/btn:bg-primary group-hover/btn:text-white group-hover/btn:translate-x-2">
                          <ArrowRight size={16} />
                        </div>
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          {filteredArticles.length > visibleCount && (
            <div className="mt-24 text-center">
              <Button
                onClick={() => setVisibleCount(prev => prev + 10)}
                className="h-16 px-16 rounded-[2rem] bg-slate-950 hover:bg-primary text-white font-black text-xl shadow-2xl shadow-black/10 transition-all hover:-translate-y-1 active:scale-95"
              >
                {t('actualitesPage.loadMore')}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Subscription (Reused from resources or common) */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-slate-950 rounded-[3rem] p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-0" />
            <div className="relative z-10 space-y-8">
              <h2 className="text-3xl md:text-5xl font-heading font-bold">
                {t('resourcesPage.impactUpdateTitle')}
              </h2>
              <p className="text-lg md:text-xl text-slate-400 font-light max-w-2xl mx-auto">
                {t('resourcesPage.impactUpdateSubtitle')}
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder={t('resourcesPage.emailPlaceholder')}
                  className="h-14 flex-grow rounded-2xl bg-white/5 border border-white/10 px-6 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  required
                />
                <Button className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-lg shadow-primary/20">
                  {t('resourcesPage.subscribe')}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
