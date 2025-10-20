"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const personnelSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    nationalId: { type: String, required: true, unique: true },
    phone: { type: String },
    gender: { type: String, enum: ["MALE", "FEMALE", "OTHER"] },
    role: {
        type: String,
        enum: ["DOCTOR", "NURSE", "RECEPTION", "MANAGER", "SERVICE"],
        required: true,
    },
    salaryType: {
        type: String,
        enum: ["FIXED", "PERCENTAGE"],
        default: "FIXED",
    },
    isActive: { type: Boolean, default: true },
    hireAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    currentShift: { type: mongoose_1.Schema.Types.ObjectId, ref: "Shift", default: null },
    shifts: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Shift" }],
    performances: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Performance" }],
    avatar: { type: String }, // مسیر عکس
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("Personnel", personnelSchema);
