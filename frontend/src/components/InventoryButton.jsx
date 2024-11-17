import React from "react";

const InventoryButton = ({ onClick }) => {
    return (
        <button onClick={onClick} style={{ padding: "10px 20px", background: "#4CAF50", color: "white", border: "none", cursor: "pointer" }}>
            Inventario
        </button>
    );
};

export default InventoryButton;
