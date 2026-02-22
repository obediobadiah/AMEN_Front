import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface NewsArticle {
    id: number;
    title: Record<string, string>;
    content: Record<string, string>;
    excerpt?: Record<string, string>;
    author?: string;
    category?: string;
    status?: string;
    reading_time?: number;
    thumbnail_url?: string;
    tags?: string[];
    published_date: string;
    created_at: string;
    updated_at?: string;
}

export interface NewsCreate {
    title: string;
    content: string;
    excerpt?: string;
    author?: string;
    category?: string;
    status?: string;
    reading_time?: number;
    thumbnail_url?: string;
    tags?: string[];
    source_lang: string;
}

export interface NewsUpdate {
    title?: string | Record<string, string>;
    content?: string | Record<string, string>;
    excerpt?: string | Record<string, string>;
    status?: string;
    category?: string;
    author?: string;
    reading_time?: number;
    thumbnail_url?: string;
    source_lang?: string;
    published_date?: string;
}

import { API_BASE_URL } from "@/lib/api-config";

const NEWS_API_URL = `${API_BASE_URL}/api/v1/news`;

export function useNews() {
    const queryClient = useQueryClient();

    const newsQuery = useQuery<NewsArticle[]>({
        queryKey: ["/api/v1/news"],
        queryFn: async () => {
            const res = await fetch(NEWS_API_URL);
            if (!res.ok) throw new Error("Failed to fetch news");
            return res.json();
        }
    });

    const createMutation = useMutation({
        mutationFn: async (newNews: NewsCreate) => {
            const res = await fetch(NEWS_API_URL + "/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newNews),
            });
            if (!res.ok) throw new Error("Failed to create news");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/news"] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: NewsUpdate }) => {
            const res = await fetch(`${NEWS_API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to update news");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/news"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`${NEWS_API_URL}/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete news");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/news"] });
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
        news: newsQuery.data || [],
        isLoading: newsQuery.isLoading,
        error: newsQuery.error,
        createNews: createMutation.mutateAsync,
        updateNews: updateMutation.mutateAsync,
        deleteNews: deleteMutation.mutateAsync,
        uploadFile: uploadMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        isUploading: uploadMutation.isPending,
    };
}
