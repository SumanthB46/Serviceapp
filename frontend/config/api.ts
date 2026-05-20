// Check if we are in a browser environment
const isBrowser = typeof window !== "undefined";

// Dynamically use the current hostname if accessed via local network IP (e.g. 192.168.x.x)
const getBackendUrl = () => {
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_BACKEND_URL;
  }
  if (isBrowser && window.location.hostname && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    return `http://${window.location.hostname}:5005`;
  }
  return "http://127.0.0.1:5005";
};

export const BACKEND_URL = getBackendUrl();
export const API_URL = process.env.NEXT_PUBLIC_API_URL || `${BACKEND_URL}/api`;
