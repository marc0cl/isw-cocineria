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
  getCriticalProducts,
  updateStockAfterSale,
  checkAvailability // nuevo controlador
} from "../controllers/product.controller.js";

const router = Router();

router.use(authenticateJwt);
router.get("/", getProducts);
router.get("/detail/", getProduct);
router.get("/critical", isAdmin, getCriticalProducts);
router.post("/update-stock", isAdmin, updateStockAfterSale);

router.post("/check-availability", checkAvailability);

router.use(isAdmin);
router.post("/", createProduct);
router.patch("/detail/", updateProduct);
router.delete("/detail/", deleteProduct);

export default router;
