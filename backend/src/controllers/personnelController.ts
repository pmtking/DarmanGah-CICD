import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Personnel from "../models/Personnel";
import {
  createpersonnel,
  deletePersonnel,
  LoginpersonelService,
  updatePersonnel,
} from "../services/personnelService";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// ================== ایجاد پرسنل ==================
export const addPersonnelController = async (req: Request, res: Response) => {
  try {
    const personnel = await createpersonnel(req.body);

    return res.status(201).json({
      success: true,
      message: "پرسنل با موفقیت ایجاد شد",
      data: personnel,
    });
  } catch (err: any) {
    console.error("Error in addPersonnelController:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ================== ورود پرسنل ==================
export const loginPersonnelController = async (req: Request, res: Response) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Username and password are required",
        });
    }

    const user = await LoginpersonelService({ userName, password });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });
    }

    // تولید توکن JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username || user.name,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
      token,
    });
  } catch (err: any) {
    console.error("Error in loginPersonnelController:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Login failed",
    });
  }
};

// ================== لیست پرسنل ==================
export const findPersonnelController = async (_req: Request, res: Response) => {
  try {
    const data = await Personnel.find();
    return res.status(200).json({ success: true, data });
  } catch (err: any) {
    console.error("Error in findPersonnelController:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ================== به‌روزرسانی پرسنل ==================
export const updatePersonnelController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedPersonnel = await updatePersonnel(id, updateData);

    return res.status(200).json({
      success: true,
      message: "پرسنل با موفقیت به‌روزرسانی شد",
      data: updatedPersonnel,
    });
  } catch (err: any) {
    console.error("Error in updatePersonnelController:", err);
    if (err.message === "Personnel not found.") {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
};

// ================== حذف پرسنل ==================
export const deletePersonnelController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    await deletePersonnel(id);

    return res.status(200).json({
      success: true,
      message: "پرسنل با موفقیت حذف شد",
    });
  } catch (err: any) {
    console.error("Error in deletePersonnelController:", err);
    if (err.message === "Personnel not found.") {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
};
