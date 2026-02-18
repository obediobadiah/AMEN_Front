"use client";

import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { useTranslations } from 'next-intl';
import { images } from "@/lib/images";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function Contact() {
  const t = useTranslations();

  return (
    <Layout>
      <PageHero
        title={t('contactPage.title')}
        subtitle={t('contactPage.subtitle')}
        image={images.heroContact}
      />

      <section className="py-24 bg-background relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 -skew-x-12 translate-x-1/2 -z-10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-secondary/5 skew-x-12 -translate-x-1/2 -z-10 blur-3xl" />

        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

            {/* Contact Information */}
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-wider uppercase border border-primary/20"
                >
                  <MessageSquare size={14} />
                  <span>{t('nav.contact')}</span>
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-heading font-black text-foreground leading-tight">
                  {t('contactPage.subtitle')}
                </h2>
                <p className="text-xl text-muted-foreground font-light leading-relaxed">
                  {t('contactPage.intro')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8">
                {[
                  { icon: MapPin, title: t('contactPage.info.address'), details: t('contactPage.info.addressVal'), sub: t('contactPage.info.office') },
                  { icon: Phone, title: t('contactPage.info.phone'), details: t('contactPage.info.phoneVal'), sub: t('contactPage.info.hoursVal') },
                  { icon: Mail, title: t('contactPage.info.email'), details: t('contactPage.info.emailVal'), sub: "24/7 Support" },
                  { icon: Clock, title: t('contactPage.info.hours'), details: t('contactPage.info.hoursVal'), sub: "Except Holidays" }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-6 group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-muted group-hover:bg-primary transition-all duration-500 flex items-center justify-center text-primary group-hover:text-white shrink-0 shadow-lg shadow-black/5">
                      <item.icon size={26} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                        {item.title}
                      </h4>
                      <p className="text-xl font-bold text-foreground">
                        {item.details}
                      </p>
                      <p className="text-sm text-muted-foreground font-medium">
                        {item.sub}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-border/50 relative overflow-hidden"
              >
                {/* Form Top Accent */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1.5 bg-primary rounded-b-full" />

                <form className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground pl-1">
                        {t('contactPage.form.name')}
                      </label>
                      <Input
                        placeholder={t('contactPage.form.placeholders.name')}
                        className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/50 text-base px-6 shadow-inner"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground pl-1">
                        {t('contactPage.form.email')}
                      </label>
                      <Input
                        type="email"
                        placeholder={t('contactPage.form.placeholders.email')}
                        className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/50 text-base px-6 shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground pl-1">
                      {t('contactPage.form.subject')}
                    </label>
                    <Input
                      placeholder={t('contactPage.form.placeholders.subject')}
                      className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/50 text-base px-6 shadow-inner"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground pl-1">
                      {t('contactPage.form.message')}
                    </label>
                    <Textarea
                      placeholder={t('contactPage.form.placeholders.message')}
                      className="min-h-[200px] rounded-3xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/50 text-base p-6 shadow-inner resize-none"
                    />
                  </div>

                  <Button className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-xl shadow-xl shadow-primary/30 transition-all hover:-translate-y-1 active:translate-y-0 flex items-center gap-3">
                    {t('contactPage.form.send')}
                    <Send size={20} className="rotate-12" />
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section or Additional Info */}
      <section className="pb-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="h-[400px] md:h-[650px] rounded-[4rem] overflow-hidden bg-muted relative group shadow-2xl border border-border/50">
            <div className="absolute inset-0 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-[2000ms]">
              <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center transition-transform duration-[3000ms] group-hover:scale-110" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="absolute inset-0 flex items-center justify-center p-6"
            >
              <div className="bg-white/95 backdrop-blur-2xl p-10 md:p-12 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] max-w-md w-full space-y-8 transform group-hover:-translate-y-4 transition-all duration-700 border border-white/20">
                <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary mx-auto shadow-inner">
                  <MapPin size={42} />
                </div>
                <div className="text-center space-y-3">
                  <h4 className="text-3xl font-black font-heading text-slate-900">{t('contactPage.info.office')}</h4>
                  <p className="text-slate-500 text-lg font-light leading-relaxed">Kinshasa Gombe, Avenue de l'Equateur 12, RDC</p>
                </div>
                <Button className="w-full h-14 rounded-2xl bg-slate-950 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-black/10 hover:bg-primary transition-all">
                  {t('projectsPage.viewLocation')}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section (Refinement) */}
      <section className="py-24 bg-muted/20 border-t border-border/50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">Frequently Asked Questions</span>
              <h2 className="text-4xl md:text-5xl font-heading font-black">How Can We Help You?</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { q: "How can I volunteer for AMEN?", a: "You can apply through our 'Get Involved' page or by sending your CV to volunteer@amen-ngo.org." },
                { q: "Where does the donation money go?", a: "90% of all donations go directly to project implementation. We provide annual reports for transparency." },
                { q: "Do you offer internships?", a: "Yes, we have seasonal internship programs for students in social work, environment, and development." },
                { q: "How can my company partner with you?", a: "Contact our partnership department at partner@amen-ngo.org for corporate social responsibility opportunities." }
              ].map((faq, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-card p-8 rounded-[2.5rem] border border-border/40 hover:border-primary/30 transition-all duration-500"
                >
                  <h4 className="text-xl font-black font-heading mb-4 flex gap-3 text-foreground">
                    <span className="text-primary">Q.</span> {faq.q}
                  </h4>
                  <p className="text-muted-foreground font-light leading-relaxed">
                    {faq.a}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
