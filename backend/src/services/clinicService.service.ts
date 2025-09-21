
import ClinicService, { IClinicService, IInsurance,  } from "../models/clinicService";


//  ---------------------------- add service -------------- //
export const createSevice = async (date:Partial<IClinicService>) => {
    const service = new ClinicService(date)
    return await service.save();
}


// --------------------------- find all service ------------ //
export const getAllServices = async () => {
    return await ClinicService.find() ;
}

// ----------------------- get services BY id -------------------- //
export const getServicesById = async(id:string) => {
    return await ClinicService.findById(id) ;

}

// ------------------ update services --------------------- //
export const updateService = async (id:string , data: Partial<IClinicService>) => {
    return await ClinicService.findByIdAndUpdate(id , data , {new:true})
} 

// ------------------------- delete service ----------------- //

export const deleteServices = async (id) => {
    return await ClinicService.findByIdAndDelete(id);

}

// ------------------------------- addSupplementaryInsurance --------------------- //
export const addSupplementaryInsurance = async (
  serviceId: string,
  insurance: IInsurance
) => {
  // پیدا کردن خدمت
  const service = await ClinicService.findById(serviceId);
  if (!service) return null;

  // بررسی اینکه بیمه مشابه قبلاً ثبت نشده باشد
  const exists = service.supplementaryInsurances.some(
    (ins) => ins.companyName === insurance.companyName
  );
  if (exists) throw new Error("این شرکت بیمه قبلا ثبت شده است");

  // اضافه کردن بیمه جدید
  service.supplementaryInsurances.push(insurance);

  // ذخیره تغییرات
  return await service.save();
};

// ------------------------------------ updateInsurancePrice ---------------------- //

export const updateInsurancePrice = async (
  serviceId: string,
  type: "base" | "supplementary", // نوع بیمه
  companyName: string,
  newPrice: number
) => {
  const service = await ClinicService.findById(serviceId);
  if (!service) return null;

  // انتخاب آرایه بیمه مناسب
  const insuranceArray =
    type === "base"
      ? service.baseInsurances
      : service.supplementaryInsurances;

  const insurance = insuranceArray.find(
    (ins) => ins.companyName === companyName
  );

  if (!insurance) throw new Error("شرکت بیمه پیدا نشد");

  insurance.contractPrice = newPrice;
  return await service.save();
};