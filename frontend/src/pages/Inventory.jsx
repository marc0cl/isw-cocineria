import React, { useState } from "react";
import { addProductToInventory } from "../services/inventoryService";

const InventoryPage = () => {
    const [product, setProduct] = useState("");
    const [quantity, setQuantity] = useState(0);

    const handleAddProduct = async () => {
        try {
            await addProductToInventory({ name: product, quantity });
            alert("Producto agregado al inventario");
            setProduct("");
            setQuantity(0);
        } catch (error) {
            console.error("Error al agregar el producto:", error);
        }
    };

    return (
        <div>
            <h2>Gestión de Inventario</h2>
            <input
                type="text"
                placeholder="Nombre del producto"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
            />
            <input
                type="number"
                placeholder="Cantidad"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <button onClick={handleAddProduct}>Agregar Producto</button>
        </div>
    );
};

export default InventoryPage;
