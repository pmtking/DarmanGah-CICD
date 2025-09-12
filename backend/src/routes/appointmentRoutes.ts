import express from "express";
import { FindAppointmentController, GetAppointmentController, ReserveAppointmentController } from "../controllers/appointmentController";

const router = express.Router();

router.post("/add", ReserveAppointmentController);
router.post("/find" ,FindAppointmentController )
router.get("/" , GetAppointmentController) ;

export default router;
