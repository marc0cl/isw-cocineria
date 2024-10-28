"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import expensesRoutes from "./expensesRoutes.js";
import incomeRoutes from "./incomeRoutes.js";

const router = Router();

router
  .use("/auth", authRoutes)
  .use("/user", userRoutes)
  .use("/expense", expensesRoutes)
  .use("/income", incomeRoutes);

export default router;
