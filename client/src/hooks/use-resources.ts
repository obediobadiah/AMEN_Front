import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api-config";

export interface ResourceItem {
    id: number;
    title: Record<string, string>;
    description?: Record<string, string>;
    category?: string;
    file_url?: string;
    file_type?: string;
    file_size?: string;
    created_at: string;
}

export interface ResourceCreate {
    title: string | Record<string, string>;
    description?: string | Record<string, string>;
    category?: string;
    file_url?: string;
    file_type?: string;
    file_size?: string;
    source_lang: string;
}

export interface ResourceUpdate {
    title?: string | Record<string, string>;
    description?: string | Record<string, string>;
    category?: string;
    file_url?: string;
    file_type?: string;
    file_size?: string;
    source_lang?: string;
}

const RESOURCES_API_URL = `${API_BASE_URL}/api/v1/resources`;

export function useResources() {
    const queryClient = useQueryClient();

    const resourcesQuery = useQuery<ResourceItem[]>({
        queryKey: ["/api/v1/resources"],
        queryFn: async () => {
            const res = await fetch(RESOURCES_API_URL);
            if (!res.ok) throw new Error("Failed to fetch resources");
            return res.json();
        }
    });

    const createMutation = useMutation({
        mutationFn: async (newResource: ResourceCreate) => {
            const res = await fetch(RESOURCES_API_URL + "/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newResource),
            });
            if (!res.ok) throw new Error("Failed to create resource");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/resources"] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: ResourceUpdate }) => {
            const res = await fetch(`${RESOURCES_API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to update resource");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/resources"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`${RESOURCES_API_URL}/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete resource");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/resources"] });
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
        resources: resourcesQuery.data || [],
        isLoading: resourcesQuery.isLoading,
        error: resourcesQuery.error,
        createResource: createMutation.mutateAsync,
        updateResource: updateMutation.mutateAsync,
        deleteResource: deleteMutation.mutateAsync,
        uploadFile: uploadMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        isUploading: uploadMutation.isPending,
    };
}
