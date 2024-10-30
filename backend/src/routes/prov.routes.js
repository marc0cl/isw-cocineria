"use strict";
import { Router } from "express";
import { createProv, getProv, getProvs, updateProv, deleteProv } from '../controllers/prov.controller.js';

const router = Router();

router.post('/', createProv);
router.get('/:id', getProv);
router.get('/all/t', getProvs);
router.put('/:id', updateProv);
router.delete('/:id', deleteProv);

export default router;