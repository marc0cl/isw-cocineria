import React, { useState } from 'react';
import { createProduct } from '../services/inventory.service';  // Asegúrate de tener esta función en tu servicio
import '../styles/product_page.css';

export default function AddProductPage() {
    // Estado para el formulario de producto
    const [form, setForm] = useState({
        nombreProducto: '',
        cantidadProducto: '',
        fechaDeCaducidad: '',
        tipoDeProducto: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);  // Estado para manejar la carga del formulario

    // Maneja los cambios en el formulario
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); // Evitar que se haga más de una solicitud mientras se está enviando

        try {
            // Llamar a la función para crear un nuevo producto
            await createProduct({
                nombreProducto: form.nombreProducto,
                cantidadProducto: form.cantidadProducto,
                fechaDeCaducidad: form.fechaDeCaducidad,
                tipoDeProducto: form.tipoDeProducto
            });

            // Limpiar el formulario después de agregar el producto
            setForm({
                nombreProducto: '',
                cantidadProducto: '',
                fechaDeCaducidad: '',
                tipoDeProducto: ''
            });
            alert('Producto agregado con éxito');
        } catch (error) {
            console.error('Error al agregar producto:', error);
            alert('Hubo un error al agregar el producto');
        } finally {
            setIsSubmitting(false);  // Restaurar el estado de carga
        }
    };

    return (
        <div className="product-page">
            <h1 className="product-pagetitle">Agregar Producto</h1>
            <form className="product-pageform" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="nombreProducto"
                    placeholder="Nombre del producto"
                    value={form.nombreProducto}
                    onChange={handleChange}
                    required
                    className="product-pageinput"
                />
                <input
                    type="number"
                    name="cantidadProducto"
                    placeholder="Cantidad"
                    value={form.cantidadProducto}
                    onChange={handleChange}
                    required
                    className="product-pageinput"
                />
                <input
                    type="date"
                    name="fechaDeCaducidad"
                    placeholder="Fecha de caducidad"
                    value={form.fechaDeCaducidad}
                    onChange={handleChange}
                    required
                    className="product-pageinput"
                />
                <input
                    type="text"
                    name="tipoDeProducto"
                    placeholder="Tipo de producto"
                    value={form.tipoDeProducto}
                    onChange={handleChange}
                    required
                    className="product-pageinput"
                />
                <button type="submit" className="product-pagebutton" disabled={isSubmitting}>
                    {isSubmitting ? 'Agregando...' : 'Agregar Producto'}
                </button>
            </form>
        </div>
    );
}
