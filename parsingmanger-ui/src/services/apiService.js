import axios from "axios";

// IMPORTANT: Replace with your actual backend URL if it's different.
const API_BASE_URL = "http://localhost:8080/api/monitor";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const getAllUrls = async () => {
    try {
        const response = await axiosInstance.get("/getall");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch all URLs:", error);
        return [];
    }
};

export const getStatus = async () => {
    try {
        const response = await axiosInstance.get("/status");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch statuses:", error);
        return {};
    }
};

export const addUrl = async (url, interval) => {
    try {
        const response = await axiosInstance.post("/add", null, {
            params: { url, interval },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to add URL:", error);
        throw error;
    }
};

export const removeUrl = async (url, id) => {
    try {
        await axiosInstance.delete("/remove", {
            params: { url, id },
        });
    } catch (error) {
        console.error("Failed to remove URL:", error);
        throw error;
    }
};

export const removeAllUrls = async () => {
    try {
        await axiosInstance.delete("/removeAll");
    } catch (error) {
        console.error("Failed to remove all URLs:", error);
        throw error;
    }
};
