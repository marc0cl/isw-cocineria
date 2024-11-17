import { useNavigate } from 'react-router-dom';
import { login } from '@services/auth.service.js';
import Form from '@components/Form';
import { useForm } from 'react-hook-form';
import Spinner from '@components/Login/Spinner';
import SuccessTick from '@components/Login/SuccessTick';
import ErrorX from '@components/Login/ErrorX';
import '@styles/form.css';
import { useState } from "react";

const Login = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, setError, formState: { errors } } = useForm();

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);

    const loginSubmit = async (data) => {
        setIsLoading(true);
        setIsSuccess(false);
        setIsError(false);
        try {
            const response = await login(data);
            if (response.status === 'Success') {
                setIsSuccess(true);
                setIsLoading(false);

                setTimeout(() => {
                    navigate('/home');
                }, 1000);
            } else if (response.status === 'Client error') {
                setIsError(true);
                if(response.details.dataInfo === 'email') {
                    setError('email', { type: 'server', message: response.details.message });
                } else if(response.details.dataInfo === 'password') {
                    setError('password', { type: 'server', message: response.details.message });
                }
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            setIsError(true);
            setError('general', { type: 'server', message: 'Ocurrió un error inesperado. Por favor, intenta nuevamente.' });
        }
    };

    return (
        <main className="container">
            <Form
                title="Iniciar sesión"
                fields={[
                    {
                        label: "Correo electrónico",
                        name: "email",
                        placeholder: "example@gmail.cl",
                        fieldType: 'input',
                        type: "email",
                        required: true,
                        minLength: 15,
                        maxLength: 30,
                        validate: {
                            emailDomain: (value) => value.endsWith('@gmail.cl') || 'El correo debe terminar en @gmail.cl'
                        },
                    },
                    {
                        label: "Contraseña",
                        name: "password",
                        placeholder: "**********",
                        fieldType: 'input',
                        type: "password",
                        required: true,
                        minLength: 8,
                        maxLength: 26,
                        pattern: /^[a-zA-Z0-9]+$/,
                        patternMessage: "Debe contener solo letras y números",
                    },
                ]}
                buttonText={
                    isLoading ? <Spinner /> :
                        isSuccess ? <SuccessTick /> :
                            isError ? <ErrorX /> :
                                "Iniciar sesión"
                }
                onSubmit={handleSubmit(loginSubmit)}
                footerContent={
                    <p>
                        ¿No tienes cuenta?, <a href="/register">¡Regístrate aquí!</a>
                    </p>
                }
                register={register}
                errors={errors}
                isSubmitting={isLoading}
            />
            {errors.general && (
                <div className="error-message visible">
                    {errors.general.message}
                </div>
            )}
        </main>
    );
};

export default Login;
