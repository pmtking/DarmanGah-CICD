
import Personnel from "../models/Personnel";
import {
  createpersonnel,
  deletePersonnel,
  LoginpersonelService,
  updatePersonnel,
} from "../services/personnelService";
import jwt from 'jsonwebtoken';
import { Request , Response } from "express";
export const addPersonnelController = async (req, res) => {
  try {
    const personel = await createpersonnel(req.body);
    return res.status(201).json({
      success:true ,
      messgae:'پرسنل با موفقیت ایجاد شد' ,
      data:personel
    });
  } catch (err: any) {
    
    res.status(500).json({ message: err.message });
  }
};

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function loginPersonnelController(req, res) {
  try {
    const data = req.body;
    console.log(req.body);

    if (!data.userName || !data.password) {
      return res
        .status(400)
        .json({ message: 'Username and password are required' });
    }

    const user = await LoginpersonelService(data);

    // تولید توکن JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '1d' } // اعتبار توکن: 1 روز
    );

    res.status(200).json({
      message: 'Login successful',
      user,
      token,
    });
  } catch (error:any) {
    res.status(401).json({
      message: error.message || 'Login failed',
    });
  }
}

export const findPersonel = async (req , res) => {
  const data = await Personnel.find()
  return res.json({data})
}


export const updatePersonnelController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedPersonnel = await updatePersonnel(id, updateData);

    return res.status(200).json({
      success: true,
      message: 'پرسنل با موفقیت به‌روزرسانی شد.',
      data: updatedPersonnel,
    });
  } catch (err: any) {
    if (err.message === 'Personnel not found.') {
      return res.status(404).json({ message: err.message });
    }
    res.status(400).json({ message: err.message });
  }
};
export const deletePersonnelController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await deletePersonnel(id);

    return res.status(200).json({
      success: true,
      message: 'پرسنل با موفقیت حذف شد.',
    });
  } catch (err: any) {
    if (err.message === 'Personnel not found.') {
      return res.status(404).json({ message: err.message });
    }
    res.status(400).json({ message: err.message });
  }
};