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

router
  .use(authenticateJwt)
  .use(isAdmin);

router
  .get("/", getProducts)              // Obtener todos los productos
  .get("/detail/", getProduct)         // Obtener un solo producto
  .post("/", createProduct)            // Crear un nuevo producto
  .patch("/detail/", updateProduct)    // Actualizar un producto
  .delete("/detail/", deleteProduct);  // Eliminar un producto

export default router;