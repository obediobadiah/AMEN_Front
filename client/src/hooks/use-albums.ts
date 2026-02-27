import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api-config";

export interface Album {
    id: number;
    name: Record<string, string>;
    description?: Record<string, string>;
    thumbnail_url?: string;
    is_public: boolean;
    created_at: string;
}

export interface AlbumCreate {
    name: string;
    description?: string;
    thumbnail_url?: string;
    is_public: boolean;
    source_lang?: string;
}

export interface AlbumUpdate {
    name?: string | Record<string, string>;
    description?: string | Record<string, string>;
    thumbnail_url?: string;
    is_public?: boolean;
    source_lang?: string;
}

const ALBUMS_API_URL = `${API_BASE_URL}/api/v1/albums`;

export function useAlbums() {
    const queryClient = useQueryClient();

    const albumsQuery = useQuery<Album[]>({
        queryKey: ["/api/v1/albums"],
        queryFn: async () => {
            const res = await fetch(ALBUMS_API_URL);
            if (!res.ok) throw new Error("Failed to fetch albums");
            return res.json();
        }
    });

    const createMutation = useMutation({
        mutationFn: async (newAlbum: AlbumCreate) => {
            const res = await fetch(ALBUMS_API_URL + "/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...newAlbum, source_lang: newAlbum.source_lang || "fr" }),
            });
            if (!res.ok) throw new Error("Failed to create album");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/albums"] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: AlbumUpdate }) => {
            const res = await fetch(`${ALBUMS_API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to update album");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/albums"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`${ALBUMS_API_URL}/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete album");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/albums"] });
        },
    });

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch(`${API_BASE_URL}/api/v1/multimedia/upload`, {
            method: "POST",
            body: formData,
        });
        if (!res.ok) throw new Error("Upload failed");
        return res.json();
    };

    return {
        albums: albumsQuery.data || [],
        isLoading: albumsQuery.isLoading,
        error: albumsQuery.error,
        createAlbum: createMutation.mutateAsync,
        updateAlbum: updateMutation.mutateAsync,
        deleteAlbum: deleteMutation.mutateAsync,
        uploadFile,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
}
