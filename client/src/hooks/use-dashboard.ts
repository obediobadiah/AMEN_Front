import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api-config";

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
            const res = await fetch(`${API_BASE_URL}/dashboard/summary`);
            if (!res.ok) throw new Error("Failed to fetch dashboard summary");
            return res.json();
        }
    });
}
