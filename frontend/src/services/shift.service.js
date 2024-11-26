import axios from './root.service.js';
/*
export async function createShiftService() {
    try {
        
    } catch (error) {
        
    }
    
}
    */
//ADD a formatShiftData function to formatData.js
export async function getShiftsService() {
    try {
    const response = await axios.get('/shift/all');
    return response.data.data;
    } catch (error) {
        return error.response.data;
    }
}
export async function updateShiftService(data,id) {
    try {
        const response = await axios.patch(`/shift/${id}`,data);
        return response.data.data;
    } catch (error) {
        console.error('Error :',error)
        
    }
    
}

export async function deleteShiftService(id) {
    try {
        const response = await axios.delete(`/shift/${id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error: ',error)
        
    }
    
}
    