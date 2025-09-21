import { Request, Response } from "express";
import {
  addSupplementaryInsurance,
  createSevice,
  deleteServices,
  getAllServices,
  getServicesById,
  updateInsurancePrice,
  updateService,
} from "../services/clinicService.service";
import ClinicService from "../models/clinicService";

// کنترلر افزودن سرویس
export const createClinicService = async (req: Request, res: Response) => {
  try {
    const {
      serviceCode,
      serviceName,
      serviceGroup,
      pricePublic,
      priceGovernmental,
      baseInsurances,
      supplementaryInsurances,
      isFreeForStaff,
    } = req.body;

    // اعتبارسنجی اولیه
    if (!serviceCode || !serviceName || !serviceGroup) {
      return res.status(400).json({ message: "فیلدهای الزامی پر نشده‌اند" });
    }

    // بررسی یکتا بودن serviceCode
    const exists = await ClinicService.findOne({ serviceCode });
    if (exists) {
      return res.status(409).json({ message: "کد خدمت قبلاً ثبت شده است" });
    }

    // ایجاد سرویس جدید
    const newService = await createSevice({
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
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({
      message: "خطا در ایجاد سرویس",
      error: err.message,
    });
  }
};
// کنترلر دریافت همه سرویس‌ها
export const getAllClinicServices = async (_req: Request, res: Response) => {
  try {
    const result = await getAllServices();
    res.status(200).json(result);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "خطا در دریافت سرویس‌ها", error: err.message });
  }
};

// کنترلر دریافت سرویس خاص
export const getClinicServiceById = async (req: Request, res: Response) => {
  try {
    const result = await getServicesById(req.params.id);
    if (!result) return res.status(404).json({ message: "سرویس پیدا نشد" });
    res.status(200).json(result);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "خطا در دریافت سرویس", error: err.message });
  }
};

// کنترلر ویرایش سرویس
export const updateClinicService = async (req: Request, res: Response) => {
  try {
    const result = await updateService(req.params.id, req.body);
    if (!result) return res.status(404).json({ message: "سرویس پیدا نشد" });
    res.status(200).json(result);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "خطا در ویرایش سرویس", error: err.message });
  }
};

// کنترلر حذف سرویس
export const deleteClinicService = async (req: Request, res: Response) => {
  try {
    const result = await deleteServices(req.params.id);
    if (!result) return res.status(404).json({ message: "سرویس پیدا نشد" });
    res.status(200).json({ message: "سرویس حذف شد" });
  } catch (err) {
    res.status(500).json({ message: "خطا در حذف سرویس", error: err.message });
  }
};

// کنترلر افزودن بیمه تکمیلی
export const addInsurance = async (req: Request, res: Response) => {
  try {
    const result = await addSupplementaryInsurance(
      req.params.serviceId,
      req.body
    );
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: "خطا در افزودن بیمه", error: err.message });
  }
};

// کنترلر آپدیت قیمت بیمه
export const updateInsurance = async (req: Request, res: Response) => {
  try {
    const result = await updateInsurancePrice(
      req.params.serviceId,
      req.params.companyName,
      req.body.contractPrice
    );
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ message: "خطا در آپدیت بیمه", error: err.message });
  }
};
