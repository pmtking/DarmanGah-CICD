"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/Appointment.ts
const mongoose_1 = __importDefault(require("mongoose"));
const appointmentSchema = new mongoose_1.default.Schema({
    fullName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    insuranceType: {
        type: String,
        required: true,
        enum: ["تأمین اجتماعی", "سلامت", "آزاد", "نیروهای مسلح", "سایر"],
    },
    nationalCode: {
        type: String,
        required: true,
    },
    doctorId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "DoctorProfile",
        required: true,
    },
    appointmentDate: {
        type: Date,
        required: true,
    },
    appointmentTime: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "reserved",
        enum: ["reserved", "cancelled", "visited"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
exports.default = mongoose_1.default.model("Appointment", appointmentSchema);
