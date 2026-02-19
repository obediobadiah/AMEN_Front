"use client";

import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { useTranslations } from "next-intl";
import { images } from "@/lib/images";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft, ArrowRight, Tag, Share2, Clock } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface ArticleDetailProps {
    id: string;
}

export default function ArticleDetail({ id }: ArticleDetailProps) {
    const t = useTranslations();

    // Basic validation for ID
    const articleId = (parseInt(id) >= 1 && parseInt(id) <= 6) ? id : "1";

    const article = {
        title: t(`actualitesPage.articles.${articleId}.title`),
        excerpt: t(`actualitesPage.articles.${articleId}.excerpt`),
        author: t(`actualitesPage.articles.${articleId}.author`),
        date: t(`actualitesPage.articles.${articleId}.date`),
        content: t(`actualitesPage.articles.${articleId}.content`),
        // Mapping images based on ID
        image: articleId === "1" ? images.news1 :
            articleId === "2" ? images.news2 :
                articleId === "3" ? images.news3 :
                    articleId === "4" ? images.heroProjects :
                        articleId === "5" ? images.heroContact : images.heroActivities,
        category: articleId === "1" || articleId === "6" ? t('actualitesPage.categories.impact') :
            articleId === "2" || articleId === "4" ? t('actualitesPage.categories.field') : t('actualitesPage.categories.press')
    };

    return (
        <Layout>
            <article className="pb-24">
                {/* Reuse PageHero for the main title and visual impact */}
                <PageHero
                    title={article.title}
                    subtitle={article.excerpt}
                    image={article.image}
                    className="min-h-[60vh]"
                />

                <div className="container mx-auto px-6 -mt-20 relative z-20">
                    <div className="max-w-4xl mx-auto">
                        {/* Meta Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-card p-6 md:p-10 rounded-[2.5rem] border border-border/50 shadow-2xl backdrop-blur-xl mb-12 flex flex-wrap items-center justify-between gap-8"
                        >
                            <div className="flex flex-wrap items-center gap-8 text-sm text-muted-foreground">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Author</p>
                                        <p className="font-bold text-foreground">{article.author}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Published</p>
                                        <p className="font-bold text-foreground">{article.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 hidden sm:flex">
                                    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Reading Time</p>
                                        <p className="font-bold text-foreground">5 min</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-6 py-2.5 rounded-full border border-primary/20 shadow-sm">
                                    {article.category}
                                </span>
                            </div>
                        </motion.div>

                        {/* Article Content Area */}
                        <div className="bg-background rounded-[4rem] p-10 md:p-20 shadow-sm border border-border/40 relative">
                            <div className="absolute top-10 left-10 text-primary/10 select-none pointer-events-none">
                                <Tag size={120} />
                            </div>

                            {/* Back Link */}
                            <Link href="/news/actualites">
                                <Button variant="ghost" className="mb-12 -ml-4 group hover:text-primary transition-colors rounded-full px-6 font-bold uppercase tracking-widest text-[10px]">
                                    <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                                    {t('common.back')} {t('nav.news')}
                                </Button>
                            </Link>

                            {/* Content Formatting */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="prose prose-xl dark:prose-invert max-w-none text-muted-foreground font-light leading-relaxed"
                            >
                                {article.content.split('\n\n').map((paragraph, idx) => (
                                    <p key={idx} className="mb-10 text-lg md:text-xl last:mb-0 first-letter:text-5xl first-letter:font-black first-letter:text-primary first-letter:mr-3 first-letter:float-left first-letter:leading-none">
                                        {paragraph}
                                    </p>
                                ))}
                            </motion.div>

                            {/* Horizontal Line with Decorative Dot */}
                            <div className="relative my-20">
                                <hr className="border-border/50" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-xl shadow-primary/40 focus:animate-pulse" />
                            </div>

                            {/* Share & Feedback */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                                <div className="space-y-4 text-center md:text-left">
                                    <h5 className="text-xs font-black uppercase tracking-[0.3em] text-foreground">Share the impact</h5>
                                    <div className="flex gap-3 justify-center md:justify-start">
                                        {['Facebook', 'Twitter', 'LinkedIn'].map(platform => (
                                            <Button key={platform} size="icon" variant="outline" className="w-12 h-12 rounded-[1rem] border-border hover:border-primary hover:text-primary transition-all duration-300">
                                                <Share2 size={18} />
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-3 flex-wrap justify-center">
                                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-muted border border-border/50 text-xs font-bold text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all cursor-default">
                                        #SustainableDevelopment
                                    </div>
                                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-muted border border-border/50 text-xs font-bold text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all cursor-default">
                                        #CongoBasin
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Navigation */}
                        <div className="mt-20 flex justify-center">
                            <Link href="/contact">
                                <Button className="h-16 px-12 rounded-full bg-slate-950 text-white font-black uppercase tracking-widest text-sm hover:bg-primary transition-all shadow-xl shadow-black/10 group">
                                    Comment on this story
                                    <ArrowRight size={20} className="ml-3 transition-transform group-hover:translate-x-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </article>
        </Layout>
    );
}
