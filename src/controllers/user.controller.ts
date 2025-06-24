import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { AuthRequest } from '../middlewares/auth.middleware';
import User from '../models/user.model';

export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
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
  
      const profile_pic = req.file ? `/assets/UserData/${req.file.originalname}` : null;
  
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
  
