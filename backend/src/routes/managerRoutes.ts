import express from "express";
import { createManagerController } from "../controllers/managerController";
import { verifySuperAdmin } from "../middlewares/verifySuperAdmin ";

const router = express.Router();
router.post('/manager/add' ,verifySuperAdmin, createManagerController )
export default router;
