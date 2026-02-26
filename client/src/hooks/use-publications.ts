import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api-config";

export interface Publication {
    id: number;
    title: Record<string, string>;
    description?: Record<string, string>;
    category?: Record<string, string> | string;
    date?: string;
    file_url: string;
    thumbnail_url?: string;
    file_size?: string;
    file_type?: string;
    downloads?: number;
    created_at: string;
}

export interface PublicationCreate {
    title: string;
    description?: string;
    category?: string;
    date?: string;
    file_url: string;
    thumbnail_url?: string;
    file_size?: string;
    file_type?: string;
    source_lang?: string;
}

export interface PublicationUpdate {
    title?: Record<string, string> | string;
    description?: Record<string, string> | string;
    category?: string;
    date?: string;
    file_url?: string;
    thumbnail_url?: string;
    file_size?: string;
    file_type?: string;
    source_lang?: string;
}

const PUBLICATIONS_API_URL = `${API_BASE_URL}/api/v1/publications`;

export function usePublications() {
    const queryClient = useQueryClient();

    const publicationsQuery = useQuery<Publication[]>({
        queryKey: ["/api/v1/publications"],
        queryFn: async () => {
            const res = await fetch(PUBLICATIONS_API_URL);
            if (!res.ok) throw new Error("Failed to fetch publications");
            return res.json();
        }
    });

    const createMutation = useMutation({
        mutationFn: async (newPublication: PublicationCreate) => {
            const res = await fetch(PUBLICATIONS_API_URL + "/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPublication),
            });
            if (!res.ok) throw new Error("Failed to create publication");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/publications"] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: PublicationUpdate }) => {
            const res = await fetch(`${PUBLICATIONS_API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to update publication");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/publications"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`${PUBLICATIONS_API_URL}/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete publication");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/publications"] });
        },
    });

    const uploadMutation = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("file", file);

            const uploadUrl = `${PUBLICATIONS_API_URL}/upload`;

            const res = await fetch(uploadUrl, {
                method: "POST",
                body: formData,
            });
            if (!res.ok) throw new Error("Failed to upload file");
            return res.json(); // { file_url, thumbnail_url, file_size, file_type }
        },
    });

    const recordDownloadMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`${PUBLICATIONS_API_URL}/${id}/download`, {
                method: "POST",
            });
            if (!res.ok) throw new Error("Failed to record download");
            return res.json();
        },
        onSuccess: () => {
            // Invalidate to refresh the download count
            queryClient.invalidateQueries({ queryKey: ["/api/v1/publications"] });
        }
    });

    return {
        publications: publicationsQuery.data || [],
        isLoading: publicationsQuery.isLoading,
        error: publicationsQuery.error,
        createPublication: createMutation.mutateAsync,
        updatePublication: updateMutation.mutateAsync,
        deletePublication: deleteMutation.mutateAsync,
        uploadFile: uploadMutation.mutateAsync,
        recordDownload: recordDownloadMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        isUploading: uploadMutation.isPending,
    };
}

export function usePublication(id: string | number | undefined) {
    return useQuery<Publication>({
        queryKey: ["/api/v1/publications", id],
        queryFn: async () => {
            if (!id) throw new Error("ID is required");
            const res = await fetch(`${PUBLICATIONS_API_URL}/${id}`);
            if (!res.ok) throw new Error("Failed to fetch publication");
            return res.json();
        },
        enabled: !!id,
    });
}
