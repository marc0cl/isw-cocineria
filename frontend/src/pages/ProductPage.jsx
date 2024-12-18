import React, { useState, useEffect } from 'react';
import { createProduct } from '../services/inventory.service';
import { getProvsService } from '../services/prov.service';
import '../styles/product_page.css';

export default function AddProductPage() {

    const [form, setForm] = useState({
        nombreProducto: '',
        cantidadProducto: '',
        fechaDeCaducidad: '',
        tipoDeProducto: 'bar',
        stockUnit: 'g',
        minThreshold: '',
        minThresholdUnit: 'g',
        cost: '',
        supplierId: ''
    });

    const [providers, setProviders] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {

        async function fetchProviders() {
            const [data, error] = await getProvsService();
            if (!error && data && data.data) {
                setProviders(data.data);
            } else {
                console.error('Error al obtener proveedores:', error);
            }
        }
        fetchProviders();
    }, []);


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };


    const validateName = (name) => {
        const regex = /^[A-Za-zÁáÉéÍíÓóÚú]+( [A-Za-zÁáÉéÍíÓóÚú]+)*$/;
        return regex.test(name);
    };

    const validateForm = () => {
        const { nombreProducto, cantidadProducto, cost, minThreshold, fechaDeCaducidad, stockUnit, minThresholdUnit } = form;

        if (!validateName(nombreProducto)) {
            alert("El nombre del producto solo puede contener letras y un único espacio entre las palabras.");
            return false;
        }




        if (Number(cantidadProducto) < 0) {
            alert("La cantidad no puede ser negativa.");
            return false;
        }
        if (Number(cost) < 0) {
            alert("El costo no puede ser negativo.");
            return false;
        }
        if (Number(minThreshold) < 0) {
            alert("El umbral mínimo no puede ser negativo.");
            return false;
        }


        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const caducidadDate = new Date(fechaDeCaducidad);
        if (caducidadDate > today) {
            alert("La fecha de caducidad no puede ser en el futuro.");
            return false;
        }


        if (stockUnit !== minThresholdUnit) {
            alert("La unidad de cantidad y el umbral mínimo deben ser iguales.");
            return false;
        }

        return true;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            await createProduct({
                nombreProducto: form.nombreProducto,
                cantidadProducto: form.cantidadProducto,
                fechaDeCaducidad: form.fechaDeCaducidad,
                tipoDeProducto: form.tipoDeProducto,
                stockUnit: form.stockUnit,
                minThreshold: form.minThreshold,
                minThresholdUnit: form.minThresholdUnit,
                supplierId: form.supplierId ? Number(form.supplierId) : null,
                cost: form.cost
            });


            setForm({
                nombreProducto: '',
                cantidadProducto: '',
                fechaDeCaducidad: '',
                tipoDeProducto: 'bar',
                stockUnit: 'g',
                minThreshold: '',
                minThresholdUnit: 'g',
                cost: '',
                supplierId: ''
            });
            alert('Producto agregado con éxito');
        } catch (error) {
            console.error('Error al agregar producto:', error);
            alert('Hubo un error al agregar el producto');
        } finally {
            setIsSubmitting(false);
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

                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="number"
                        name="cantidadProducto"
                        placeholder="Cantidad"
                        value={form.cantidadProducto}
                        onChange={handleChange}
                        required
                        className="product-pageinput"
                        min="0"
                    />

                    <select
                        name="stockUnit"
                        value={form.stockUnit}
                        onChange={handleChange}
                        className="product-pageinput"
                        required
                    >
                        <option value="g">g</option>
                        <option value="kg">kg</option>
                        <option value="mg">mg</option>
                        <option value="t">t</option>
                        <option value="ml">ml</option>
                        <option value="l">l</option>
                    </select>
                </div>

                <input
                    type="date"
                    name="fechaDeCaducidad"
                    placeholder="Fecha de caducidad"
                    value={form.fechaDeCaducidad}
                    onChange={handleChange}
                    required
                    className="product-pageinput"
                />

                <select
                    name="tipoDeProducto"
                    value={form.tipoDeProducto}
                    onChange={handleChange}
                    required
                    className="product-pageinput"
                >
                    <option value="bar">Bar</option>
                    <option value="cocina">Cocina</option>
                    <option value="otro">Otro</option>
                </select>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="number"
                        name="minThreshold"
                        placeholder="Umbral mínimo"
                        value={form.minThreshold}
                        onChange={handleChange}
                        required
                        className="product-pageinput"
                        min="0"
                    />
                    <select
                        name="minThresholdUnit"
                        value={form.minThresholdUnit}
                        onChange={handleChange}
                        className="product-pageinput"
                        required
                    >
                        <option value="g">g</option>
                        <option value="kg">kg</option>
                        <option value="mg">mg</option>
                        <option value="t">t</option>
                        <option value="ml">ml</option>
                        <option value="l">l</option>
                    </select>
                </div>

                <input
                    type="number"
                    name="cost"
                    placeholder="Costo"
                    value={form.cost}
                    onChange={handleChange}
                    required
                    className="product-pageinput"
                    min="0"
                    step="0.01"
                />

                <select
                    name="supplierId"
                    value={form.supplierId}
                    onChange={handleChange}
                    required
                    className="product-pageinput"
                >
                    <option value="">Seleccione un proveedor</option>
                    {providers.map(prov => (
                        <option key={prov.id} value={prov.id}>
                            {prov.nombre}
                        </option>
                    ))}
                </select>

                <button type="submit" className="product-pagebutton" disabled={isSubmitting}>
                    {isSubmitting ? 'Agregando...' : 'Agregar Producto'}
                </button>
            </form>
        </div>
    );
}
