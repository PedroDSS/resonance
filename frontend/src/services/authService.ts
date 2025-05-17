import axios from 'axios';

export const register = async (email: string, password: string) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/register`, { email, password });
    return response.data;
};

export const login = async (email: string, password: string) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { email, password });
    return response.data;
};
