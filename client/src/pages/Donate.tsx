"use client";

import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { useTranslations } from 'next-intl';
import { images } from "@/lib/images";
import { Button } from "@/components/ui/button";
import {
    Heart,
    ShieldCheck,
    ArrowRight,
    CreditCard,
    Smartphone,
    Library,
    ChevronRight,
    Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

const donationAmounts = [10, 25, 50, 100, 250, 500];

export default function Donate() {
    const t = useTranslations();
    const [amount, setAmount] = useState<number | null>(50);
    const [customAmount, setCustomAmount] = useState<string>("");
    const [frequency, setFrequency] = useState<"oneTime" | "monthly">("oneTime");
    const [step, setStep] = useState(1);

    const handleNextStep = () => {
        setStep(prev => prev + 1);
    };

    return (
        <Layout>
            <PageHero
                title={t('donatePage.title')}
                subtitle={t('donatePage.subtitle')}
                image={images.heroDonate}
            />

            {/* Donation Experience */}
            <section className="py-24 bg-background relative overflow-hidden">
                {/* Abstract Background Design */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />

                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-20 items-start">

                        {/* Left Column: Impact & Info */}
                        <div className="lg:w-1/2 space-y-12">
                            <div className="space-y-8">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 text-primary text-xs font-black tracking-[0.2em] uppercase border border-primary/20 backdrop-blur-sm"
                                >
                                    <Heart size={12} className="mb-0.5" />
                                    <span>{t('donatePage.waysToGive')}</span>
                                </motion.div>
                                <h2 className="text-5xl md:text-7xl font-heading font-black text-foreground tracking-tight leading-[0.9]">
                                    {t('donatePage.title')}
                                </h2>
                                <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-xl">
                                    {t('donatePage.intro')}
                                </p>
                            </div>

                            {/* Impact Items */}
                            <div className="grid grid-cols-1 gap-6">
                                {[1, 2, 3].map((num) => (
                                    <motion.div
                                        key={num}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: num * 0.1 }}
                                        className="flex items-start gap-6 p-8 rounded-[2.5rem] bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors group"
                                    >
                                        <div className="w-14 h-14 shrink-0 rounded-2xl bg-white shadow-lg flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            {num === 1 && <Sparkles size={24} />}
                                            {num === 2 && <ShieldCheck size={24} />}
                                            {num === 3 && <Heart size={24} />}
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-xl font-black font-heading text-foreground">
                                                {t(`donatePage.impactSection.items.${num}.title`)}
                                            </h4>
                                            <p className="text-muted-foreground font-light">
                                                {t(`donatePage.impactSection.items.${num}.desc`)}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Transparency Badge */}
                            <div className="p-10 bg-slate-950 rounded-[3rem] text-white space-y-6 relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[60px] -z-0" />
                                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30 shrink-0">
                                        <ShieldCheck size={40} />
                                    </div>
                                    <div className="space-y-4 text-center md:text-left">
                                        <h4 className="text-2xl font-black font-heading">{t('donatePage.transparency.title')}</h4>
                                        <p className="text-slate-400 text-sm leading-relaxed font-light">
                                            {t('donatePage.transparency.desc')}
                                        </p>
                                        <Button variant="link" className="text-primary p-0 font-bold uppercase tracking-widest text-xs h-auto hover:text-white transition-colors">
                                            {t('donatePage.transparency.report')} <ChevronRight size={14} className="inline ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Donation Form */}
                        <div className="lg:w-1/2 w-full sticky top-32">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-card rounded-[4rem] border border-border/60 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden"
                            >
                                {/* Form Header */}
                                <div className="p-10 md:p-12 bg-muted/30 border-b border-border/50 text-center">
                                    <div className="flex p-2 bg-background rounded-full border border-border w-fit mx-auto mb-8 shadow-inner">
                                        {["oneTime", "monthly"].map((f) => (
                                            <button
                                                key={f}
                                                onClick={() => setFrequency(f as any)}
                                                className={cn(
                                                    "px-10 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-500",
                                                    frequency === f
                                                        ? "bg-primary text-white shadow-xl shadow-primary/25"
                                                        : "text-muted-foreground hover:text-foreground"
                                                )}
                                            >
                                                {t(`donatePage.${f}`)}
                                            </button>
                                        ))}
                                    </div>
                                    <h3 className="text-3xl font-black font-heading tracking-tight">{t('donatePage.form.amountLabel')}</h3>
                                </div>

                                {/* Amount Selection */}
                                <div className="p-10 md:p-12 space-y-10">
                                    <div className="grid grid-cols-3 gap-4">
                                        {donationAmounts.map((amt) => (
                                            <button
                                                key={amt}
                                                onClick={() => {
                                                    setAmount(amt);
                                                    setCustomAmount("");
                                                }}
                                                className={cn(
                                                    "h-20 rounded-3xl border text-2xl font-black transition-all flex items-center justify-center",
                                                    amount === amt && customAmount === ""
                                                        ? "bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-[1.05]"
                                                        : "bg-background text-foreground border-border/50 hover:border-primary/50"
                                                )}
                                            >
                                                ${amt}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Custom Amount */}
                                    <div className="relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-muted-foreground">$</span>
                                        <input
                                            type="number"
                                            placeholder={t('donatePage.form.customAmount')}
                                            value={customAmount}
                                            onChange={(e) => {
                                                setCustomAmount(e.target.value);
                                                setAmount(null);
                                            }}
                                            className="w-full h-20 rounded-3xl bg-muted/30 border border-border/50 px-12 text-2xl font-black outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                        />
                                    </div>

                                    {/* Payment Methods (Preview) */}
                                    <div className="space-y-6 pt-6 border-t border-border/50">
                                        <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground text-center">
                                            {t('donatePage.payment.title')}
                                        </p>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="flex flex-col items-center gap-3 p-6 rounded-[2rem] bg-muted/20 border border-border/40 text-muted-foreground grayscale hover:grayscale-0 hover:border-primary/40 hover:text-primary transition-all cursor-pointer">
                                                <CreditCard size={28} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Card</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-3 p-6 rounded-[2rem] bg-muted/20 border border-border/40 text-muted-foreground grayscale hover:grayscale-0 hover:border-primary/40 hover:text-primary transition-all cursor-pointer">
                                                <Smartphone size={28} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Mobile</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-3 p-6 rounded-[2rem] bg-muted/20 border border-border/40 text-muted-foreground grayscale hover:grayscale-0 hover:border-primary/40 hover:text-primary transition-all cursor-pointer">
                                                <Library size={28} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Bank</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Button className="w-full h-20 rounded-[2rem] bg-foreground hover:bg-primary text-background font-black text-xl uppercase tracking-widest transition-all shadow-2xl shadow-black/10 flex items-center justify-center gap-4 group">
                                        {t('donatePage.form.nextStep')}
                                        <ArrowRight size={24} className="transition-transform group-hover:translate-x-2" />
                                    </Button>

                                    <p className="text-center text-[10px] text-muted-foreground font-medium flex items-center justify-center gap-2">
                                        <ShieldCheck size={14} className="text-primary" />
                                        {t('donatePage.payment.secure')}
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
