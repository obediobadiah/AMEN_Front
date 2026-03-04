import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api-config";
import { authFetch, AuthUser } from "@/hooks/use-auth";

export type { AuthUser as PortalUser };

export interface CreateUserPayload {
    name: string;
    email: string;
    password: string;
    role: "admin" | "staff";
}

export interface UpdateUserPayload {
    name?: string;
    email?: string;
    role?: "admin" | "staff";
    is_active?: boolean;
    password?: string;
}

const USERS_URL = `${API_BASE_URL}/api/v1/auth/users`;
const QUERY_KEY = ["/api/v1/auth/users"];

export function usePortalUsers() {
    const queryClient = useQueryClient();

    const usersQuery = useQuery<AuthUser[]>({
        queryKey: QUERY_KEY,
        queryFn: async () => {
            const res = await authFetch(USERS_URL);
            if (!res.ok) throw new Error("Failed to fetch users");
            return res.json();
        },
    });

    // Check if email already exists
    const checkEmailExists = (email: string, excludeUserId?: number) => {
        const users = usersQuery.data || [];
        const normalizedEmail = email.toLowerCase().trim();
        return users.some(user => 
            user.email.toLowerCase() === normalizedEmail && 
            user.id !== excludeUserId
        );
    };

    const createMutation = useMutation({
        mutationFn: async (payload: CreateUserPayload) => {
            const res = await authFetch(USERS_URL, {
                method: "POST",
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.detail || "Failed to create user");
            }
            return res.json() as Promise<AuthUser>;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: UpdateUserPayload }) => {
            const res = await authFetch(`${USERS_URL}/${id}`, {
                method: "PUT",
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.detail || "Failed to update user");
            }
            return res.json() as Promise<AuthUser>;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await authFetch(`${USERS_URL}/${id}`, { method: "DELETE" });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.detail || "Failed to delete user");
            }
            return res.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
    });

    return {
        users: usersQuery.data || [],
        isLoading: usersQuery.isLoading,
        error: usersQuery.error,
        createUser: createMutation.mutateAsync,
        updateUser: updateMutation.mutateAsync,
        deleteUser: deleteMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        checkEmailExists,
    };
}
