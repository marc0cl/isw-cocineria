"use strict"
import { Router } from "express";
import {
    createShift,
    deleteShift,
    getShift,
    getShifts,
    updateShift,
} from "../controllers/shift.controller.js";



const router = Router();

router
    .post("/", createShift)
    .get("/", getShifts)
    .get("/:id", getShift)
    .patch("/:id", updateShift)
    .delete("/:id", deleteShift);

export default router;