"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInsurancePrice = exports.addSupplementaryInsurance = exports.deleteServices = exports.updateService = exports.getServicesById = exports.getAllServices = exports.createSevice = void 0;
const clinicService_1 = __importDefault(require("../models/clinicService"));
//  ---------------------------- add service -------------- //
const createSevice = async (date) => {
    const service = new clinicService_1.default(date);
    return await service.save();
};
exports.createSevice = createSevice;
// --------------------------- find all service ------------ //
const getAllServices = async () => {
    return await clinicService_1.default.find();
};
exports.getAllServices = getAllServices;
// ----------------------- get services BY id -------------------- //
const getServicesById = async (id) => {
    return await clinicService_1.default.findById(id);
};
exports.getServicesById = getServicesById;
// ------------------ update services --------------------- //
const updateService = async (id, data) => {
    return await clinicService_1.default.findByIdAndUpdate(id, data, { new: true });
};
exports.updateService = updateService;
// ------------------------- delete service ----------------- //
const deleteServices = async (id) => {
    return await clinicService_1.default.findByIdAndDelete(id);
};
exports.deleteServices = deleteServices;
// ------------------------------- addSupplementaryInsurance --------------------- //
const addSupplementaryInsurance = async (serviceId, insurance) => {
    // پیدا کردن خدمت
    const service = await clinicService_1.default.findById(serviceId);
    if (!service)
        return null;
    // بررسی اینکه بیمه مشابه قبلاً ثبت نشده باشد
    const exists = service.supplementaryInsurances.some((ins) => ins.companyName === insurance.companyName);
    if (exists)
        throw new Error("این شرکت بیمه قبلا ثبت شده است");
    // اضافه کردن بیمه جدید
    service.supplementaryInsurances.push(insurance);
    // ذخیره تغییرات
    return await service.save();
};
exports.addSupplementaryInsurance = addSupplementaryInsurance;
// ------------------------------------ updateInsurancePrice ---------------------- //
const updateInsurancePrice = async (serviceId, type, // نوع بیمه
companyName, newPrice) => {
    const service = await clinicService_1.default.findById(serviceId);
    if (!service)
        return null;
    // انتخاب آرایه بیمه مناسب
    const insuranceArray = type === "base"
        ? service.baseInsurances
        : service.supplementaryInsurances;
    const insurance = insuranceArray.find((ins) => ins.companyName === companyName);
    if (!insurance)
        throw new Error("شرکت بیمه پیدا نشد");
    insurance.contractPrice = newPrice;
    return await service.save();
};
exports.updateInsurancePrice = updateInsurancePrice;
