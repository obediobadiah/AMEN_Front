"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Users,
  Heart,
  FileText,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Plus,
  MessageSquare,
  TrendingUp,
  Loader2
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/AdminLayout";
import { cn } from "@/lib/utils";
import { useDashboard } from "@/hooks/use-dashboard";
import { formatDistanceToNow } from "date-fns";

const donationData = [
  { name: 'Jan', value: 4500, secondary: 2400 },
  { name: 'Feb', value: 5200, secondary: 1398 },
  { name: 'Mar', value: 4800, secondary: 9800 },
  { name: 'Apr', value: 6100, secondary: 3908 },
  { name: 'May', value: 5900, secondary: 4800 },
  { name: 'Jun', value: 7200, secondary: 3800 },
  { name: 'Jul', value: 8500, secondary: 4300 },
];

export default function AdminDashboard() {
  const t = useTranslations("admin.dashboard");
  const commonT = useTranslations("admin.common");
  const { data: summary, isLoading } = useDashboard();

  const statCards = [
    {
      title: t("stats.totalDonations"),
      value: summary?.stats.totalDonations || "$0.00",
      change: "+0%",
      isPositive: true,
      icon: Heart,
      color: "text-rose-500",
      bg: "bg-rose-50"
    },
    {
      title: t("stats.activeProjects"),
      value: summary?.stats.activeProjects.toString() || "0",
      change: "+0",
      isPositive: true,
      icon: Activity,
      color: "text-emerald-500",
      bg: "bg-emerald-50"
    },
    {
      title: t("stats.communitiesReached"),
      value: summary?.stats.communitiesReached || "0",
      change: "+0%",
      isPositive: true,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      title: t("stats.pendingTasks"),
      value: summary?.stats.pendingTasks.toString() || "0",
      change: "0",
      isPositive: summary?.stats.pendingTasks === 0,
      icon: FileText,
      color: "text-amber-500",
      bg: "bg-amber-50"
    }
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex h-[70vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-xl font-black text-slate-400 animate-pulse italic">{commonT("loading")}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 md:space-y-10">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{t("welcome")}</h2>
            <p className="text-sm md:text-base text-slate-500 mt-1 font-medium">{t("overview")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button className="flex-1 sm:flex-none h-11 md:h-12 px-4 md:px-6 rounded-xl bg-primary shadow-lg shadow-primary/20 hover:shadow-primary/30 font-bold transition-all text-sm md:text-base">
              <Plus size={18} className="mr-2" /> {t("quickActions.newArticle")}
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none h-11 md:h-12 px-4 md:px-6 rounded-xl border-slate-200 bg-white shadow-sm font-bold text-slate-600 hover:bg-slate-50 transition-all text-sm md:text-base">
              <Zap size={18} className="mr-2 text-primary" /> {t("quickActions.newProject")}
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {statCards.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-500 h-full">
                <CardContent className="p-6 md:p-8">
                  <div className="flex justify-between items-start mb-4 md:mb-6">
                    <div className={cn("p-3 md:p-4 rounded-xl md:rounded-2xl transition-transform duration-500 group-hover:scale-110", stat.bg, stat.color)}>
                      <stat.icon size={20} className="md:size-6" />
                    </div>
                    <div className={cn(
                      "flex items-center gap-1 text-[10px] md:text-xs font-black px-2 md:px-2.5 py-0.5 md:py-1 rounded-full",
                      stat.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    )}>
                      {stat.isPositive ? <ArrowUpRight size={12} className="md:size-[14px]" /> : <ArrowDownRight size={12} className="md:size-[14px]" />}
                      {stat.change}
                    </div>
                  </div>
                  <div className="space-y-0.5 md:space-y-1">
                    <p className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.title}</p>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Growth Chart */}
          <Card className="lg:col-span-2 border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="p-10 pb-0 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black text-slate-900 tracking-tight">{t("charts.donationImpact")}</CardTitle>
                <CardDescription className="text-slate-400 font-medium">{t("charts.analyticsDesc")}</CardDescription>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl">
                <Button variant="ghost" size="sm" className="rounded-lg h-8 px-3 text-[10px] font-black uppercase tracking-widest bg-white shadow-sm text-primary">{t("charts.monthly")}</Button>
                <Button variant="ghost" size="sm" className="rounded-lg h-8 px-3 text-[10px] font-black uppercase tracking-widest text-slate-400">{t("charts.weekly")}</Button>
              </div>
            </CardHeader>
            <CardContent className="p-10 pt-6">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={donationData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="name"
                      stroke="#94a3b8"
                      fontSize={10}
                      fontWeight={900}
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={10}
                      fontWeight={900}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }}
                      contentStyle={{
                        borderRadius: '20px',
                        border: 'none',
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                        padding: '16px 20px'
                      }}
                      itemStyle={{ fontWeight: 900, fontSize: '12px' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Activity Sidebar */}
          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="p-10 pb-6 border-b border-slate-50">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp size={20} className="text-primary" />
                <CardTitle className="text-xl font-black text-slate-900 tracking-tight">{t("recentActivity.title")}</CardTitle>
              </div>
              <CardDescription className="text-slate-400 font-medium">{t("recentActivity.description")}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {(summary?.recentActivity || []).map((activity, i) => {
                  const Icon = activity.type === "donation" ? Heart : MessageSquare;
                  const color = activity.type === "donation" ? "text-rose-500" : "text-amber-500";
                  const bg = activity.type === "donation" ? "bg-rose-50" : "bg-amber-50";

                  return (
                    <div key={i} className="p-8 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                      <div className={cn("shrink-0 p-3 rounded-xl transition-transform group-hover:scale-110", bg, color)}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-700 leading-snug">{activity.text}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">
                          {formatDistanceToNow(new Date(activity.time))} ago
                        </p>
                      </div>
                    </div>
                  );
                })}
                {(!summary || summary.recentActivity.length === 0) && (
                  <div className="p-20 text-center">
                    <p className="text-sm font-bold text-slate-400 italic">No recent activity</p>
                  </div>
                )}
              </div>
              <div className="p-8">
                <Button variant="ghost" className="w-full h-14 rounded-2xl bg-slate-50 font-black text-xs uppercase tracking-widest text-slate-500 hover:text-primary transition-all">
                  {t("recentActivity.showAll")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
