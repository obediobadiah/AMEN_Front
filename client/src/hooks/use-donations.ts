import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api-config";

export interface Donation {
    id: number;
    donor: string;
    email: string;
    amount: number;
    currency: string;
    frequency: string;
    method: string;
    status: string;
    created_at: string;
}

const DONATIONS_API_URL = `${API_BASE_URL}/api/v1/donations`;

export function useDonations() {
    const queryClient = useQueryClient();

    const donationsQuery = useQuery<Donation[]>({
        queryKey: ["/api/v1/donations"],
        queryFn: async () => {
            const res = await fetch(DONATIONS_API_URL + "/");
            if (!res.ok) throw new Error("Failed to fetch donations");
            return res.json();
        }
    });

    const createMutation = useMutation({
        mutationFn: async (data: Partial<Donation>) => {
            const res = await fetch(DONATIONS_API_URL + "/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to create donation");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/donations"] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: Partial<Donation> }) => {
            const res = await fetch(`${DONATIONS_API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to update donation");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/donations"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`${DONATIONS_API_URL}/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete donation");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/donations"] });
        },
    });

    return {
        donations: donationsQuery.data || [],
        isLoading: donationsQuery.isLoading,
        error: donationsQuery.error,
        createDonation: createMutation.mutateAsync,
        updateDonation: updateMutation.mutateAsync,
        deleteDonation: deleteMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
}
