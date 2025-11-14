import express from "express";
import { UserRepo } from "../controllers/patientController";
const router = express.Router() ;



router.post('/find' , UserRepo)

export default router;