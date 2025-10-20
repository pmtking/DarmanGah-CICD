"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCancelSMS = exports.sendReserveSMS = void 0;
// smsService.ts
const node_fetch_1 = __importDefault(require("node-fetch"));
const BASE_URL = "https://edge.ippanel.com/v1/api/send";
const TOKEN = "9UuMXe-r8_2YJba3zR6dStU1Q3O48DodhQnS2bero20=";
const PATTERN_RESERVE = "59szjmh8dalaked"; // پترن رزرو نوبت
const PATTERN_CANCEL = "4jei6lt9csmpku7"; // پترن لغو نوبت
const FROM_NUMBER = "+983000505";
const WEEK_DAYS = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه", "شنبه"];
const sendReserveSMS = async ({ phoneNumber, appointmentDate, appointmentTime }) => {
    try {
        const dateObj = appointmentDate instanceof Date ? appointmentDate : new Date(appointmentDate);
        const dayName = WEEK_DAYS[dateObj.getDay()];
        const body = {
            sending_type: "pattern",
            from_number: FROM_NUMBER,
            code: PATTERN_RESERVE,
            recipients: [phoneNumber],
            params: { day: dayName, time: appointmentTime },
        };
        const response = await (0, node_fetch_1.default)(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: TOKEN },
            body: JSON.stringify(body),
        });
        const text = await response.text();
        if (!response.ok) {
            console.error("❌ HTTP Error (Reserve):", response.status, text);
            return null;
        }
        const data = JSON.parse(text);
        console.log("✅ Reserve SMS Response:", data);
        return data;
    }
    catch (error) {
        console.error("❌ Error sending reserve SMS:", error);
        return null;
    }
};
exports.sendReserveSMS = sendReserveSMS;
const sendCancelSMS = async ({ phoneNumber, appointmentDate }) => {
    try {
        const dateObj = appointmentDate instanceof Date ? appointmentDate : new Date(appointmentDate);
        // YYYY/MM/DD فرمت استاندارد
        const dayFormatted = `${dateObj.getFullYear()}/${(dateObj.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${dateObj.getDate().toString().padStart(2, "0")}`;
        const body = {
            sending_type: "pattern",
            from_number: FROM_NUMBER,
            code: PATTERN_CANCEL,
            recipients: [phoneNumber],
            params: { day: dayFormatted }, // نام پارامتر دقیقاً همان %day% در پترن ippanel
        };
        console.log("📨 Cancel SMS body:", JSON.stringify(body, null, 2));
        const response = await (0, node_fetch_1.default)(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: TOKEN },
            body: JSON.stringify(body),
        });
        const text = await response.text();
        if (!response.ok) {
            console.error("❌ HTTP Error (Cancel):", response.status, text);
            return null;
        }
        const data = JSON.parse(text);
        console.log("✅ Cancel SMS Response:", data);
        return data;
    }
    catch (error) {
        console.error("❌ Error sending cancel SMS:", error);
        return null;
    }
};
exports.sendCancelSMS = sendCancelSMS;
