"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, Mail, Loader2, ArrowRight, ShieldCheck, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AdminLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push("/admin/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -right-[10%] w-[800px] h-[800px] rounded-full bg-primary/20 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-[10%] -left-[10%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[100px]"
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md px-4 relative z-10"
      >
        <div className="mb-10 text-center space-y-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6"
          >
            <ShieldCheck size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Admin Access Portal</span>
          </motion.div>
          <h1 className="text-4xl font-heading font-black text-white tracking-tight">
            AMEN <span className="text-primary text-opacity-80">Platform</span>
          </h1>
        </div>

        <Card className="border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] rounded-[2.5rem] overflow-hidden">
          <CardHeader className="text-center pt-10 pb-6">
            <div className="mx-auto w-20 h-20 from-primary to-primary/60 flex items-center justify-center mb-6 group transition-transform hover:scale-105 duration-500">
              {/* <Heart className="h-10 w-10 text-white fill-current group-hover:animate-pulse transition-all" /> */}
              <img
                src="/images/logo amen w.svg"
                alt="AMEN Logo"
                className="h-16 w-auto"
              />
            </div>
            <div>
              <CardTitle className="text-3xl font-heading font-bold text-white mb-2">Welcome Back</CardTitle>
              <CardDescription className="text-slate-400 text-base">Enter your administrator credentials</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-8 pb-10">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2.5">
                <Label className="text-slate-300 text-sm font-semibold ml-1">Email Address</Label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity" />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@amen.org"
                    className="h-14 pl-12 bg-white/[0.03] border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary/50 transition-all text-lg"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center ml-1">
                  <Label className="text-slate-300 text-sm font-semibold">Password</Label>
                  <button type="button" className="text-xs text-primary hover:text-primary/80 transition-colors font-medium">Forgot password?</button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity" />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-14 pl-12 bg-white/[0.03] border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary/50 transition-all text-lg"
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button
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
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        key="loading"
                        className="flex items-center justify-center"
                      >
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        <span>Authenticating...</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        key="ready"
                        className="flex items-center justify-center gap-2"
                      >
                        <span>Sign In to Dashboard</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </div>
            </form>

            <div className="mt-10 flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-600">
              <div className="h-px flex-1 bg-white/5" />
              <span>Encrypted Session</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>
          </CardContent>
        </Card>

        {/* Footer info */}
        <p className="mt-8 text-center text-slate-500 text-sm">
          Powered by AMEN Infrastructure &bull; 2024
        </p>
      </motion.div>
    </div>
  );
}
