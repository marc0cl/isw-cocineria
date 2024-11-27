import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import menuData from '../../menu.json';
import { addIncomeService } from '@services/transaction.service.js';
import Spinner from '@components/Login/Spinner';
import SuccessTick from '@components/Login/SuccessTick';
import ErrorX from '@components/Login/ErrorX';
import '@styles/form.css';

const AddIncome = () => {
    const { register, handleSubmit, setError, reset, formState: { errors } } = useForm();
    const [menuItems, setMenuItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        setMenuItems(menuData);
    }, []);

    const onSubmit = async (data) => {
        setIsLoading(true);
        setIsSuccess(false);
        setIsError(false);
        try {
            const selectedItem = menuItems.find(item => item.name === data.product);
            if (!selectedItem) {
                setError('product', { type: 'manual', message: 'Producto no válido' });
                setIsLoading(false);
                return;
            }

            const transactionData = {
                amount: selectedItem.price,
                description: selectedItem.name,
                source: selectedItem.source,
            };

            const [, errorTransaction] = await addIncomeService(transactionData);
            if (errorTransaction) {
                setIsError(true);
                setIsLoading(false);
                setError('general', { type: 'server', message: errorTransaction });
            } else {
                setIsSuccess(true);
                setIsLoading(false);
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

    return (
        <main className="container">
            <form className="form" onSubmit={handleSubmit(onSubmit)}>
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
                    {isLoading ? <Spinner /> :
                        isSuccess ? <SuccessTick /> :
                            isError ? <ErrorX /> :
                                'Registrar Ingreso'}
                </button>
                {errors.general && (
                    <div className="error-message visible">
                        {errors.general.message}
                    </div>
                )}
            </form>
        </main>
    );
};

export default AddIncome;
