import { useState, useEffect } from "react";
import { getProvsService, addProvService, updateProvService, deleteProvService } from '@services/prov.service.js';
import { fetchProducts } from '@services/inventory.service.js';

export function useProveedores() {
    const [proveedores, setProveedores] = useState([]);
    const [filteredProveedores, setFilteredProveedores] = useState([]);
    const [selectedProveedor, setSelectedProveedor] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBy, setSearchBy] = useState('nombre');
    const [products, setProducts] = useState([]); // Nuevo estado para productos

    useEffect(() => {
        const fetchData = async () => {
            const [data, error] = await getProvsService();
            if (error) {
                console.error('Error fetching proveedores:', error);
            } else {
                setProveedores(data.data);
                setFilteredProveedores(data.data);
            }

            try {
                const productsData = await fetchProducts();
                // Asumiendo que la respuesta de fetchProducts() es { data: [ ...lista_de_productos ] }
                setProducts(productsData.data);
            } catch (prodError) {
                console.error('Error fetching products:', prodError);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const results = proveedores.filter(prov =>
            prov[searchBy]?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProveedores(results);
    }, [searchTerm, searchBy, proveedores]);

    const handleAdd = async (formData) => {
        const [result, error] = await addProvService(formData);
        if (error) {
            console.error('Error registrando proveedor:', error);
            return;
        }
        setProveedores([...proveedores, result.data]);
    };

    const handleUpdate = async (formData) => {
        if (!selectedProveedor) return;
        const [result, error] = await updateProvService(selectedProveedor.id, formData);
        if (error) {
            console.error('Error actualizando proveedor:', error);
            return;
        }
        setProveedores(proveedores.map(prov => (prov.id === selectedProveedor.id ? result.data : prov)));
    };

    const handleDelete = async () => {
        if (!selectedProveedor) return;
        const [_, error] = await deleteProvService(selectedProveedor.id);
        if (error) {
            console.error('Error eliminando proveedor:', error);
            return;
        }
        setProveedores(proveedores.filter(prov => prov.id !== selectedProveedor.id));
        setSelectedProveedor(null);
    };

    // Función para obtener los productos de un proveedor dado su id
    const getProductsForSupplier = (supplierId) => {
        return products.filter(product => product.supplierId === supplierId);
    };

    return {
        proveedores,
        filteredProveedores,
        selectedProveedor,
        setSelectedProveedor,
        isEditing,
        setIsEditing,
        searchTerm,
        setSearchTerm,
        searchBy,
        setSearchBy,
        handleAdd,
        handleUpdate,
        handleDelete,
        getProductsForSupplier
    };
}
