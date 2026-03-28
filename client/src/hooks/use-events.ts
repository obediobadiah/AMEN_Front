import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api-config";

export interface Event {
    id: number;
    title: Record<string, string>;
    description?: Record<string, string>;
    start_date?: string;
    end_date?: string;
    location?: Record<string, string>;
    status?: string; // Upcoming, Past
    registration_link?: string;
    category?: string;
    thumbnail_url?: string;
    created_at: string;
}

export interface EventCreate {
    title: string;
    description?: string;
    start_date?: string;
    end_date?: string;
    location?: string;
    status?: string;
    registration_link?: string;
    category?: string;
    thumbnail_url?: string;
    source_lang?: string;
}

export interface EventUpdate {
    title?: string | Record<string, string>;
    description?: string | Record<string, string>;
    start_date?: string;
    end_date?: string;
    location?: string | Record<string, string>;
    status?: string;
    registration_link?: string;
    category?: string;
    thumbnail_url?: string;
    source_lang?: string;
}

const EVENTS_API_URL = `${API_BASE_URL}/api/v1/events`;

export function useEvents() {
    const queryClient = useQueryClient();

    const eventsQuery = useQuery<Event[]>({
        queryKey: ["/api/v1/events"],
        queryFn: async () => {
            const res = await fetch(EVENTS_API_URL);
            if (!res.ok) throw new Error("Failed to fetch events");
            return res.json();
        }
    });

    const createMutation = useMutation({
        mutationFn: async (newEvent: EventCreate) => {
            const res = await fetch(EVENTS_API_URL + "/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newEvent),
            });
            if (!res.ok) throw new Error("Failed to create event");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/events"] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: EventUpdate }) => {
            const res = await fetch(`${EVENTS_API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to update event");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/events"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`${EVENTS_API_URL}/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete event");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/events"] });
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
        events: eventsQuery.data || [],
        isLoading: eventsQuery.isLoading,
        error: eventsQuery.error,
        createEvent: createMutation.mutateAsync,
        updateEvent: updateMutation.mutateAsync,
        deleteEvent: deleteMutation.mutateAsync,
        uploadFile: uploadMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        isUploading: uploadMutation.isPending,
    };
}

export function useEvent(id: string | number | undefined) {
    return useQuery<Event>({
        queryKey: ["/api/v1/events", id],
        queryFn: async () => {
            if (!id) throw new Error("ID is required");
            const res = await fetch(`${EVENTS_API_URL}/${id}`);
            if (!res.ok) throw new Error("Failed to fetch event");
            return res.json();
        },
        enabled: !!id,
    });
}
