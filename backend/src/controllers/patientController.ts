import PatientProfile from "../models/Patient";
import { Response, Request } from "express";
export const UserRepo = async (req: Request, res: Response) => {
  const { nationalId }: any = req.body;

  try {
    const user = await PatientProfile.find();
    return res.status(200).json({
      success: true,
      message: "لیست کامل پرونده ها ",
      data: user,
    });
  } catch (e) {
    return res.status(200).json({
      success: false,
      message: "خطا در دیافت",
    });
  }
};
