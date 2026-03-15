import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchStocks = async ({ market, signal }) => {
    try {
        const params = new URLSearchParams();
        if (market) params.append('market', market);
        if (signal) params.append('signal', signal);

        const response = await axios.get(`${API_BASE_URL}/stocks?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching stocks:', error);
        return [];
    }
};

export const fetchBullish = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/bullish`);
        return response.data;
    } catch (error) {
        console.error('Error fetching bullish stocks', error);
        return [];
    }
};

export const fetchBearish = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/bearish`);
        return response.data;
    } catch (error) {
        console.error('Error fetching bearish stocks', error);
        return [];
    }
};
