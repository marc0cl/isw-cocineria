import axios from './root.service.js';

export async function getProvsService(params = {}) {
    try {
        const response = await axios.get('/prov/all/t', { params });
        return [response.data, null];
    } catch (error) {
        return [null, error.response?.data?.message || error.message];
    }
}

export async function addProvService(data) {
    try {
        const response = await axios.post('/prov/', data);
        return [response.data, null];
    } catch (error) {
        return [null, error.response?.data?.message || error.message];
    }
}

export async function deleteProvService(id) {
    try {
        const response = await axios.delete(`/prov/${id}`);
        return [response.data, null];
    } catch (error) {
        return [null, error.response?.data?.message || error.message];
    }
}