// utils/MenuLoader.js
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

  static loadMenu() {
    const menuPath = path.join(__dirname, "..", "data", "menu.json");
    const rawData = fs.readFileSync(menuPath, "utf-8");
    this.menu = JSON.parse(rawData);
  }

  static async loadInventory() {
    const productRepository = AppDataSource.getRepository(Product);
    const products = await productRepository.find();
    this.inventory = products;
  }

  static checkMenuAvailability() {
    const inventoryMap = new Map();
    for (const prod of this.inventory) {
      inventoryMap.set(prod.nombreProducto.toLowerCase(), prod);
    }

    for (const item of this.menu) {
      const { name, price, ingredients } = item;

      if (!Array.isArray(ingredients) || ingredients.length === 0) {
        this.finalMenu.menu.out_of_stock.push({ name, price, amount: 0 });
        continue;
      }

      let maxQuantity = Infinity;
      let canMake = true;

      for (const ing of ingredients) {
        const ingName = ing.name.trim().toLowerCase();
        const ingAmount = ing.amount;

        const stockItem = inventoryMap.get(ingName);
        if (!stockItem || stockItem.cantidadProducto < ingAmount) {
          maxQuantity = 0;
          canMake = false;
          break;
        } else {
          const currentMax = Math.floor(stockItem.cantidadProducto / ingAmount);
          if (currentMax < maxQuantity) {
            maxQuantity = currentMax;
          }
        }
      }

      if (canMake && maxQuantity > 0) {
        this.finalMenu.menu.on_stock.push({ name, price, amount: maxQuantity });
      } else {
        this.finalMenu.menu.out_of_stock.push({ name, price, amount: 0 });
      }
    }
  }

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

  static async refreshMenu() {
    try {
      this.finalMenu = {
        menu: {
          on_stock: [],
          out_of_stock: []
        }
      };
      await this.loadInventory();
      this.checkMenuAvailability();
      return this.finalMenu;
    } catch (error) {
      console.error("Error al refrescar el menú:", error);
      return null;
    }
  }
}
