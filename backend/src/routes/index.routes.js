"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import provRoutes from "./prov.routes.js";
import productRoutes from "./product.routes.js";
import expensesRoutes from "./expenses.routes.js";
import incomeRoutes from "./income.routes.js";
import shiftRoutes from "./shift.routes.js";

const router = Router();

router
  .use("/prov", provRoutes)
  .use("/product", productRoutes)
  .use("/auth", authRoutes)
  .use("/user", userRoutes)
  .use("/expense", expensesRoutes)
  .use("/income", incomeRoutes)
  .use("/shift",shiftRoutes);

export default router;