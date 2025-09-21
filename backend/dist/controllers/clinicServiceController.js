"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInsurance = exports.addInsurance = exports.deleteClinicService = exports.updateClinicService = exports.getClinicServiceById = exports.getAllClinicServices = exports.createClinicService = void 0;
const clinicService_service_1 = require("../services/clinicService.service");
const clinicService_1 = __importDefault(require("../models/clinicService"));
// کنترلر افزودن سرویس
const createClinicService = async (req, res) => {
    try {
        const { serviceCode, serviceName, serviceGroup, pricePublic, priceGovernmental, baseInsurances, supplementaryInsurances, isFreeForStaff, } = req.body;
        // اعتبارسنجی اولیه
        if (!serviceCode || !serviceName || !serviceGroup) {
            return res.status(400).json({ message: "فیلدهای الزامی پر نشده‌اند" });
        }
        // بررسی یکتا بودن serviceCode
        const exists = await clinicService_1.default.findOne({ serviceCode });
        if (exists) {
            return res.status(409).json({ message: "کد خدمت قبلاً ثبت شده است" });
        }
        // ایجاد سرویس جدید
        const newService = await (0, clinicService_service_1.createSevice)({
            serviceCode,
            serviceName,
            serviceGroup,
            pricePublic: pricePublic || 0,
            priceGovernmental: priceGovernmental || 0,
            baseInsurances: baseInsurances || [],
            supplementaryInsurances: supplementaryInsurances || [],
            isFreeForStaff: isFreeForStaff || false,
        });
        return res.status(201).json({
            message: "خدمت با موفقیت ایجاد شد",
            service: newService,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "خطا در ایجاد سرویس",
            error: err.message,
        });
    }
};
exports.createClinicService = createClinicService;
// کنترلر دریافت همه سرویس‌ها
const getAllClinicServices = async (_req, res) => {
    try {
        const result = await (0, clinicService_service_1.getAllServices)();
        res.status(200).json(result);
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "خطا در دریافت سرویس‌ها", error: err.message });
    }
};
exports.getAllClinicServices = getAllClinicServices;
// کنترلر دریافت سرویس خاص
const getClinicServiceById = async (req, res) => {
    try {
        const result = await (0, clinicService_service_1.getServicesById)(req.params.id);
        if (!result)
            return res.status(404).json({ message: "سرویس پیدا نشد" });
        res.status(200).json(result);
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "خطا در دریافت سرویس", error: err.message });
    }
};
exports.getClinicServiceById = getClinicServiceById;
// کنترلر ویرایش سرویس
const updateClinicService = async (req, res) => {
    try {
        const result = await (0, clinicService_service_1.updateService)(req.params.id, req.body);
        if (!result)
            return res.status(404).json({ message: "سرویس پیدا نشد" });
        res.status(200).json(result);
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "خطا در ویرایش سرویس", error: err.message });
    }
};
exports.updateClinicService = updateClinicService;
// کنترلر حذف سرویس
const deleteClinicService = async (req, res) => {
    try {
        const result = await (0, clinicService_service_1.deleteServices)(req.params.id);
        if (!result)
            return res.status(404).json({ message: "سرویس پیدا نشد" });
        res.status(200).json({ message: "سرویس حذف شد" });
    }
    catch (err) {
        res.status(500).json({ message: "خطا در حذف سرویس", error: err.message });
    }
};
exports.deleteClinicService = deleteClinicService;
// کنترلر افزودن بیمه تکمیلی
const addInsurance = async (req, res) => {
    try {
        const result = await (0, clinicService_service_1.addSupplementaryInsurance)(req.params.serviceId, req.body);
        res.status(201).json(result);
    }
    catch (err) {
        res.status(400).json({ message: "خطا در افزودن بیمه", error: err.message });
    }
};
exports.addInsurance = addInsurance;
// کنترلر آپدیت قیمت بیمه
const updateInsurance = async (req, res) => {
    try {
        const result = await (0, clinicService_service_1.updateInsurancePrice)(req.params.serviceId, req.params.companyName, req.body.contractPrice);
        res.status(200).json(result);
    }
    catch (err) {
        res.status(400).json({ message: "خطا در آپدیت بیمه", error: err.message });
    }
};
exports.updateInsurance = updateInsurance;
