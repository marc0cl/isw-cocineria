"use strict"
import { Router } from "express";
import {
    deleteShift,
    getShift,
    getShifts,
    updateShift,
} from "../controllers/shift.controller.js";


const router = Router();
router
    .get("/", getShifts)
    .get("/detail/", getShift)
    .patch("/detail/", updateShift)
    .delete("/detail/", deleteShift);

export default router;