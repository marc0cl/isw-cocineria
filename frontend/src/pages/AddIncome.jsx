import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import menuData from '../../menu.json';
import { addIncomesService } from '@services/transaction.service.js';
import { updateProductStock, checkAvailabilityService } from '@services/inventory.service.js';
import Spinner from '@components/Login/Spinner';
import SuccessTick from '@components/Login/SuccessTick';
import ErrorX from '@components/Login/ErrorX';
import '@styles/form.css';

const AddIncome = () => {
    const { register, handleSubmit, setError, reset, formState: { errors } } = useForm();
    const [menuItems, setMenuItems] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        updateMenuItems();
    }, []);

    const updateMenuItems = async () => {
        const [availability, errorAvail] = await checkAvailabilityService(menuData);
        if (errorAvail) {
            console.error("Error verificando disponibilidad:", errorAvail);
            const updated = menuData.map(item => ({ ...item, disabled: true }));
            setMenuItems(updated);
            return;
        }

        const updatedMenu = menuData.map(item => {
            const found = availability.find(a => a.name === item.name);
            if (found) {
                return { ...item, disabled: !found.available };
            }
            return { ...item, disabled: true };
        });

        setMenuItems(updatedMenu);
    };

    const handleAddProduct = (data) => {
        const selectedItem = menuItems.find(item => item.name === data.product);
        if (!selectedItem) {
            setError('product', { type: 'manual', message: 'Producto no válido' });
            return;
        }

        const qty = parseInt(data.quantity, 10);
        if (!qty || qty <= 0) {
            setError('quantity', { type: 'manual', message: 'Cantidad no válida' });
            return;
        }

        // Crear múltiples entradas individuales del mismo producto
        const newProducts = Array.from({ length: qty }).map(() => ({
            amount: selectedItem.price,
            description: selectedItem.name,
            source: selectedItem.source,
            ingredients: selectedItem.ingredients
        }));

        setSelectedProducts(prev => [...prev, ...newProducts]);
        reset({ product: '', quantity: '' });
    };

    // Ahora, en vez de index, eliminaremos un producto por su nombre (eliminando de a uno)
    const handleRemoveProduct = (description) => {
        const indexToRemove = selectedProducts.findIndex(prod => prod.description === description);
        if (indexToRemove > -1) {
            const updatedList = [...selectedProducts];
            updatedList.splice(indexToRemove, 1);
            setSelectedProducts(updatedList);
        }
    };

    const finalSubmit = () => {
        if (selectedProducts.length === 0) {
            setError('general', { type: 'manual', message: 'No has agregado ningún producto.' });
            return;
        }
        setShowConfirmation(true);
    };

    const confirmSubmit = async () => {
        setShowConfirmation(false);
        setIsLoading(true);
        setIsSuccess(false);
        setIsError(false);

        try {
            // Filtramos las propiedades para no incluir ingredients ni quantity
            const incomeProducts = selectedProducts.map(prod => ({
                amount: prod.amount,
                description: prod.description,
                source: prod.source,
                type: 'income'
            }));

            const [ , errorTransaction] = await addIncomesService(incomeProducts);
            if (errorTransaction) {
                setIsError(true);
                setIsLoading(false);
                setError('general', { type: 'server', message: errorTransaction });
            } else {
                // Descontar inventario basado en ingredientes
                const ingredientsToDeduct = {};
                selectedProducts.forEach(prod => {
                    prod.ingredients.forEach(ing => {
                        const key = ing.name;
                        if (!ingredientsToDeduct[key]) {
                            ingredientsToDeduct[key] = { name: ing.name, amount: 0, unit: ing.unit };
                        }
                        ingredientsToDeduct[key].amount += ing.amount;
                    });
                });

                const ingredientsArray = Object.values(ingredientsToDeduct);
                const [updateResp, updateErr] = await updateProductStock(ingredientsArray);
                if (updateErr) {
                    console.error("Error actualizando stock:", updateErr);
                    setIsError(true);
                    setIsLoading(false);
                    return;
                }

                setIsSuccess(true);
                setIsLoading(false);
                setSelectedProducts([]);
                await updateMenuItems();

                setTimeout(() => {
                    reset();
                    setIsSuccess(false);
                }, 2000);
            }
        } catch (error) {
            console.error('Error al registrar el ingreso:', error);
            setIsError(true);
            setIsLoading(false);
            setError('general', { type: 'server', message: 'Ocurrió un error inesperado. Por favor, intenta nuevamente.' });
        }
    };

    const cancelSubmit = () => {
        setShowConfirmation(false);
    };

    // Agrupar productos por descripción para visualizarlos x2, x10, etc.
    const groupedProducts = selectedProducts.reduce((acc, product) => {
        const key = product.description;
        if (!acc[key]) {
            acc[key] = { product: product, count: 0 };
        }
        acc[key].count += 1;
        return acc;
    }, {});

    const productEntries = Object.values(groupedProducts);

    return (
        <main className="container">
            <form className="form" onSubmit={handleSubmit(handleAddProduct)}>
                <h1>Ingresar Ingreso</h1>
                <div className="container_inputs">
                    <label htmlFor="product">Producto</label>
                    <select
                        {...register('product', { required: 'Debes seleccionar un producto' })}
                        name="product"
                        defaultValue=""
                    >
                        <option value="">Seleccionar producto</option>
                        {menuItems.map((item, index) => (
                            <option key={index} value={item.name} disabled={item.disabled}>
                                {item.name} - ${item.price} {item.disabled ? '(Sin stock suficiente)' : ''}
                            </option>
                        ))}
                    </select>
                    <div className={`error-message ${errors.product ? 'visible' : ''}`}>
                        {errors.product?.message}
                    </div>
                </div>
                <div className="container_inputs">
                    <label htmlFor="quantity">Cantidad</label>
                    <input
                        type="number"
                        min={1}
                        {...register('quantity', { required: 'Debes ingresar una cantidad', min: 1 })}
                        name="quantity"
                        placeholder="Ej: 1"
                    />
                    <div className={`error-message ${errors.quantity ? 'visible' : ''}`}>
                        {errors.quantity?.message}
                    </div>
                </div>
                <button type="submit" disabled={isLoading}>
                    Agregar producto a la lista
                </button>
                <div className="error-message visible">
                    {errors.general?.message}
                </div>
            </form>

            {productEntries.length > 0 && (
                <div className="form" style={{ marginTop: '20px' }}>
                    <h2>Productos seleccionados</h2>
                    {/* Contenedor scrollable */}
                    <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {productEntries.map((entry, idx) => (
                                <li key={idx} style={{ marginBottom: '10px' }}>
                                    {entry.product.description} x {entry.count} = ${entry.product.amount * entry.count} ({entry.product.source})
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveProduct(entry.product.description)}
                                        style={{
                                            marginLeft: '10px',
                                            backgroundColor: 'red',
                                            color: '#fff',
                                            borderRadius: '5px',
                                            border: 'none',
                                            padding: '5px'
                                        }}
                                    >
                                        Eliminar una unidad
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button
                        type="button"
                        onClick={finalSubmit}
                        disabled={isLoading || productEntries.length === 0}
                        style={{ marginTop: '20px' }}
                    >
                        {isLoading ? <Spinner /> :
                            isSuccess ? <SuccessTick /> :
                                isError ? <ErrorX /> :
                                    'Registrar Ingreso'}
                    </button>
                </div>
            )}

            {showConfirmation && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>¿Deseas confirmar el ingreso?</h3>
                        <button onClick={confirmSubmit}>Confirmar</button>
                        <button onClick={cancelSubmit}>Cancelar</button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default AddIncome;
