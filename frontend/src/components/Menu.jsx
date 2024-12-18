import { useState, useEffect } from 'react';
import { fetchMenuDefault } from '../services/menu.service.js';
import '@styles/menu.css';

const Menu = () => {
    const [menuData, setMenuData] = useState(null);

    useEffect(() => {
        fetchMenuDefault()
            .then(data => {
                setMenuData(data.menu);
            })
            .catch(error => {
                console.error('Error al cargar el menú:', error);
            });
    }, []);

    const groupBySource = (items) => {
        return items.reduce((acc, item) => {
            if (!acc[item.source]) {
                acc[item.source] = [];
            }
            acc[item.source].push(item);
            return acc;
        }, {});
    };

    if (!menuData) {
        return <p>Cargando menú...</p>;
    }

    const allItems = [...menuData.on_stock, ...menuData.out_of_stock];
    const groupedItems = groupBySource(allItems);

    return (
        <div className="menu-container">
            <h1>Menú</h1>
            {Object.keys(groupedItems).map(source => (
                <div key={source} className="menu-section">
                    <h2>{source.charAt(0).toUpperCase() + source.slice(1)}</h2>
                    <div className="menu-items">
                        {groupedItems[source].map((item, index) => {
                            const isOutOfStock = item.amount === 0;
                            return (
                                <div
                                    key={index}
                                    className={`menu-card ${isOutOfStock ? 'out-of-stock' : ''}`}
                                >
                                    <h3>{item.name}</h3>
                                    <p>Precio: ${item.price}</p>
                                    <p>Cantidad Disponible: {item.amount}</p>
                                    <p>Ingredientes: {item.ingredients.join(', ')}</p>
                                    {isOutOfStock && <p><em>Actualmente sin stock</em></p>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Menu;
