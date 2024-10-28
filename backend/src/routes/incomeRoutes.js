"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  addIncome,
  deleteIncome,
  getIncome,
  getIncomes,
  updateIncome,
} from "../controllers/incomeController.js";

const router = Router();

router.use(authenticateJwt);

router.post("/", addIncome);

router
  .get("/", isAdmin, getIncomes)          
  .get("/detail/", isAdmin, getIncome)     
  .patch("/detail/", isAdmin, updateIncome) 
  .delete("/detail/", isAdmin, deleteIncome);

export default router;
