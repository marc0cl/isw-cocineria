"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  addExpense,
  deleteExpense,
  getExpense,
  getExpenses,
  updateExpense,
} from "../controllers/expense.controller.js";

const router = Router();

router.use(authenticateJwt);

router.post("/", addExpense);

router
  .get("/", isAdmin, getExpenses)
  .get("/detail/", isAdmin, getExpense)
  .patch("/detail/", isAdmin, updateExpense)
  .delete("/detail/", isAdmin, deleteExpense);

export default router;
