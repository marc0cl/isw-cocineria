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

    const onStockNames = finalMenu.menu.on_stock?.map(item => ({ name: item.name })) || [];
    const outOfStockNames = finalMenu.menu.out_of_stock?.map(item => ({ name: item.name })) || [];

    return [{
      menu: {
        on_stock: onStockNames,
        out_of_stock: outOfStockNames
      }
    }, null];
  } catch (error) {
    console.error("Error al obtener el menú disponible:", error);
    return [null, "Error interno del servidor"];
  }
}
