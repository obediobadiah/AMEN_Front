export const isLocal = typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || 
     window.location.hostname === "127.0.0.1" || 
     window.location.port === "3000" ||
     window.location.hostname.endsWith(".ngrok-free.app") ||
     window.location.hostname.includes("localhost"));

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (isLocal
    ? "http://localhost:8000"
    : "https://amen-rdc.vercel.app");

export const getImageUrl = (path: string | undefined) => {
    if (!path) return "";
    if (path.startsWith("http")) {
        // If it's a localhost URL and we're not in local development, replace with production URL
        if (path.includes("localhost:8000") && !isLocal) {
            return path.replace("http://localhost:8000", "https://amen-rdc.vercel.app");
        }
        return path;
    }

    // Ensure the path starts with a slash
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_BASE_URL}${cleanPath}`;
};
