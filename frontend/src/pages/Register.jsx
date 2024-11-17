import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register as registerService } from '@services/auth.service.js';
import Form from "@components/Form";
import { useForm } from 'react-hook-form';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import '@styles/form.css';

const Register = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, setError, formState: { errors } } = useForm();
    const [generalError, setGeneralError] = useState('');

    const registerSubmit = async (data) => {
        setGeneralError('');
        try {
            const response = await registerService(data);
            console.log("Respuesta del servidor:", response);
            if (response.status === 'Success') {
                showSuccessAlert('¡Registrado!', 'Usuario registrado exitosamente.');
                setTimeout(() => {
                    navigate('/auth');
                }, 3000);
            } else if (response.status === 'Client error') {
                if (Array.isArray(response.details)) {
                    response.details.forEach(detail => {
                        if (detail.field === 'rut') {
                            setGeneralError(detail.message);
                        } else {
                            setError(detail.field, { type: 'server', message: detail.message });
                        }
                    });
                } else if (typeof response.details === 'string') {
                    setGeneralError(response.details);
                } else if (typeof response.details === 'object' && response.details !== null) {
                    const { dataInfo, message } = response.details;
                    if (dataInfo === 'rut') {
                        setGeneralError(message);
                    } else if (dataInfo) {
                        setError(dataInfo, { type: 'server', message });
                    }
                } else {
                    setGeneralError('Ocurrió un error desconocido al procesar el registro.');
                }
            }
        } catch (error) {
            console.error("Error al registrar un usuario: ", error);
            showErrorAlert('Cancelado', 'Ocurrió un error al registrarse.');
            setGeneralError('Ocurrió un error al conectarse con el servidor.');
        }
    };

    const patternRut = /^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/;

    return (
        <main className="container">
            {generalError && (
                <div className="error-box">
                    {generalError}
                </div>
            )}
            <Form
                title="Crea tu cuenta"
                fields={[
                    {
                        label: "Nombre completo",
                        name: "nombreCompleto",
                        placeholder: "Diego Alexis Salazar Jara",
                        fieldType: 'input',
                        type: "text",
                        required: true,
                        minLength: 10,
                        maxLength: 50,
                        pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                        patternMessage: "Debe contener solo letras y espacios",
                    },
                    {
                        label: "Correo electrónico",
                        name: "email",
                        placeholder: "example@gmail.cl",
                        fieldType: 'input',
                        type: "email",
                        required: true,
                        maxLength: 35,
                        validate: {
                            emailDomain: (value) => value.endsWith('@gmail.cl') || 'El correo debe terminar en @gmail.cl',
                            isValidEmail: (value) => /\S+@\S+\.\S+/.test(value) || 'El correo no es válido'
                        }
                    },
                    {
                        label: "Rut",
                        name: "rut",
                        placeholder: "23.770.330-1",
                        fieldType: 'input',
                        type: "text",
                        minLength: 9,
                        maxLength: 12,
                        pattern: patternRut,
                        patternMessage: "Debe ser xx.xxx.xxx-x o xxxxxxxx-x",
                        required: true,
                        validate: {
                            validRut: (value) => patternRut.test(value) || "Rut inválido"
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
                buttonText="Registrarse"
                onSubmit={handleSubmit(registerSubmit)}
                footerContent={
                    <p>
                        ¿Ya tienes cuenta?, <a href="/auth">¡Inicia sesión aquí!</a>
                    </p>
                }
                register={register}
                errors={errors}
                isSubmitting={false}
            />
        </main>
    );
};

export default Register;
