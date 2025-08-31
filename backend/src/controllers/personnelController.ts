import Personnel from "../models/Personnel";
import {
  createpersonnel,
  LoginpersonelService,
} from "../services/personnelService";
import jwt from 'jsonwebtoken';

export const addPersonnelController = async (req, res) => {
  try {
    const personel = await createpersonnel(req.body);
    return res.status(201).json(personel);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
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