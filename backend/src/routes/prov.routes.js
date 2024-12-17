"use strict";
import { Router } from "express";
import { createProv, deleteProv, getProv, getProvs, updateProv } from "../controllers/prov.controller.js";
import { isAdmin, isEncargado } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

router.use(authenticateJwt);

router.post("/", isAdmin, isEncargado, createProv);
router.get("/:id", isAdmin, isEncargado, getProv);
router.get("/all/t", isAdmin, isEncargado, getProvs);
router.put("/:id", isAdmin, isEncargado, updateProv);
router.delete("/:id", isAdmin, isEncargado, deleteProv);

export default router;