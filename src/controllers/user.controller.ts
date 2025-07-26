import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { AuthRequest } from '../middlewares/auth.middleware';
import User from '../models/user.model';
import fs from 'fs';
import path from 'path';
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
  
      // const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await User.create({
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

    // Handle profile_pic if uploaded
    const profile_pic = req.file
  ? `${API_URL}/assets/UserData/${req.file.originalname}`
  : user.profile_pic;

    const updateData: any = {
  username,
  full_name,
  role,
  email,
  age,
  country,
  state,
  city,
  pincode,
  mobile_no,
  profile_pic
};

if (password) {
  updateData.password = password;
}

await user.update(updateData);

    
    res.status(200).json({
      message: 'User updated successfully',
      user: {
        ...user.toJSON(),
        profile_pic: user.profile_pic ? `${baseUrl}${user.profile_pic}` : null
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user', error });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Delete the profile picture if it exists
    if (user.profile_pic) {
      const imagePath = path.join(__dirname, '../../', user.profile_pic);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err });
  }
};



  
