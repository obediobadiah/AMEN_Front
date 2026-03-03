import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api-config";

export interface Inquiry {
    id: number;
    type: string; // contact, volunteer, partner, newsletter
    name?: string;
    email: string;
    subject?: string;
    message?: string;
    data?: any;
    status: string;
    created_at: string;
}

const INQUIRIES_API_URL = `${API_BASE_URL}/api/v1/inquiries`;

export function useInquiries() {
    const queryClient = useQueryClient();

    const inquiriesQuery = useQuery<Inquiry[]>({
        queryKey: ["/api/v1/inquiries"],
        queryFn: async () => {
            const res = await fetch(INQUIRIES_API_URL + "/");
            if (!res.ok) throw new Error("Failed to fetch inquiries");
            return res.json();
        }
    });

    const createMutation = useMutation({
        mutationFn: async (data: Partial<Inquiry>) => {
            const res = await fetch(INQUIRIES_API_URL + "/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to create inquiry");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/inquiries"] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: Partial<Inquiry> }) => {
            const res = await fetch(`${INQUIRIES_API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to update inquiry");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/inquiries"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`${INQUIRIES_API_URL}/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete inquiry");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/inquiries"] });
        },
    });

    return {
        inquiries: inquiriesQuery.data || [],
        isLoading: inquiriesQuery.isLoading,
        error: inquiriesQuery.error,
        createInquiry: createMutation.mutateAsync,
        updateInquiry: updateMutation.mutateAsync,
        deleteInquiry: deleteMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
}
