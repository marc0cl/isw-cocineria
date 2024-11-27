import axios from './root.service.js';

export async function getIncomesService(params = {}) {
    try {
        const response = await axios.get('/income', { params });
        return [response.data, null];
    } catch (error) {
        return [null, error.response?.data?.message || error.message];
    }
}

export async function getExpensesService(params = {}) {
    try {
        const response = await axios.get('/expense', { params });
        return [response.data, null];
    } catch (error) {
        return [null, error.response?.data?.message || error.message];
    }
}

export async function addIncomeService(data) {
    try {
        const response = await axios.post('/income', data);
        return [response.data, null];
    } catch (error) {
        return [null, error.response?.data?.message || error.message];
    }
}