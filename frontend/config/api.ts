// Check if we are in a browser environment
const isBrowser = typeof window !== "undefined";

// Dynamically use the current hostname if accessed via local network IP (e.g. 192.168.x.x)
const getBackendUrl = () => {
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_BACKEND_URL;
  }
  if (isBrowser) {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return `http://127.0.0.1:5005`;
    }
    return `http://${window.location.hostname}:5005`;
  }
  // For server-side rendering, point directly to the backend
  return "http://127.0.0.1:5005";
};

export const BACKEND_URL = getBackendUrl();

// Use relative URL for API calls in the browser to utilize Next.js rewrites, avoiding cross-origin issues
export const API_URL = process.env.NEXT_PUBLIC_API_URL || (isBrowser ? "/api" : `${BACKEND_URL}/api`);
