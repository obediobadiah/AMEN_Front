"use client";

import { Layout } from "@/components/Layout";
import { useTranslations } from 'next-intl';
import { PageHero } from "@/components/PageHero";
import { motion, AnimatePresence } from "framer-motion";
import { Users2, Target, Trophy, Crown, Wrench, Heart, User, ChevronRight } from "lucide-react";
import { images } from "@/lib/images";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useGovernance } from "@/hooks/use-governance";
import { getImageUrl } from "@/lib/api-config";
import { useLocale } from "next-intl";
import { MemberDetailDialog } from "@/components/MemberDetailDialog";
import { GovernanceMember } from "@/hooks/use-governance";

const CATEGORIES = [
  { key: "all", icon: Users2, color: "text-slate-600" },
  { key: "dirigeante", icon: Crown, color: "text-amber-600" },
  { key: "technique", icon: Wrench, color: "text-blue-600" },
  { key: "volontaires", icon: Heart, color: "text-emerald-600" },
];



const CATEGORY_COLORS: Record<string, { ring: string; badge: string; icon: string }> = {
  dirigeante: { ring: "group-hover:ring-amber-400/40", badge: "bg-amber-50 text-amber-700", icon: "bg-amber-100" },
  technique: { ring: "group-hover:ring-blue-400/40", badge: "bg-blue-50 text-blue-700", icon: "bg-blue-100" },
  volontaires: { ring: "group-hover:ring-emerald-400/40", badge: "bg-emerald-50 text-emerald-700", icon: "bg-emerald-100" },
};

export default function HumanResources() {
  const t = useTranslations();
  const locale = useLocale();
  const [activeCategory, setActiveCategory] = useState("all");
  const { members, isLoading } = useGovernance("hr");
  const [selectedMember, setSelectedMember] = useState<GovernanceMember | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleMemberClick = (member: GovernanceMember) => {
    setSelectedMember(member);
    setIsDetailOpen(true);
  };

  const stats = [
    { label: t('getInvolvedPage.stats.volunteers'), value: "250+", icon: Users2, color: "text-blue-600", bg: "bg-blue-50" },
    { label: t('getInvolvedPage.stats.communities'), value: "50+", icon: Target, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: t('aboutPage.objectives.stats.projects'), value: "100+", icon: Trophy, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const displayMembers = members || [];
  const filteredMembers = activeCategory === "all"
    ? displayMembers
    : displayMembers.filter((m) => m.organ_id === activeCategory);

  return (
    <Layout>
      <PageHero
        title={t('about.humanResources')}
        subtitle={t('aboutPage.humanResources.subtitle')}
        image={images.heroHR}
      />

      {/* Intro + Stats */}
      <section className="py-28 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[120px] -mr-96 -mt-96" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-20 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-black text-xs uppercase tracking-[0.2em]"
            >
              <Users2 size={14} /> {t('aboutPage.humanResources.title')}
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]"
            >
              {t('aboutPage.humanResources.intro')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto"
            >
              {t('aboutPage.humanResources.description')}
            </motion.p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-0">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex flex-col items-center text-center group hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500"
              >
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500", stat.bg, stat.color)}>
                  <stat.icon size={32} />
                </div>
                <div className="text-4xl font-black text-slate-900 mb-2">{stat.value}</div>
                <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-28 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100/50 [mask-image:linear-gradient(0deg,transparent,white,transparent)]" />
        <div className="container mx-auto px-4 relative z-10">
          {/* Section header */}
          <div className="text-center max-w-4xl mx-auto mb-16 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary/10 text-primary font-black text-sm uppercase tracking-[0.2em]"
            >
              <Users2 size={16} /> {t('aboutPage.humanResources.team.sectionTitle')}
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight"
            >
              {t('aboutPage.humanResources.team.subtitle')}
            </motion.h2>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-14">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wide transition-all duration-300",
                  activeCategory === cat.key
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                )}
              >
                <cat.icon size={16} />
                {t(`aboutPage.humanResources.team.categories.${cat.key}`)}
              </button>
            ))}
          </div>

          {/* Team grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto"
            >
              {isLoading ? (
                <div className="col-span-full py-20 text-center text-slate-500 font-bold uppercase tracking-widest text-sm animate-pulse">
                  {t('aboutPage.humanResources.team.loading')}
                </div>
              ) : filteredMembers.length === 0 ? (
                <div className="col-span-full py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-sm">
                  {t('aboutPage.humanResources.team.noMembers')}
                </div>
              ) : (
                filteredMembers.map((member, idx) => {
                  const colors = CATEGORY_COLORS[member.organ_id as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.technique;
                  return (
                    <motion.div
                      key={`member-${member.id}`}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08, duration: 0.5 }}
                      onClick={() => handleMemberClick(member)}
                      className="group relative cursor-pointer"
                    >
                      <div className={cn(
                        "bg-white rounded-[2.5rem] p-7 border border-slate-100 shadow-lg hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500 flex flex-col items-center text-center ring-4 ring-transparent",
                        colors.ring
                      )}>
                        {/* Avatar */}
                        <div className={cn(
                          "relative w-28 h-28 rounded-full mb-6 overflow-hidden flex items-center justify-center transition-transform duration-500 group-hover:scale-105",
                          colors.icon
                        )}>
                          {member.photo_url ? (
                            <img src={getImageUrl(member.photo_url)} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <User size={48} className="text-slate-400 opacity-60" />
                          )}
                        </div>

                        {/* Name */}
                        <h3 className="text-lg font-black text-slate-900 leading-tight group-hover:text-primary transition-colors mb-1">
                          {member.name}
                        </h3>

                        {/* Post */}
                        <p className="text-sm text-primary font-semibold mb-4 leading-relaxed">
                          {(member.role as any)?.[locale] || member.role?.fr || member.role?.en || ""}
                        </p>

                        {/* Category badge */}
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                          colors.badge
                        )}>
                          {member.organ_id ? t(`aboutPage.humanResources.team.categories.${member.organ_id}`, { fallback: member.organ_id }) : "HR"}
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <MemberDetailDialog
        member={selectedMember}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      {/* CTA Section */}
      <section className="py-28 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10 mix-blend-overlay" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-center md:text-left space-y-4">
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">{t('aboutPage.humanResources.joinCta.title')}</h2>
              <p className="text-white/80 text-xl font-medium">{t('aboutPage.humanResources.joinCta.description')}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-12 py-6 bg-white text-primary rounded-full font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-50 transition-colors"
            >
              {t('aboutPage.humanResources.joinCta.button')}
              <ChevronRight size={20} />
            </motion.button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
