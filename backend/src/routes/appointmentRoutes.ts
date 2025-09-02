import express from "express";
import { ReserveAppointmentController } from "../controllers/appointmentController";

const router = express.Router();

router.post("/add", ReserveAppointmentController);

export default router;
