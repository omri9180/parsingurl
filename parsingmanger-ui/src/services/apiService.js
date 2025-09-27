// IMPORTANT: Replace with your actual backend URL if it's different.
const API_BASE_URL = 'http://localhost:8080/api/monitor';

async function handleResponse(response) {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    // Handle cases where the response body might be empty (e.g., for DELETE requests)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    } else {
        return response.text();
    }
}

export const getAllUrls = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/getall`);
        return await handleResponse(response);
    } catch (error) {
        console.error('Failed to fetch all URLs:', error);
        return []; // Return empty array on error to prevent app crash
    }
};

export const getStatus = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/status`);
        return await handleResponse(response);
    } catch(error) {
        console.error('Failed to fetch statuses:', error);
        return {}; // Return empty object on error
    }
};

export const addUrl = async (url, interval) => {
    const params = new URLSearchParams({
        url,
        interval: interval.toString(),
    });
    const response = await fetch(`${API_BASE_URL}/add?${params.toString()}`, {
        method: 'POST',
    });
    return handleResponse(response);
};

export const removeUrl = async (url, id) => {
    const params = new URLSearchParams({
        url,
        id: id.toString(),
    });
    const response = await fetch(`${API_BASE_URL}/remove?${params.toString()}`, {
        method: 'DELETE',
    });
    await handleResponse(response);
};

export const removeAllUrls = async () => {
    const response = await fetch(`${API_BASE_URL}/removeAll`, {
        method: 'DELETE',
    });
    await handleResponse(response);
};