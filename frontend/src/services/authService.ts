import axios from 'axios';

export const register = async (username: string, password: string) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/register`, { username, password });
    return response.data;
};

export const login = async (username: string, password: string) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { username, password });
    return response.data;
};
