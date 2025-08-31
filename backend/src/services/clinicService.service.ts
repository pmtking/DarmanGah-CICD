import { date } from "joi";
import ClinicService, { IClinicService, ISupplementaryInsurance } from "../models/clinicService";


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
export const addSupplementaryInsurance = async (serviceId :string ,insurance:ISupplementaryInsurance ) => {
    const service = await ClinicService.findById(serviceId) ;
    if(!service) return null;
    const exists = service.supplementaryInsurances.some(
        (ins) => ins.companyName === insurance.companyName
    ) ;
    if(exists) throw new Error("این شرکت بیمه قبلا ثبت شده است") ;
    service.supplementaryInsurances.push(insurance) ;
    return await service.save();
} 

// ------------------------------------ updateInsurancePrice ---------------------- //

export const updateInsurancePrice = async (
  serviceId: string,
  companyName: string,
  newPrice: number
) => {
  const service = await ClinicService.findById(serviceId);
  if (!service) return null;

  const insurance = service.supplementaryInsurances.find(
    (ins) => ins.companyName === companyName
  );
  if (!insurance) throw new Error("شرکت بیمه پیدا نشد");

  insurance.contractPrice = newPrice;
  return await service.save();
};