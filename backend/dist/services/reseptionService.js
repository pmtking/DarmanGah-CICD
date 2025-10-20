"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerNewReception = registerNewReception;
const clinicService_1 = __importDefault(require("../models/clinicService"));
const Patient_1 = __importDefault(require("../models/Patient"));
const DoctorProfile_1 = __importDefault(require("../models/DoctorProfile"));
const Reseption_1 = __importDefault(require("../models/Reseption"));
// تابع ثبت پذیرش جدید
async function registerNewReception(data) {
    // 1️⃣ بررسی وجود بیمار
    let patient = await Patient_1.default.findOne({ nationalId: data.nationalId });
    if (!patient) {
        patient = await Patient_1.default.create({
            nationalId: data.nationalId,
            name: data.patientName,
            phoneNumber: data.phoneNumber,
            visits: [],
        });
    }
    // 2️⃣ محاسبه خدمات با بیمه
    const servicesWithPrice = [];
    let totalAmount = 0;
    let totalBaseInsurance = 0;
    let totalExtraInsurance = 0;
    const serviceNames = [];
    for (const s of data.services) {
        const service = await clinicService_1.default.findById(s.serviceId);
        if (!service)
            throw new Error(`خدمت با شناسه ${s.serviceId} پیدا نشد`);
        serviceNames.push(service.serviceName);
        let price = service.pricePublic;
        let baseInsurancePrice = 0;
        let extraInsurancePrice = 0;
        // کسر بیمه پایه از تعرفه آزاد
        if (service.baseInsurances?.length) {
            const base = service.baseInsurances.find(b => b.companyName.normalize("NFC") === data.insuranceType.normalize("NFC"));
            if (base) {
                baseInsurancePrice = base.contractPrice;
                price -= baseInsurancePrice;
            }
        }
        // کسر بیمه تکمیلی از مبلغ باقی‌مانده
        if (data.supplementaryInsurance && service.supplementaryInsurances?.length) {
            const extra = service.supplementaryInsurances.find(b => b.companyName.normalize("NFC") === data.supplementaryInsurance.normalize("NFC"));
            if (extra) {
                extraInsurancePrice = extra.contractPrice;
                price -= extraInsurancePrice;
            }
        }
        if (price < 0)
            price = 0;
        totalAmount += price * s.quantity;
        totalBaseInsurance += baseInsurancePrice * s.quantity;
        totalExtraInsurance += extraInsurancePrice * s.quantity;
        servicesWithPrice.push({
            serviceId: service._id,
            quantity: s.quantity,
            price: price * s.quantity,
        });
    }
    // 3️⃣ دریافت اطلاعات پزشک
    const doctor = await DoctorProfile_1.default.findById(data.doctorId);
    const doctorName = doctor?.name || "نام پزشک";
    const doctorSpecialty = doctor?.specialty || "تخصص";
    // 4️⃣ ایجاد رکورد پذیرش
    const reception = await Reseption_1.default.create({
        patientName: patient.name,
        phoneNumber: patient.phoneNumber,
        doctorId: data.doctorId,
        staffId: data.staffId,
        visitType: data.visitType,
        insuranceType: data.insuranceType,
        supplementaryInsurance: data.supplementaryInsurance,
        appointmentDate: new Date(data.appointmentDate),
        appointmentTime: data.appointmentTime,
        services: servicesWithPrice,
    });
    // 5️⃣ اتصال به پرونده بیمار
    patient.visits.push(reception._id);
    await patient.save();
    // 6️⃣ آماده‌سازی داده برای فرانت و پرینتر
    const receiptData = {
        patient_name: patient.name,
        doctor_name: doctorName,
        doctor_specialty: doctorSpecialty,
        services: servicesWithPrice.map((s, idx) => ({
            name: serviceNames[idx],
            quantity: s.quantity,
            price: s.price,
        })),
        total_payment: totalAmount,
        insurance_base: totalBaseInsurance,
        insurance_extra: totalExtraInsurance,
        appointmentDate: data.appointmentDate,
        appointmentTime: data.appointmentTime,
        turn_number: "25",
        bill_number: reception._id.toString(),
        date: data.appointmentDate,
        time: data.appointmentTime,
        national_code: data.nationalId,
        visit_type: data.visitType,
        footer_text: "drfn.ir",
        reception_user: "رضا حسینی",
    };
    return { reception, totalAmount, receiptData };
}
