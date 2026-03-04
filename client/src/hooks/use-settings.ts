import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api-config";
import { authFetch } from "@/hooks/use-auth";

export interface PortalSettings {
    id: number;
    org_name: string;
    primary_email: string;
    website_url: string;
    two_factor_enabled: boolean;
    activity_logging_enabled: boolean;
    maintenance_mode: boolean;
    updated_at?: string | null;
    updated_by?: number | null;
}

export interface PortalSettingsUpdate {
    org_name?: string;
    primary_email?: string;
    website_url?: string;
    two_factor_enabled?: boolean;
    activity_logging_enabled?: boolean;
    maintenance_mode?: boolean;
}

const SETTINGS_URL = `${API_BASE_URL}/api/v1/settings`;
const QUERY_KEY = ["/api/v1/settings"];

export function useSettings() {
    const queryClient = useQueryClient();

    const settingsQuery = useQuery<PortalSettings>({
        queryKey: QUERY_KEY,
        queryFn: async () => {
            const res = await authFetch(SETTINGS_URL);
            if (!res.ok) throw new Error("Failed to fetch settings");
            return res.json();
        },
        staleTime: 1000 * 60 * 5, // 5 min cache
    });

    const updateMutation = useMutation({
        mutationFn: async (updates: PortalSettingsUpdate) => {
            const res = await authFetch(SETTINGS_URL + "/", {
                method: "PUT",
                body: JSON.stringify(updates),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.detail || "Failed to update settings");
            }
            return res.json() as Promise<PortalSettings>;
        },
        onSuccess: (updated) => {
            queryClient.setQueryData(QUERY_KEY, updated);
        },
    });

    return {
        settings: settingsQuery.data,
        isLoading: settingsQuery.isLoading,
        error: settingsQuery.error,
        updateSettings: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
    };
}
