import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api-config";

export interface Project {
    id: number;
    title: Record<string, string>;
    description?: Record<string, string>;
    status?: string;
    location?: Record<string, string>;
    start_date?: string;
    end_date?: string;
    category?: string;
    impact_stats?: Record<string, any>;
    overview?: Record<string, string>;
    goals?: Record<string, string[]>;
    achievements?: Record<string, string[]>;
    image_url?: string;
    created_at: string;
}

export interface ProjectCreate {
    title: string;
    description?: string;
    status?: string;
    location?: string;
    start_date?: string;
    end_date?: string;
    category?: string;
    impact_stats?: Record<string, any>;
    overview?: string;
    goals?: string[];
    achievements?: string[];
    image_url?: string;
    source_lang: string;
}

export interface ProjectUpdate {
    title?: string | Record<string, string>;
    description?: string | Record<string, string>;
    status?: string;
    location?: string | Record<string, string>;
    start_date?: string;
    end_date?: string;
    category?: string;
    impact_stats?: Record<string, any>;
    overview?: string | Record<string, string>;
    goals?: string[] | Record<string, string[]>;
    achievements?: string[] | Record<string, string[]>;
    image_url?: string;
    source_lang?: string;
}

const PROJECTS_API_URL = `${API_BASE_URL}/api/v1/projects`;

export function useProjects() {
    const queryClient = useQueryClient();

    const projectsQuery = useQuery<Project[]>({
        queryKey: ["/api/v1/projects"],
        queryFn: async () => {
            const res = await fetch(PROJECTS_API_URL);
            if (!res.ok) throw new Error("Failed to fetch projects");
            return res.json();
        }
    });

    const createMutation = useMutation({
        mutationFn: async (newProject: ProjectCreate) => {
            const res = await fetch(PROJECTS_API_URL + "/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProject),
            });
            if (!res.ok) throw new Error("Failed to create project");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/projects"] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: ProjectUpdate }) => {
            const res = await fetch(`${PROJECTS_API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to update project");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/projects"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`${PROJECTS_API_URL}/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete project");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/projects"] });
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
        projects: projectsQuery.data || [],
        isLoading: projectsQuery.isLoading,
        error: projectsQuery.error,
        createProject: createMutation.mutateAsync,
        updateProject: updateMutation.mutateAsync,
        deleteProject: deleteMutation.mutateAsync,
        uploadFile: uploadMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        isUploading: uploadMutation.isPending,
    };
}
