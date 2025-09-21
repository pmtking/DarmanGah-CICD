"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appointmentController_1 = require("../controllers/appointmentController");
const router = express_1.default.Router();
router.post("/add", appointmentController_1.ReserveAppointmentController);
router.post("/find", appointmentController_1.FindAppointmentController);
router.get("/", appointmentController_1.GetAppointmentController);
exports.default = router;
