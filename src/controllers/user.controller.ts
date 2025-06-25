import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { AuthRequest } from '../middlewares/auth.middleware';
import User from '../models/user.model';
import dotenv from 'dotenv';
dotenv.config();

const API_URL = process.env.API_URL || "http://localhost:5000";

export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const userId = req.user?.id;
  
    try {
      const user = await User.findByPk(userId, {
        attributes: ['id', 'username', 'email', 'role', 'full_name', 'profile_pic'] // ✅ added
      });
  
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
  
      res.status(200).json({ user });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching user info' });
    }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {

  const baseUrl = `${req.protocol}://${req.get("host")}`; // http://localhost:5000

    try {
      const {
        username,
        full_name,
        password,
        role,
        email,
        age,
        country,
        state,
        city,
        pincode,
        mobile_no
      } = req.body;
  
      const profile_pic = req.file ? `${API_URL}/assets/UserData/${req.file.originalname}` : null;
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await User.create({
        username,
        full_name,
        password: hashedPassword,
        role,
        email,
        age,
        country,
        state,
        city,
        pincode,
        mobile_no,
        profile_pic
      });

      res.status(201).json({ message: 'User created', user });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create user', error });
    }
};

export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll();
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  try {
    const { id } = req.params;

    const {
      username,
      full_name,
      password,
      role,
      email,
      age,
      country,
      state,
      city,
      pincode,
      mobile_no
    } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Hash password if provided
    let hashedPassword = user.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await user.update({
      username,
      full_name,
      password: hashedPassword,
      role,
      email,
      age,
      country,
      state,
      city,
      pincode,
      mobile_no
    });

    res.status(200).json({
      message: 'User updated successfully',
      user,
    });    
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user', error });
  }
};
  
