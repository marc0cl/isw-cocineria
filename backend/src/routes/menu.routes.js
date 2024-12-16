"use strict";
import { Router } from "express";
import { isAdmin, isGarzon } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { getAvailableMenuController, getFinalMenuController } from "../controllers/menu.controller.js";

const router = Router();

router.use(authenticateJwt);

router.get("/", isAdmin, isGarzon, getFinalMenuController);
router.get("/available", getAvailableMenuController);

export default router;
