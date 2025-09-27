import { Request, Response } from "express";
import { registerNewReception } from "../services/reseptionService";

// import { registerNewReception } from "../services/receptionService";



export const createReceptionController = async (req: Request, res: Response) => {

  try {
    const data = req.body;

    const { reception, totalAmount } = await registerNewReception(data);

    return res.status(200).json({
      reception ,
      totalAmount

    })

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
