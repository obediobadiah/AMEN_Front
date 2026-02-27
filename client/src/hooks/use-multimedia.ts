import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api-config";

export interface Multimedia {
    id: number;
    title: Record<string, string>;
    media_url: string;
    thumbnail_url?: string;
    type?: string; // photo, video
    category?: Record<string, string>;
    album_id?: number;
    created_at: string;
}

export interface MultimediaCreate {
    title: string;
    media_url: string;
    thumbnail_url?: string;
    type?: string;
    category?: string;
    album_id?: number;
    source_lang?: string;
}

export interface MultimediaUpdate {
    title?: string | Record<string, string>;
    media_url?: string;
    thumbnail_url?: string;
    type?: string;
    category?: string | Record<string, string>;
    album_id?: number;
    source_lang?: string;
}

const MULTIMEDIA_API_URL = `${API_BASE_URL}/api/v1/multimedia`;

export function useMultimedia() {
    const queryClient = useQueryClient();

    const multimediaQuery = useQuery<Multimedia[]>({
        queryKey: ["/api/v1/multimedia"],
        queryFn: async () => {
            const res = await fetch(MULTIMEDIA_API_URL);
            if (!res.ok) throw new Error("Failed to fetch multimedia");
            return res.json();
        }
    });

    const createMutation = useMutation({
        mutationFn: async (newMedia: MultimediaCreate) => {
            const res = await fetch(MULTIMEDIA_API_URL + "/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newMedia),
            });
            if (!res.ok) throw new Error("Failed to create multimedia");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/multimedia"] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: MultimediaUpdate }) => {
            const res = await fetch(`${MULTIMEDIA_API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to update multimedia");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/multimedia"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`${MULTIMEDIA_API_URL}/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete multimedia");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/multimedia"] });
        },
    });

    const uploadMutation = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("file", file);

            const uploadUrl = `${MULTIMEDIA_API_URL}/upload`;

            const res = await fetch(uploadUrl, {
                method: "POST",
                body: formData,
            });
            if (!res.ok) throw new Error("Failed to upload file");
            return res.json();
        },
    });

    return {
        multimedia: multimediaQuery.data || [],
        isLoading: multimediaQuery.isLoading,
        error: multimediaQuery.error,
        createMultimedia: createMutation.mutateAsync,
        updateMultimedia: updateMutation.mutateAsync,
        deleteMultimedia: deleteMutation.mutateAsync,
        uploadFile: uploadMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        isUploading: uploadMutation.isPending,
    };
}
