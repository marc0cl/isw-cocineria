import React, { useState, useEffect } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../services/inventory.service';
import '../styles/product_page.css';

export default function ProductPage() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ id: null, name: '', price: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await fetchProducts();
            console.log('Productos cargados:', data.products);
            setProducts(data.products || []);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            setProducts([]);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

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

    const handleEdit = (product) => {
        setForm({ id: product.id, name: product.name, price: product.price });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        await deleteProduct(id);
        loadProducts();
    };

    return (
        <div className="product-page">
            <h1 className="product-pagetitle">Gestión de Productos</h1>
            <form className="product-pageform" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Nombre del producto"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="product-pageinput"
                />
                <input
                    type="number"
                    name="price"
                    placeholder="id"
                    value={form.price}
                    onChange={handleChange}
                    required
                    className="product-pageinput"
                />
                <button type="submit" className="product-pagebutton">
                    {isEditing ? 'Actualizar' : 'Agregar'}
                </button>
            </form>
            <h2 className="product-pagesubtitle">Lista de Productos</h2>
            <ul className="product-pagelist">
                {products.map((product) => (
                    <li key={product.id} className="product-pageitem">
                        {product.name} - ${product.price}
                        <button
                            className="product-pagebutton"
                            onClick={() => handleEdit(product)}
                        >
                            Editar
                        </button>
                        <button
                            className="product-pagebutton product-page__button--delete"
                            onClick={() => handleDelete(product.id)}
                        >
                            Eliminar
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}