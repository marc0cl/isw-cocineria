import React from "react";
import InventoryButton from "../components/InventoryButton"; // Importamos el botón creado

const Home = () => {
    const handleInventoryClick = () => {
        // Aquí puedes redirigir a la página de inventario
        console.log("Redirigiendo a la página de inventario...");
    };

    return (
        <>
            <h1>Bienvenido al Sistema</h1>
            <InventoryButton onClick={handleInventoryClick} />
        </>
    );
};

export default Home;
