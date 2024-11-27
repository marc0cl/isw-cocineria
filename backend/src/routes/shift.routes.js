"use strict"
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    createShift,
    deleteShift,
    getShift,
    getShifts,
    updateShift,
} from "../controllers/shift.controller.js";

const router = Router();

router.use(authenticateJwt);

router .get("/all", getShifts);
router.get("/:id", getShift);

router
    .post("/",isAdmin ,createShift) 
    .patch("/:id", isAdmin,updateShift)
    .delete("/:id",isAdmin, deleteShift);

export default router;