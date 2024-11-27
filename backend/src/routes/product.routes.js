"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controller.js";

const router = Router();

// Rutas públicas, accesibles para todos los usuarios autenticados
router.use(authenticateJwt); // Solo usuarios autenticados pueden acceder
router.get("/", getProducts);  // Obtener todos los productos (accesible para todos los usuarios autenticados)
router.get("/detail/", getProduct); // Obtener un solo producto (accesible para todos los usuarios autenticados)

// Rutas protegidas por admin
router.use(isAdmin); // Solo los administradores pueden acceder a estas rutas protegidas
router.post("/", createProduct);        // Crear un nuevo producto
router.patch("/detail/", updateProduct);  // Actualizar un producto
router.delete("/detail/", deleteProduct); // Eliminar un producto

export default router;