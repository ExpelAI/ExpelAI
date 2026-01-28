import axios from 'axios';

// ✅ Fixed: Uses the Vercel Environment Variable if it exists, otherwise defaults to localhost
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_URL = `${API_BASE}/api/data`;

export const DataService = {
    getPestDetections: async () => {
        try {
            const response = await axios.get(`${API_URL}/pests`);
            return response.data;
        } catch (error) {
            console.error('Error fetching pest detections:', error);
            throw error;
        }
    },

    getSensorData: async () => {
        try {
            const response = await axios.get(`${API_URL}/sensors`);
            return response.data;
        } catch (error) {
            console.error('Error fetching sensor data:', error);
            throw error;
        }
    },

    uploadImage: async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post(`${API_URL}/detect`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }
};