"use strict";
import { MenuLoader } from "../utils/MenuLoader.js";

export async function getFinalMenuService() {
  try {
    const finalMenu = await MenuLoader.refreshMenu();

    if (!finalMenu || !finalMenu.menu) {
      return [null, "No se encontró el menú final"];
    }
    return [finalMenu, null];
  } catch (error) {
    console.error("Error al obtener el menú final:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getAvailableMenuService() {
  try {
    const finalMenu = await MenuLoader.refreshMenu();
    if (!finalMenu || !finalMenu.menu) {
      return [null, "No se encontró el menú"];
    }

    console.log(finalMenu)
    const onStockItems = finalMenu.menu.on_stock.map(item => ({
      name: item.name,
      price: item.price,
      amount: item.amount,
      source: item.source,
      ingredients: item.ingredients
    }));

    const outOfStockItems = finalMenu.menu.out_of_stock.map(item => ({
      name: item.name,
      price: item.price,
      amount: item.amount,
      source: item.source,
      ingredients: item.ingredients
    }));

    return [{
      menu: {
        on_stock: onStockItems,
        out_of_stock: outOfStockItems
      }
    }, null];
  } catch (error) {
    console.error("Error al obtener el menú disponible:", error);
    return [null, "Error interno del servidor"];
  }
}