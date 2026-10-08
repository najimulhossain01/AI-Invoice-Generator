import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 30000, // Set request timeout to 30 seconds
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Add request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle common errors globally
        if (error.response) {
            if (error.response.status === 401) {
                console.error("Server error. Please try again later...", error.message);
            }
        } else if (error.code === "ECONNABORTED") {
            console.error("Request timeout. Please try again later...", error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;