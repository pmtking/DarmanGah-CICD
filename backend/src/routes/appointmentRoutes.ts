import express from "express";
import { FindAppointmentController, ReserveAppointmentController } from "../controllers/appointmentController";

const router = express.Router();

router.post("/add", ReserveAppointmentController);
router.post("/find" ,FindAppointmentController )

export default router;
