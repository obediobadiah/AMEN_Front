"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, Mail, Loader2, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useTranslations } from "next-intl";

export default function AdminLogin() {
  const router = useRouter();
  const { login } = useAuth();
  const t = useTranslations("admin.login");

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login({ email, password });
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || t("errorFallback"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] relative overflow-hidden font-sans">

      {/* Decorative glows — pointer-events-none so they never intercept clicks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -right-[10%] w-[800px] h-[800px] rounded-full bg-primary/20 blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-[10%] -left-[10%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[100px]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md px-4 relative z-10"
      >
        {/* Header */}
        <div className="mb-10 text-center space-y-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6"
          >
            <ShieldCheck size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">{t("badge")}</span>
          </motion.div>
          <h1 className="text-4xl font-heading font-black text-white tracking-tight">
            {t("title")} <span className="text-primary">{t("titleHighlight")}</span>
          </h1>
        </div>

        {/* Login Card */}
        <Card className="border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] rounded-[2.5rem] overflow-hidden">
          <CardHeader className="text-center pt-10 pb-6">
            <div className="mx-auto mb-6">
              <img src="/images/logo amen w.svg" alt="AMEN Logo" className="h-16 w-auto" />
            </div>
            <CardTitle className="text-3xl font-heading font-bold text-white mb-2">{t("cardTitle")}</CardTitle>
            <CardDescription className="text-slate-400 text-base">{t("cardDesc")}</CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-10">
            <form onSubmit={handleLogin} className="space-y-6">

              {/* Error banner */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl px-4 py-3 text-sm font-medium"
                  >
                    <AlertCircle size={16} className="shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email */}
              <div className="space-y-2.5">
                <Label htmlFor="admin-email" className="text-slate-300 text-sm font-semibold ml-1">
                  {t("emailLabel")}
                </Label>
                {/* wrapper is purely visual — pointer-events-none on the glow layer */}
                <div className="relative">
                  {/* Glow overlay — must have pointer-events-none */}
                  <div
                    className="absolute inset-0 bg-primary/5 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"
                    aria-hidden="true"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 pointer-events-none" aria-hidden="true" />
                  <Input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(null); }}
                    placeholder={t("emailPlaceholder")}
                    className="h-14 pl-12 bg-white/[0.03] border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary/50 transition-all text-base"
                    required
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2.5">
                <Label htmlFor="admin-password" className="text-slate-300 text-sm font-semibold ml-1">
                  {t("passwordLabel")}
                </Label>
                <div className="relative">
                  <div
                    className="absolute inset-0 bg-primary/5 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"
                    aria-hidden="true"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 pointer-events-none" aria-hidden="true" />
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(null); }}
                    placeholder={t("passwordPlaceholder")}
                    className="h-14 pl-12 pr-12 bg-white/[0.03] border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary/50 transition-all text-base"
                    required
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                  {/* Show/hide password toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <Button
                  id="admin-login-submit"
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white text-lg font-bold shadow-xl shadow-primary/20 transition-all duration-300 group overflow-hidden relative",
                    isLoading && "opacity-80"
                  )}
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>{t("authenticating")}</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="ready"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <span>{t("signIn")}</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </div>
            </form>

            {/* Default credentials hint */}
            {/* <div className="mt-8 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-600">
                {t("defaultCredentials")}
              </p>
              <p className="text-center text-xs text-slate-500 mt-1">
                admin@amen-ngo.org &bull; Admin@2024!
              </p>
            </div> */}

            <div className="mt-8 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-600">
                <div className="h-px flex-1 bg-white/5" />
                <span>{t("encryptedSession")}</span>
                <div className="h-px flex-1 bg-white/5" />
              </div>
            </div>


            {/* Session footer */}
            {/* <div className="mt-6 flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-600">
              <div className="h-px flex-1 bg-white/5" />
              <span>{t("encryptedSession")}</span>
              <div className="h-px flex-1 bg-white/5" />
            </div> */}
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-slate-500 text-sm">{t("poweredBy")} {new Date().getFullYear()}</p>
      </motion.div>
    </div>
  );
}
