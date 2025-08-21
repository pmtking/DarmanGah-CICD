import { Request, Response } from "express";
import { RegisterType } from "../types/global";
import User from "../models/UserAuth";
import { hashPassword } from "../utils/hash";
import { signJWT } from "../utils/jwt";

export async function RegisterController(req: Request, res: Response) {
  const body = req.body as RegisterType;
  const { number, role, password } = body;

  try {
    if (!number || !role) {
      return res.status(400).json({ error: "شماره و نقش الزامی هستند." });
    }

    // کاربر با نقش USER
    if (role === "USER") {
      const user = new User({ number, role });
      await user.save();
      return res.status(200).json({ data: user });
    }

    // کاربر با نقش ADMIN
    if (role === "ADMIN") {
      if (!password || typeof password !== "string" || password.trim() === "") {
        return res.status(400).json({ error: "رمز عبور الزامی است." });
      }

      const hashpass = await hashPassword(password);
      const user = new User({ number, role, password: hashpass });
      await user.save();

      const token = signJWT({ id: user._id, role: user.role });

      return res.status(200).json({
        message: "ثبت ‌نام با موفقیت انجام شد.",
        data: {
          user ,
          token: token,

        },
      });
    }

    // نقش نامعتبر
    return res.status(400).json({ error: "نقش نامعتبر است." });
  } catch (error: any) {
    if (error.code === 11000 && error.keyPattern?.number) {
      return res.status(409).json({ error: "این شماره قبلاً ثبت شده است." });
    }

    console.error("Register error:", error);
    return res.status(500).json({ error: "خطای داخلی سرور" });
  }
}
