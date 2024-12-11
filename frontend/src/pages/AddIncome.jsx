import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import menuData from '../../menu.json';
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

    useEffect(() => {
        setMenuItems(menuData);
    }, []);

    const handleAddProduct = (data) => {
        const selectedItem = menuItems.find(item => item.name === data.product);
        if (!selectedItem) {
            setError('product', { type: 'manual', message: 'Producto no válido' });
            return;
        }
        const newProduct = {
            amount: selectedItem.price,
            description: selectedItem.name,
            source: selectedItem.source,
        };
        setSelectedProducts([...selectedProducts, newProduct]);
        reset({ product: '' });
    };

    const handleRemoveProduct = (index) => {
        const updatedList = [...selectedProducts];
        updatedList.splice(index, 1);
        setSelectedProducts(updatedList);
    };

    const onSubmit = () => {
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
            const [ , errorTransaction] = await addIncomesService(selectedProducts);
            if (errorTransaction) {
                setIsError(true);
                setIsLoading(false);
                setError('general', { type: 'server', message: errorTransaction });
            } else {
                setIsSuccess(true);
                setIsLoading(false);
                setTimeout(() => {
                    reset();
                    setSelectedProducts([]);
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
                            <option key={index} value={item.name}>
                                {item.name} - ${item.price}
                            </option>
                        ))}
                    </select>
                    <div className={`error-message ${errors.product ? 'visible' : ''}`}>
                        {errors.product?.message}
                    </div>
                </div>
                <button type="submit" disabled={isLoading}>
                    Agregar producto a la lista
                </button>
                <div className="error-message visible">
                    {errors.general?.message}
                </div>
            </form>

            {selectedProducts.length > 0 && (
                <div className="form" style={{ marginTop: '20px' }}>
                    <h2>Productos seleccionados</h2>
                    <ul>
                        {selectedProducts.map((prod, idx) => (
                            <li key={idx}>
                                {prod.description} - ${prod.amount} ({prod.source})
                                <button
                                    type="button"
                                    onClick={() => handleRemoveProduct(idx)}
                                    style={{
                                        marginLeft: '10px',
                                        backgroundColor: 'red',
                                        color: '#fff',
                                        borderRadius: '5px',
                                        border: 'none',
                                        padding: '5px'
                                    }}
                                >
                                    Eliminar
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={isLoading || selectedProducts.length === 0}
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
