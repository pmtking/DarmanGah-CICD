"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// models/Reseption.ts
const mongoose_1 = __importStar(require("mongoose"));
const reseptionSchema = new mongoose_1.Schema({
    patientName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    relationWithGuardian: { type: String, default: "خود شخص" },
    visitType: {
        type: String,
        required: true,
        enum: ["اولیه", "پیگیری", "اورژانسی"],
    },
    insuranceType: {
        type: String,
        required: true,
        enum: ["تأمین اجتماعی", "سلامت", "آزاد", "نیروهای مسلح", "سایر"],
    },
    supplementaryInsurance: {
        type: String,
        enum: ["دی", "آتیه", "ایران", "سایر"],
    },
    doctorId: { type: mongoose_1.Schema.Types.ObjectId, ref: "DoctorProfile", required: true },
    services: [
        {
            serviceId: { type: mongoose_1.Schema.Types.ObjectId, ref: "ClinicService", required: true },
            quantity: { type: Number, default: 1 },
            price: { type: Number, required: true },
        },
    ],
    staffId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Personnel", required: true },
    appointmentDate: { type: Date, required: true },
    appointmentTime: { type: String, required: true },
    status: { type: String, enum: ["reserved", "cancelled", "visited"], default: "reserved" },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });
const Reseption = mongoose_1.default.model("Reseption", reseptionSchema);
exports.default = Reseption;
