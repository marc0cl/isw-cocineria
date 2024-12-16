"use strict";
import { Router } from "express";
import { createProv, deleteProv, getProv, getProvs, updateProv } from "../controllers/prov.controller.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

router.use(authenticateJwt);

router.post("/", isAdmin, createProv);
router.get("/:id", isAdmin, getProv);
router.get("/all/t", isAdmin, getProvs);
router.put("/:id", isAdmin, updateProv);
router.delete("/:id", isAdmin, deleteProv);

export default router;