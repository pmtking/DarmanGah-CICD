"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReseptionController = void 0;
const Reseption_1 = __importDefault(require("../models/Reseption"));
const clinicService_1 = __importDefault(require("../models/clinicService"));
const createReseptionController = async (req, res) => {
    try {
        const { patientName, phoneNumber, relationWithGuardian, visitType, insuranceType, supplementaryInsurance, doctorId, staffId, appointmentDate, appointmentTime, services, } = req.body;
        // اعتبارسنجی اولیه
        if (!patientName ||
            !doctorId ||
            !staffId ||
            !appointmentDate ||
            !appointmentTime ||
            !services?.length) {
            return res.status(400).json({
                success: false,
                message: "اطلاعات لازم کامل نیست",
            });
        }
        let totalPayment = 0;
        const servicesWithPayment = [];
        for (const s of services) {
            const serviceData = await clinicService_1.default.findById(s.serviceId);
            if (!serviceData)
                continue;
            let basePrice = serviceData.pricePublic; // قیمت پایه
            // محاسبه قیمت با بیمه
            if (insuranceType) {
                const matchedBase = serviceData.baseInsurances.find((ins) => ins.companyName === insuranceType);
                basePrice = matchedBase?.contractPrice || serviceData.priceGovernmental;
            }
            // کاهش قیمت با بیمه تکمیلی
            if (supplementaryInsurance) {
                const matchedSupp = serviceData.supplementaryInsurances.find((ins) => ins.companyName === supplementaryInsurance);
                if (matchedSupp)
                    basePrice -= matchedSupp.contractPrice || 0;
            }
            const quantity = s.quantity || 1;
            const finalPrice = basePrice * quantity;
            totalPayment += finalPrice;
            servicesWithPayment.push({
                serviceId: serviceData._id,
                quantity,
                price: finalPrice,
                name: serviceData.name,
            });
        }
        // ذخیره نوبت در دیتابیس
        const reseption = new Reseption_1.default({
            patientName,
            phoneNumber,
            relationWithGuardian,
            visitType,
            insuranceType,
            supplementaryInsurance,
            doctorId,
            staffId,
            appointmentDate,
            appointmentTime,
            services: servicesWithPayment,
            status: "reserved",
        });
        await reseption.save();
        // ارسال پاسخ به فرانت
        return res.status(201).json({
            success: true,
            reseption,
            totalPayment,
            message: "نوبت ثبت شد و محاسبه قیمت انجام شد",
        });
    }
    catch (error) {
        console.error("Error creating reseption:", error);
        return res.status(500).json({
            success: false,
            message: "خطا در ثبت نوبت یا محاسبه قیمت",
        });
    }
};
exports.createReseptionController = createReseptionController;
