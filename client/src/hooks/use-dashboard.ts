import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api-config";
import { authFetch } from "@/hooks/use-auth";

export interface DashboardStats {
    totalDonations: string;
    donationsThisMonth: string;
    donationsLastMonth: string;
    donationGrowth: string;
    activeProjects: number;
    completedProjects: number;
    totalProjects: number;
    pendingTasks: number;
    totalUsers: number;
    adminUsers: number;
    staffUsers: number;
    publishedNews: number;
    upcomingEvents: number;
    totalEvents: number;
    totalResources: number;
    totalMultimedia: number;
    totalInquiries: number;
}

export interface Activity {
    type: "donation" | "inquiry" | "user" | "news";
    text: string;
    time: string;
    status: string;
    metadata?: Record<string, any>;
}

export interface MonthlyTrend {
    month: string;
    donations: number;
    inquiries: number;
    timestamp: string;
}

export interface DashboardSummary {
    stats: DashboardStats;
    recentActivity: Activity[];
    monthlyTrends: MonthlyTrend[];
    lastUpdated: string;
}

export function useDashboard() {
    return useQuery<DashboardSummary>({
        queryKey: ["/api/v1/dashboard/summary"],
        queryFn: async () => {
            const res = await authFetch(`${API_BASE_URL}/api/v1/dashboard/summary`);
            if (!res.ok) throw new Error("Failed to fetch dashboard summary");
            return res.json();
        },
        staleTime: 1000 * 60 * 2, // 2 min cache
        retry: 1,
    });
}

export function useQuickStats() {
    return useQuery({
        queryKey: ["/api/v1/dashboard/quick-stats"],
        queryFn: async () => {
            const res = await authFetch(`${API_BASE_URL}/api/v1/dashboard/quick-stats`);
            if (!res.ok) throw new Error("Failed to fetch quick stats");
            return res.json();
        },
        staleTime: 1000 * 60 * 5, // 5 min cache
        retry: 1,
    });
}

export function useDashboardTrends() {
    return useQuery<{ monthlyTrends: MonthlyTrend[], lastUpdated: string }>({
        queryKey: ["/api/v1/dashboard/trends"],
        queryFn: async () => {
            const res = await authFetch(`${API_BASE_URL}/api/v1/dashboard/trends`);
            if (!res.ok) throw new Error("Failed to fetch dashboard trends");
            return res.json();
        },
        staleTime: 1000 * 60 * 10, // 10 min cache
        retry: 1,
    });
}
