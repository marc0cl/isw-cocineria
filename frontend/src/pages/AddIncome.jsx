import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { fetchMenu } from '@services/menu.service.js';
import { addIncomesService } from '@services/transaction.service.js';
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
    const [stockErrors, setStockErrors] = useState([]); // Nuevo estado para manejar errores de stock

    useEffect(() => {
        updateMenuItems();
    }, []);

    const updateMenuItems = async () => {
        const menuResponse = await fetchMenu();
        // { menu: { on_stock: [...], out_of_stock: [...] } }

        const stockItems = menuResponse.menu.on_stock.map(item => ({ ...item, disabled: false }));
        const outOfStockItems = menuResponse.menu.out_of_stock.map(item => ({ ...item, disabled: true }));
        const updatedMenu = [...stockItems, ...outOfStockItems];

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

        const newProducts = Array.from({ length: qty }).map(() => ({
            amount: selectedItem.price,
            description: selectedItem.name,
            source: selectedItem.source || 'otros',
            ingredients: []
        }));

        setSelectedProducts(prev => [...prev, ...newProducts]);
        reset({ product: '', quantity: '' });
    };

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
        setStockErrors([]); // Reiniciar errores de stock antes de la petición

        try {
            const incomeProducts = selectedProducts.map(prod => ({
                amount: prod.amount,
                description: prod.description,
                source: prod.source,
                type: 'income'
            }));

            const [result, errorTransaction] = await addIncomesService(incomeProducts);
            console.log(result)
            setIsLoading(false);
            setShowConfirmation(false);

            if (errorTransaction) {
                setIsError(true);
                setError('general', { type: 'server', message: errorTransaction });
            } else if (Array.isArray(result) && result.length > 0) {
                setStockErrors(result);
                setSelectedProducts([]);
                setIsLoading(false);
            } else {
                // Éxito (arreglo vacío)
                setIsSuccess(true);
                setIsLoading(false);
                setSelectedProducts([]);
                await updateMenuItems();
                setTimeout(() => {
                    reset();
                    setIsSuccess(false);
                }, 2000);
                setStockErrors([]); // Aseguramos limpiar errores de stock
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
                                {item.name} - ${item.price} {item.disabled ? '(Sin stock)' : ''}
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

            {stockErrors.length > 0 && (
                <div className="stock-info-container">
                    <div className="stock-info-header">
                        <h3>Stock no disponible</h3>
                        <button onClick={() => setStockErrors([])} className="close-button">X</button>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {stockErrors.map((item, idx) => (
                            <li key={idx} style={{ marginBottom: '10px' }}>
                                {item.product} - Disponible: {item.available}
                            </li>
                        ))}
                    </ul>
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
