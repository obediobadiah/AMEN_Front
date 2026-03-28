"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
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
  Loader2,
  Calendar,
  DollarSign,
  UserCheck,
  Newspaper,
  Image,
  Download,
  Mail,
  Link2,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from "recharts";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/AdminLayout";
import { cn } from "@/lib/utils";
import { useDashboard, useDashboardTrends } from "@/hooks/use-dashboard";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboard() {
  const t = useTranslations("admin.dashboard");
  const commonT = useTranslations("admin.common");
  const { data: summary, isLoading } = useDashboard();
  const { data: trends } = useDashboardTrends();

  const statCards = [
    {
      title: t("stats.totalDonations"),
      value: summary?.stats.totalDonations || "$0.00",
      subtitle: summary?.stats.donationsThisMonth ? t("subtitles.lastMonthThisMonth", { lastMonth: summary.stats.donationsLastMonth, thisMonth: summary.stats.donationsThisMonth }) : t("subtitles.noDonationsThisMonth"),
      change: summary?.stats.donationGrowth || "+0%",
      isPositive: (summary?.stats.donationGrowth?.startsWith("+") ?? true),
      icon: Heart,
      color: "text-rose-500",
      bg: "bg-rose-50",
      trend: summary?.stats.donationGrowth?.startsWith("+") ? "up" : summary?.stats.donationGrowth?.startsWith("-") ? "down" : "stable"
    },
    {
      title: t("stats.activeProjects"),
      value: summary?.stats.activeProjects?.toString() || "0",
      subtitle: t("subtitles.completedTotal", { completed: summary?.stats.completedProjects || 0, total: summary?.stats.totalProjects || 0 }),
      change: summary?.stats.activeProjects && summary?.stats.activeProjects > 0 ? t("subtitles.completionRate", { rate: Math.round(((summary?.stats.completedProjects || 0) / (summary?.stats.activeProjects || 1)) * 100) }) : t("subtitles.noActiveProjects"),
      isPositive: (summary?.stats.activeProjects || 0) > 0,
      icon: Activity,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      trend: (summary?.stats.activeProjects || 0) > (summary?.stats.completedProjects || 0) ? "up" : "stable"
    },
    {
      title: t("stats.pendingTasks"),
      value: summary?.stats.pendingTasks?.toString() || "0",
      subtitle: t("subtitles.totalInquiriesResolved", { total: summary?.stats.totalInquiries || 0, resolved: ((summary?.stats.totalInquiries || 0) - (summary?.stats.pendingTasks || 0)) }),
      change: summary?.stats.pendingTasks === 0 ? t("subtitles.allCaughtUp") : t("subtitles.needAttention", { count: summary?.stats.pendingTasks || 0 }),
      isPositive: summary?.stats.pendingTasks === 0,
      icon: Mail,
      color: summary?.stats.pendingTasks === 0 ? "text-emerald-500" : "text-amber-500",
      bg: summary?.stats.pendingTasks === 0 ? "bg-emerald-50" : "bg-amber-50",
      trend: summary?.stats.pendingTasks === 0 ? "stable" : "down"
    }
  ];

  const secondaryStats = [
    {
      title: t("secondaryStats.totalUsers"),
      value: summary?.stats.totalUsers.toString() || "0",
      subtitle: `${summary?.stats.adminUsers || 0} admins, ${summary?.stats.staffUsers || 0} staff`,
      icon: UserCheck,
      color: "text-purple-500",
      bg: "bg-purple-50"
    },
    {
      title: t("secondaryStats.publishedNews"),
      value: summary?.stats.publishedNews.toString() || "0",
      subtitle: t("secondaryStats.articlesPublished"),
      icon: Newspaper,
      color: "text-indigo-500",
      bg: "bg-indigo-50"
    },
    {
      title: t("secondaryStats.upcomingEvents"),
      value: summary?.stats.upcomingEvents.toString() || "0",
      subtitle: `${t("secondaryStats.total")}: ${summary?.stats.totalEvents || 0}`,
      icon: Calendar,
      color: "text-orange-500",
      bg: "bg-orange-50"
    },
    {
      title: t("secondaryStats.resources"),
      value: summary?.stats.totalResources.toString() || "0",
      subtitle: `${summary?.stats.totalMultimedia || 0} ${t("secondaryStats.multimediaFiles")}`,
      icon: Download,
      color: "text-teal-500",
      bg: "bg-teal-50"
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

  // Prepare chart data from trends or fallback to static data
  const chartData = trends?.monthlyTrends.map(trend => ({
    name: trend.month,
    donations: trend.donations,
    inquiries: trend.inquiries
  })) || [
    { name: 'Jan', donations: 4500, inquiries: 12 },
    { name: 'Feb', donations: 5200, inquiries: 18 },
    { name: 'Mar', donations: 4800, inquiries: 15 },
    { name: 'Apr', donations: 6100, inquiries: 22 },
    { name: 'May', donations: 5900, inquiries: 19 },
    { name: 'Jun', donations: 7200, inquiries: 25 },
  ];

  // Get trend icon based on trend direction
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <ArrowUpRight size={12} className="md:size-[14px]" />;
      case "down": return <ArrowDownRight size={12} className="md:size-[14px]" />;
      default: return <div className="w-3 h-3 rounded-full bg-slate-300" />;
    }
  };

  // Get trend color based on trend direction
  const getTrendColor = (trend: string, isPositive: boolean) => {
    if (trend === "up") return "bg-emerald-50 text-emerald-600";
    if (trend === "down") return "bg-rose-50 text-rose-600";
    return isPositive ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600";
  };

  // Get activity icon based on type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "donation": return Heart;
      case "inquiry": return MessageSquare;
      case "user": return UserCheck;
      case "news": return Newspaper;
      default: return Activity;
    }
  };

  // Get activity color based on type
  const getActivityColor = (type: string) => {
    switch (type) {
      case "donation": return { color: "text-rose-500", bg: "bg-rose-50" };
      case "inquiry": return { color: "text-amber-500", bg: "bg-amber-50" };
      case "user": return { color: "text-purple-500", bg: "bg-purple-50" };
      case "news": return { color: "text-indigo-500", bg: "bg-indigo-50" };
      default: return { color: "text-slate-500", bg: "bg-slate-50" };
    }
  };

  // Translate activity text based on type and metadata
  const translateActivityText = (activity: any) => {
    switch (activity.type) {
      case "donation":
        return t("activities.donationOf", { amount: activity.metadata?.amount || activity.text.match(/\$(\d+)/)?.[1] || "0", donor: activity.metadata?.email || "Unknown" });
      case "inquiry":
        return t("activities.inquiryFrom", { type: activity.metadata?.subject || "Contact", name: activity.metadata?.email || "Unknown" });
      case "user":
        return t("activities.newUserRegistered", { role: activity.metadata?.role || "user", name: activity.metadata?.email || "Unknown" });
      case "news":
        return t("activities.newsPublished", { title: activity.metadata?.title || "Article" });
      default:
        return activity.text;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 md:space-y-10">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{t("welcome")}</h2>
            <p className="text-sm md:text-base text-slate-500 mt-1 font-medium">
              {t("overview")} • Last updated: {summary?.lastUpdated ? new Date(summary.lastUpdated).toLocaleTimeString() : 'Unknown'}
            </p>
          </div>
          <div className="flex flex-wrap items-center sm:justify-end lg:justify-center gap-3">
            <Link 
              href="/admin/news"
              className="p-3 flex-1 sm:flex-none h-11 md:h-12 px-4 md:px-6 rounded-xl bg-primary items-center justify-center shadow-lg shadow-primary/20 hover:shadow-primary/30 font-bold transition-all text-sm md:text-base group relative overflow-hidden text-white"
            >
              <div className="inset-0 bg-gradient-to-r from-transparent via-white/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <span className="flex items-center justify-center gap-2">
                <Plus size={18} /> {t("quickActions.newArticle")}
              </span>
            </Link>
            <Link 
              href="/admin/projects"
              className="p-3 flex-1 sm:flex-none h-11 md:h-12 px-4 md:px-6 rounded-xl border-slate-200 bg-white items-center justify-center shadow-sm font-bold text-slate-600 hover:bg-slate-50 hover:border-primary transition-all text-sm md:text-base group relative overflow-hidden"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-50 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
               <span className="relative z-10 flex items-center justify-center gap-2">
                 <Zap size={18} className="text-primary" /> {t("quickActions.newProject")}
               </span>
            </Link>
          </div>
        </div>

        {/* Primary Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
                      getTrendColor(stat.trend || "stable", stat.isPositive)
                    )}>
                      {getTrendIcon(stat.trend || "stable")}
                      {stat.change}
                    </div>
                  </div>
                  <div className="space-y-0.5 md:space-y-1">
                    <p className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.title}</p>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
                    {stat.subtitle && (
                      <p className="text-xs text-slate-500 font-medium">{stat.subtitle}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Secondary Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {secondaryStats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 + 0.4 }}
            >
              <Card className="border-none shadow-lg shadow-slate-200/30 rounded-xl overflow-hidden group hover:shadow-xl hover:shadow-slate-300/40 transition-all duration-500">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-4">
                    <div className={cn("p-2.5 md:p-3 rounded-xl transition-transform duration-500 group-hover:scale-110", stat.bg, stat.color)}>
                      <stat.icon size={16} className="md:size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.title}</p>
                      <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
                      {stat.subtitle && (
                        <p className="text-xs text-slate-500 font-medium truncate">{stat.subtitle}</p>
                      )}
                    </div>
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
                {/* <Button variant="ghost" size="sm" className="rounded-lg h-8 px-3 text-[10px] font-black uppercase tracking-widest text-slate-400">{t("charts.weekly")}</Button> */}
              </div>
            </CardHeader>
            <CardContent className="p-10 pt-6">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorInquiries" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
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
                      dataKey="donations"
                      stroke="hsl(var(--primary))"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorDonations)"
                      name="Donations ($)"
                    />
                    <Area
                      type="monotone"
                      dataKey="inquiries"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorInquiries)"
                      name="Inquiries"
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
              <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto">
                {(summary?.recentActivity || []).map((activity, i) => {
                  const Icon = getActivityIcon(activity.type);
                  const colors = getActivityColor(activity.type);

                  return (
                    <div key={i} className="p-8 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                      <div className={cn("shrink-0 p-3 rounded-xl transition-transform group-hover:scale-110", colors.bg, colors.color)}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-700 leading-snug">{translateActivityText(activity)}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">
                          {formatDistanceToNow(new Date(activity.time))} ago
                        </p>
                      </div>
                    </div>
                  );
                })}
                {(!summary || summary.recentActivity.length === 0) && (
                  <div className="p-20 text-center">
                    <p className="text-sm font-bold text-slate-400 italic">{t("activities.noRecentActivity")}</p>
                  </div>
                )}
              </div>
              {/* <div className="p-8">
                <Button variant="ghost" className="w-full h-14 rounded-2xl bg-slate-50 font-black text-xs uppercase tracking-widest text-slate-500 hover:text-primary transition-all">
                  {t("recentActivity.showAll")}
                </Button>
              </div> */}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
