import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api-config";
import { authFetch } from "@/hooks/use-auth";

export interface DashboardStats {
    totalDonations: string;
    activeProjects: number;
    communitiesReached: string;
    pendingTasks: number;
}

export interface Activity {
    type: "donation" | "inquiry";
    text: string;
    time: string;
    status: string;
}

export interface DashboardSummary {
    stats: DashboardStats;
    recentActivity: Activity[];
}

export function useDashboard() {
    return useQuery<DashboardSummary>({
        queryKey: ["/api/v1/dashboard/summary"],
        queryFn: async () => {
            // Fixed: was missing /api/v1 prefix
            const res = await authFetch(`${API_BASE_URL}/api/v1/dashboard/summary`);
            if (!res.ok) throw new Error("Failed to fetch dashboard summary");
            return res.json();
        },
        staleTime: 1000 * 60 * 2, // 2 min cache
        retry: 1,
    });
}
