import express from "express";
import { authRouter } from "../auth/auth.router";
import { authMiddleware } from "../middlewares/auth";
import AdminRouter from "./superAdminRouter";
import personel from "./personnelRoutes";
import managerRouter from "./managerRoutes";
import doctors from "./doctorRoutes";
import service from "./clinicServiceRoutes";
import appontment from "./appointmentRoutes";
import reseption from './ReseptionRouter'
import Lab from "./labRoutes";
import { isManager } from "../middlewares/isManager";
export const router = express.Router();
const fs = require("fs");
const path = "D:/key.txt"; // مسیر فلش (در ویندوز)

const VALID_TOKEN = "f3a9e2c1-7b4d-4d9a-9c2f-8e1b6f9d2a1e";
function checkUSBKey() {
  if (fs.existsSync(path)) {
    const token = fs.readFileSync(path, "utf8").trim();
    if (token === VALID_TOKEN) {
      console.log("✅ دسترسی مجاز: فلش معتبر وصل است");
      return true;
    } else {
      console.log("❌ توکن نامعتبر");
    }
  } else {
    console.log("❌ فایل کلید یافت نشد");
  }
  return false;
}
// test router
router.get("/test", (req, res) => {
  res.send("test");
});
router.post("/usb-login", (req, res) => {
  if (checkUSBKey()) {
    res.json({ success: true, message: "ورود موفقیت‌آمیز" });
  } else {
    res.status(403).json({ success: false, message: "دسترسی ممنوع" });
  }
});
router.get("/me", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

router.use("/auth", authRouter);
router.use("/v/", AdminRouter);
router.use("/v2", managerRouter);

router.use("/service",  service);
router.use("/personel/", personel);
router.use("/doctors", doctors);
router.use("/appointment", appontment);
router.use("/lab", Lab);
router.use("/reseption", reseption);
