import express from "express";
import { CancelByNationalCodeController, FindAppointmentController, GetAppointmentController, ReserveAppointmentController } from "../controllers/appointmentController";

const router = express.Router();

router.post("/add", ReserveAppointmentController);
router.post("/find" ,FindAppointmentController )
router.get("/" , GetAppointmentController) ;
router.post("/cancel-by-code", CancelByNationalCodeController);
export default router;
