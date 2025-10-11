import express from "express";
import { CancelByNationalCodeController, FindAppointmentController, GetAppointmentController, GetAvailableTimesController, ReserveAppointmentController } from "../controllers/appointmentController";

const router = express.Router();

router.post("/add", ReserveAppointmentController);
router.post("/available", GetAvailableTimesController);
router.post("/find" ,FindAppointmentController )
router.get("/" , GetAppointmentController) ;
router.post("/cancel-by-code", CancelByNationalCodeController);
export default router;
