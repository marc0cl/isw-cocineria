"use strict";
import { Router } from "express";
import { isAdmin, isGarzon } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { getAvailableMenuController, getFinalMenuController } from "../controllers/menu.controller.js";

const router = Router();

router.get("/available", getAvailableMenuController);

router.use(authenticateJwt);
router.get("/", isGarzon, getFinalMenuController);

export default router;
