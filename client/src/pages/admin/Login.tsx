"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Heart, Lock, Mail, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push("/admin/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-sidebar relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
         <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary blur-[100px]" />
         <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary blur-[120px]" />
      </div>

      <Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl relative z-10">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Heart className="h-8 w-8 text-white fill-current" />
          </div>
          <div>
            <CardTitle className="text-2xl font-heading text-white">Welcome Back</CardTitle>
            <CardDescription className="text-white/60">Enter your credentials to access the admin panel</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-white/80">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                <Input 
                  type="email" 
                  placeholder="admin@amen.org" 
                  className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-primary" 
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-white/80">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-primary" 
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-base font-medium transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Authenticating...
                </>
              ) : (
                "Sign In to Dashboard"
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-xs text-white/30">
            Protected by secure encrypted connection
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
