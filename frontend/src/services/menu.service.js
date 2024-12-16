import axios from './root.service.js';

// Obtener el menú
export async function fetchMenu() {
    const response = await axios.get('/menu');
    console.log(response);
    return response.data; // Esto devolverá { menu: { on_stock: [...], out_of_stock: [...] } }
}


