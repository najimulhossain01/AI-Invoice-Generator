export const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:8000" : "");

export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register", // SignUp
        LOGIN: "/api/auth/login", // Authenticate User & JWT token
        GET_PROFILE: "/api/auth/me", // Get Logged-in User Profile
        UPDATE_PROFILE: "/api/auth/me", // Update Profile
    },

    INVOICE: {
        CREATE: "/api/invoices/",
        GET_ALL_INVOICES: "/api/invoices/",
        GET_INVOICE_BY_ID: (id) => `/api/invoices/${id}`,
        UPDATE_INVOICE: (id) => `/api/invoices/${id}`,
        DELETE_INVOICE: (id) => `/api/invoices/${id}`,
    },

    AI: {
        PARSE_INVOICE_TEXT: "/api/ai/parse-invoice",
        GENERATE_REMINDER: "/api/ai/generate-remainder",
        GET_DASHBOARD_SUMMARY: "/api/ai/dashboard-summary",
    },
};