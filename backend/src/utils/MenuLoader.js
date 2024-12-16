"use strict";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { AppDataSource } from "../config/configDb.js";
import Product from "../entity/product.entity.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class MenuLoader {
  static menu = [];
  static inventory = [];
  static finalMenu = {
    menu: {
      on_stock: [],
      out_of_stock: []
    }
  };

  // Carga el menú desde el archivo estático
  static loadMenu() {
    const menuPath = path.join(__dirname, "..", "data", "menu.json");
    const rawData = fs.readFileSync(menuPath, "utf-8");
    this.menu = JSON.parse(rawData);
  }

  // Obtiene inventario de la base de datos
  static async loadInventory() {
    const productRepository = AppDataSource.getRepository(Product);
    const products = await productRepository.find();
    this.inventory = products;
  }

  // Verifica la disponibilidad de cada ítem del menú
  static checkMenuAvailability() {
    // Convertir el inventario en un mapa para acceso O(1)
    const inventoryMap = new Map();
    for (const prod of this.inventory) {
      // Clave: nombreProducto (en el inventario se llama nombreProducto)
      inventoryMap.set(prod.nombreProducto.toLowerCase(), prod);
    }

    for (const item of this.menu) {
      const { name, price, ingredients } = item;

      if (!Array.isArray(ingredients) || ingredients.length === 0) {
        // Sin ingredientes => no se puede preparar
        this.finalMenu.menu.out_of_stock.push({ name, price, amount: 0 });
        continue;
      }

      let maxQuantity = Infinity;
      let canMake = true;

      // Verificamos cada ingrediente
      for (const ing of ingredients) {
        const ingName = ing.name.trim().toLowerCase();
        const ingAmount = ing.amount; // cantidad necesaria para hacer 1 unidad del producto

        const stockItem = inventoryMap.get(ingName);
        if (!stockItem || stockItem.cantidadProducto < ingAmount) {
          // Si no existe o no hay suficiente stock
          maxQuantity = 0;
          canMake = false;
          break;
        } else {
          // Calculamos cuántas unidades se pueden hacer con este ingrediente
          const currentMax = Math.floor(stockItem.cantidadProducto / ingAmount);
          if (currentMax < maxQuantity) {
            maxQuantity = currentMax;
          }
        }
      }

      if (canMake && maxQuantity > 0) {
        // Se puede hacer al menos una unidad
        this.finalMenu.menu.on_stock.push({
          name,
          price,
          amount: maxQuantity
        });
      } else {
        // No se puede preparar
        this.finalMenu.menu.out_of_stock.push({
          name,
          price,
          amount: 0
        });
      }
    }
  }

  // Método para inicializar todo el flujo
  static async init() {
    try {
      this.loadMenu();
      await this.loadInventory();
      this.checkMenuAvailability();
      return this.finalMenu;
    } catch (error) {
      console.error("Error al inicializar DataLoader:", error);
      return null;
    }
  }
}
