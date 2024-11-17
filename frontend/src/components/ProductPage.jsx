import React, { useState, useEffect } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../services/inventory.service';

export default function ProductPage() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ id: null, name: '', price: '' });
    const [isEditing, setIsEditing] = useState(false);

    // Cargar productos al montar el componente
    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        const data = await fetchProducts();
        setProducts(data.products); // Asumiendo que `data.products` contiene la lista
    };

    // Manejar cambios en los campos del formulario
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Manejar envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            await updateProduct(form.id, { name: form.name, price: form.price });
        } else {
            await createProduct({ name: form.name, price: form.price });
        }
        setForm({ id: null, name: '', price: '' });
        setIsEditing(false);
        loadProducts();
    };

    // Manejar selección para editar
    const handleEdit = (product) => {
        setForm({ id: product.id, name: product.name, price: product.price });
        setIsEditing(true);
    };

    // Manejar eliminación
    const handleDelete = async (id) => {
        await deleteProduct(id);
        loadProducts();
    };

    return (
        <div>
            <h1>Gestión de Productos</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Nombre del producto"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Precio"
                    value={form.price}
                    onChange={handleChange}
                    required
                />
                <button type="submit">{isEditing ? 'Actualizar' : 'Agregar'}</button>
            </form>
            <h2>Lista de Productos</h2>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        {product.name} - ${product.price}
                        <button onClick={() => handleEdit(product)}>Editar</button>
                        <button onClick={() => handleDelete(product.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}