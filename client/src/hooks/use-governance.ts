import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api-config";

export interface GovernanceMember {
    id: number;
    name: string;
    role: Record<string, string>;
    bio?: Record<string, string>;
    photo_url?: string;
    organ_id?: string;
    order?: number;
    group_type?: string;
    created_at: string;
}

export interface GovernanceCreate {
    name: string;
    role: string | Record<string, string>;
    bio?: string | Record<string, string>;
    photo_url?: string;
    organ_id?: string;
    order?: number;
    group_type?: string;
    source_lang: string;
}

export interface GovernanceUpdate {
    name?: string;
    role?: string | Record<string, string>;
    bio?: string | Record<string, string>;
    photo_url?: string;
    organ_id?: string;
    order?: number;
    group_type?: string;
    source_lang?: string;
}

const GOVERNANCE_API_URL = `${API_BASE_URL}/api/v1/governance`;

export function useGovernance(groupType?: string) {
    const queryClient = useQueryClient();

    const governanceQuery = useQuery<GovernanceMember[]>({
        queryKey: ["/api/v1/governance", groupType],
        queryFn: async () => {
            const url = groupType ? `${GOVERNANCE_API_URL}?group_type=${groupType}` : GOVERNANCE_API_URL;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch governance members");
            return res.json();
        }
    });

    const createMutation = useMutation({
        mutationFn: async (newMember: GovernanceCreate) => {
            const res = await fetch(GOVERNANCE_API_URL + "/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newMember),
            });
            if (!res.ok) throw new Error("Failed to create member");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/governance"] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: GovernanceUpdate }) => {
            const res = await fetch(`${GOVERNANCE_API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to update member");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/governance"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`${GOVERNANCE_API_URL}/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete member");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/governance"] });
        },
    });

    const uploadMutation = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("file", file);

            const uploadUrl = `${API_BASE_URL}/api/v1/multimedia/upload`;

            const res = await fetch(uploadUrl, {
                method: "POST",
                body: formData,
            });
            if (!res.ok) throw new Error("Failed to upload file");
            return res.json();
        },
    });

    return {
        members: governanceQuery.data || [],
        isLoading: governanceQuery.isLoading,
        error: governanceQuery.error,
        createMember: createMutation.mutateAsync,
        updateMember: updateMutation.mutateAsync,
        deleteMember: deleteMutation.mutateAsync,
        uploadFile: uploadMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        isUploading: uploadMutation.isPending,
    };
}
