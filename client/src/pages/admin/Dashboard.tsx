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
  Calendar,
  MessageSquare,
  TrendingUp,
  UserCheck
} from "lucide-react";
import {
  BarChart,
  Bar,
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

  const statCards = [
    {
      title: t("stats.totalDonations"),
      value: "$124,592",
      change: "+22.5%",
      isPositive: true,
      icon: Heart,
      color: "text-rose-500",
      bg: "bg-rose-50"
    },
    {
      title: t("stats.activeProjects"),
      value: "14",
      change: "+2",
      isPositive: true,
      icon: Activity,
      color: "text-emerald-500",
      bg: "bg-emerald-50"
    },
    {
      title: t("stats.communitiesReached"),
      value: "5,280",
      change: "+12%",
      isPositive: true,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      title: t("stats.pendingTasks"),
      value: "7",
      change: "-3",
      isPositive: false,
      icon: FileText,
      color: "text-amber-500",
      bg: "bg-amber-50"
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t("welcome")}</h2>
            <p className="text-slate-500 mt-1 font-medium">{t("overview")}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="h-12 px-6 rounded-xl bg-primary shadow-lg shadow-primary/20 hover:shadow-primary/30 font-bold transition-all">
              <Plus size={18} className="mr-2" /> {t("quickActions.newArticle")}
            </Button>
            <Button variant="outline" className="h-12 px-6 rounded-xl border-slate-200 bg-white shadow-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <Zap size={18} className="mr-2 text-primary" /> {t("quickActions.newProject")}
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden group hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-500">
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className={cn("p-4 rounded-2xl transition-transform duration-500 group-hover:scale-110", stat.bg, stat.color)}>
                      <stat.icon size={24} />
                    </div>
                    <div className={cn(
                      "flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-full",
                      stat.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    )}>
                      {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {stat.change}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.title}</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
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
                {[
                  { icon: Heart, color: "text-rose-500", bg: "bg-rose-50", text: t("recentActivity.newDonation", { amount: "$500" }), time: t("recentActivity.time", { time: "2m" }) },
                  { icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50", text: t("recentActivity.projectUpdate", { name: "Eco-Village" }), time: t("recentActivity.time", { time: "1h" }) },
                  { icon: UserCheck, color: "text-blue-500", bg: "bg-blue-50", text: t("recentActivity.newVolunteer", { name: "Mark J." }), time: t("recentActivity.time", { time: "3h" }) },
                  { icon: MessageSquare, color: "text-amber-500", bg: "bg-amber-50", text: t("recentActivity.newInquiry", { name: "Global Green" }), time: t("recentActivity.time", { time: "5h" }) },
                  { icon: Calendar, color: "text-indigo-500", bg: "bg-indigo-50", text: t("recentActivity.summitReg"), time: t("recentActivity.time", { time: "1j" }) }
                ].map((activity, i) => (
                  <div key={i} className="p-8 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className={cn("shrink-0 p-3 rounded-xl transition-transform group-hover:scale-110", activity.bg, activity.color)}>
                      <activity.icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-700 leading-snug">{activity.text}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{activity.time}</p>
                    </div>
                  </div>
                ))}
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
