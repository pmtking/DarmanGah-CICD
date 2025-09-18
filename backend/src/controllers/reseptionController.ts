import { Request, Response } from "express";
import { registerNewReception } from "../services/reseptionService";
import { generateReceptionPdf } from "../services/pdfService";
// import { registerNewReception } from "../services/receptionService";



export const createReceptionController = async (req: Request, res: Response) => {

  try {
    const data = req.body;
    // console.log(data);
    const { reception, totalAmount } = await registerNewReception(data);

    // تولید PDF و ارسال به کلاینت
    // return generateReceptionPdf(res, reception, totalAmount);
    return res.status(200).json({
      reception ,
      totalAmount

    })

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
