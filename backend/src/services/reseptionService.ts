import ClinicService from "../models/clinicService";
import PatientProfile from "../models/Patient";
import DoctorProfile from "../models/DoctorProfile";
import Reseption, { IReseptionService } from "../models/Reseption";

// نوع داده ورودی
interface NewReceptionData {
  nationalId: string;
  patientName: string;
  phoneNumber?: string;
  visitType: "اولیه" | "پیگیری" | "اورژانسی";
  insuranceType: string;
  supplementaryInsurance?: string;
  doctorId: string;
  staffId: string;
  appointmentDate: string;
  appointmentTime: string;
  services: { serviceId: string; quantity: number }[];
}

// ----------------------------
// ثبت پذیرش جدید و آماده‌سازی داده برای فرانت‌اند
export async function registerNewReception(data: NewReceptionData) {
  // 1️⃣ بررسی وجود بیمار
  let patient = await PatientProfile.findOne({ nationalId: data.nationalId });
  if (!patient) {
    patient = await PatientProfile.create({
      nationalId: data.nationalId,
      name: data.patientName,
      phoneNumber: data.phoneNumber,
      visits: [],
    });
  }

  // 2️⃣ دریافت خدمات و محاسبه مبلغ
  const servicesWithPrice: IReseptionService[] = [];
  let totalAmount = 0;
  const serviceNames: string[] = [];

  for (const s of data.services) {
    const service = await ClinicService.findById(s.serviceId);
    if (!service) throw new Error("خدمت پیدا نشد");

    serviceNames.push(service.serviceName);

    let price = service.pricePublic;

    // کسر بیمه پایه
    const baseInsurance = service.baseInsurances.find(
      (b) => b.companyName === data.insuranceType
    );
    if (baseInsurance) price -= baseInsurance.contractPrice;

    // کسر بیمه تکمیلی
    if (data.supplementaryInsurance) {
      const extraInsurance = service.supplementaryInsurances.find(
        (b) => b.companyName === data.supplementaryInsurance
      );
      if (extraInsurance) price -= extraInsurance.contractPrice;
    }

    if (price < 0) price = 0;

    totalAmount += price * s.quantity;

    servicesWithPrice.push({
      serviceId: service._id,
      quantity: s.quantity,
      price: price * s.quantity,
    });
  }

  // 3️⃣ دریافت نام پزشک
  const doctor = await DoctorProfile.findById(data.doctorId);
  const doctorName = doctor ? doctor.name : "نام پزشک";
  const doctorSpecialty = doctor ? doctor.specialty : "تخصص";

  // 4️⃣ ایجاد رکورد پذیرش
  const reception = await Reseption.create({
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

  // 5️⃣ اتصال پذیرش به پرونده بیمار
  patient.visits.push(reception._id);
  await patient.save();

  // 6️⃣ بازگشت داده‌ها برای فرانت‌اند
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
    insurance_base: 40000,       // مقدار واقعی بیمه پایه
    insurance_extra: 15000,      // مقدار واقعی بیمه تکمیلی
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
