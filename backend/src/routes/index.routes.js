"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import expensesRoutes from "./expenses.routes.js";
import incomeRoutes from "./income.routes.js";

const router = Router();

router
  .use("/auth", authRoutes)
  .use("/user", userRoutes)
  .use("/expense", expensesRoutes)
  .use("/income", incomeRoutes);

export default router;
