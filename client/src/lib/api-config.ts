export const isLocal = typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.port === "3000");

export const API_BASE_URL = isLocal
    ? "http://localhost:8000"
    : "http://amen-rdc.org";

export const getImageUrl = (path: string | undefined) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;

    // Ensure the path starts with a slash
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_BASE_URL}${cleanPath}`;
};
